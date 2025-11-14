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

}