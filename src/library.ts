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