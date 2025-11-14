// Réalisé par Rayan

import { Book, demoBooks } from "./book";
import { Loan, LoanStatus, demoLoans, hasReachedLoanLimit } from "./loan";
import { Student } from "./user";

export class Library {
  private books: Book[] = [];
  private loans: Loan[] = [];

  constructor(initialBooks: Book[] = [], initialLoans: Loan[] = []) {
    this.books = [...initialBooks];
    this.loans = [...initialLoans];
  }

  addBook(book: Book): void {
    if (this.findBookById(book.id)) {
      throw new Error(`Le livre ${book.id} existe deja.`);
    }
    this.books.push(book);
  }

  listAvailable(): Book[] {
    return this.books.filter((book) => book.available);
  }

  findBookById(id: number): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  
  getLoans(): Loan[] {
    return [...this.loans];
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

    const newLoan: Loan = {
      book,
      student,
      date: new Date(),
      status: "ongoing"
    };

    book.available = false;
    this.loans.push(newLoan);
    return newLoan;
  }

  returnBook(bookId: number): Loan | undefined {
    const loan = this.loans.find(
      (item) => item.book.id === bookId && item.status === "ongoing"
    );
    if (!loan) {
      return undefined;
    }

    loan.status = "returned";
    const book = this.findBookById(bookId);
    if (book) {
      book.available = true;
    }
    return loan;
  }
}

export const demoLibrary = new Library(demoBooks, demoLoans);
