// Réalisé par Rayan

import { Book, demoBooks } from "./book";
import {
  Loan,
  calculateDueDate,
  calculatePenalty,
  demoLoans,
  getLateDays,
  getOverdueLoans as filterOverdueLoans,
  hasReachedLoanLimit
} from "./loan";
import { Student } from "./user";

export interface Reservation {
  bookId: number;
  student: Student;
  requestedAt: Date;
}

export class Library {
  private books: Book[] = [];
  private loans: Loan[] = [];
  private reservations = new Map<number, Reservation[]>();

  constructor(initialBooks: Book[] = [], initialLoans: Loan[] = []) {
    this.books = initialBooks.map((book) => ({
      ...book,
      author: { ...book.author }
    }));

    this.loans = initialLoans.map((loan) => {
      const bookRef = this.findBookById(loan.book.id) ?? {
        ...loan.book,
        author: { ...loan.book.author }
      };
      if (loan.status === "ongoing") {
        bookRef.available = false;
      }
      return {
        ...loan,
        book: bookRef,
        date: new Date(loan.date),
        dueDate: new Date(loan.dueDate),
        returnedAt: loan.returnedAt ? new Date(loan.returnedAt) : undefined
      };
    });
  }

  addBook(book: Book): void {
    if (this.findBookById(book.id)) {
      throw new Error(`Le livre ${book.id} existe deja.`);
    }
    this.books.push({ ...book, author: { ...book.author } });
  }

  listAvailable(): Book[] {
    return this.books.filter((book) => book.available);
  }

  findBookById(id: number): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  getLoans(): Loan[] {
    return this.loans.map((loan) => ({ ...loan }));
  }

  borrowBook(bookId: number, student: Student): Loan {
    const book = this.findBookById(bookId);
    if (!book) {
      throw new Error(`Livre ${bookId} introuvable`);
    }
    if (!book.available) {
      throw new Error(`Livre ${bookId} deja emprunte`);
    }
    if (hasReachedLoanLimit(this.loans, student)) {
      throw new Error(`Limite de ${student.getFullName()} atteinte`);
    }

    const now = new Date();
    const newLoan: Loan = {
      book,
      student,
      date: now,
      dueDate: calculateDueDate(now),
      status: "ongoing"
    };

    book.available = false;
    this.loans.push(newLoan);
    return newLoan;
  }

  reserveBook(bookId: number, student: Student): Reservation {
    const book = this.findBookById(bookId);
    if (!book) {
      throw new Error(`Livre ${bookId} introuvable`);
    }
    if (book.available) {
      throw new Error("Le livre est disponible, empruntez-le directement.");
    }

    const queue = this.reservations.get(bookId) ?? [];
    if (queue.some((reservation) => reservation.student.id === student.id)) {
      throw new Error("Cet etudiant est deja dans la file d'attente pour ce livre.");
    }

    const reservation: Reservation = {
      bookId,
      student,
      requestedAt: new Date()
    };
    queue.push(reservation);
    this.reservations.set(bookId, queue);
    return reservation;
  }

  getReservations(bookId?: number): Reservation[] {
    if (typeof bookId === "number") {
      return [...(this.reservations.get(bookId) ?? [])];
    }
    return Array.from(this.reservations.values()).flat();
  }

  returnBook(bookId: number): Loan | undefined {
    const loan = this.loans.find(
      (item) => item.book.id === bookId && item.status === "ongoing"
    );
    if (!loan) {
      return undefined;
    }

    loan.status = "returned";
    loan.returnedAt = new Date();

    const reloan = this.fulfillReservation(bookId);
    if (!reloan) {
      const book = this.findBookById(bookId);
      if (book) {
        book.available = true;
      }
    }
    return loan;
  }

  getOverdueLoans(referenceDate = new Date()): Loan[] {
    return filterOverdueLoans(this.loans, referenceDate);
  }

  getPenalties(referenceDate = new Date()): Array<{
    loan: Loan;
    lateDays: number;
    penalty: number;
  }> {
    return this.getOverdueLoans(referenceDate).map((loan) => ({
      loan,
      lateDays: getLateDays(loan, referenceDate),
      penalty: calculatePenalty(loan, referenceDate)
    }));
  }

  getBookStatuses(): Array<{
    book: Book;
    currentLoan?: Loan;
    reservations: Reservation[];
  }> {
    return this.books.map((book) => ({
      book,
      currentLoan: this.loans.find(
        (loan) => loan.book.id === book.id && loan.status === "ongoing"
      ),
      reservations: [...(this.reservations.get(book.id) ?? [])]
    }));
  }

  private fulfillReservation(bookId: number): Loan | undefined {
    const queue = this.reservations.get(bookId);
    if (!queue || queue.length === 0) {
      this.reservations.delete(bookId);
      return undefined;
    }

    while (queue.length > 0) {
      const reservation = queue.shift()!;
      if (hasReachedLoanLimit(this.loans, reservation.student)) {
        continue;
      }

      const book = this.findBookById(bookId);
      if (!book) {
        return undefined;
      }

      const now = new Date();
      const newLoan: Loan = {
        book,
        student: reservation.student,
        date: now,
        dueDate: calculateDueDate(now),
        status: "ongoing"
      };
      book.available = false;
      this.loans.push(newLoan);

      if (queue.length === 0) {
        this.reservations.delete(bookId);
      } else {
        this.reservations.set(bookId, queue);
      }
      return newLoan;
    }

    this.reservations.delete(bookId);
    return undefined;
  }
}

export const createDemoLibrary = (): Library => new Library(demoBooks, demoLoans);
export const demoLibrary = createDemoLibrary();
