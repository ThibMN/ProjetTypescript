import { Book, demoBooks } from "./book";
import { Student, demoStudents } from "./user";

export type LoanStatus = "ongoing" | "returned";

export interface Loan {
  book: Book;
  student: Student;
  date: Date;
  status: LoanStatus;
}

export const MAX_ACTIVE_LOANS = 3;

export const getActiveLoans = (loans: Loan[]): Loan[] =>
  loans.filter((loan) => loan.status === "ongoing");

export const getLoansByStudent = (loans: Loan[], studentId: number): Loan[] =>
  loans.filter((loan) => loan.student.id === studentId);

export const hasReachedLoanLimit = (loans: Loan[], student: Student): boolean => {
  const activeLoans = getLoansByStudent(loans, student.id).filter(
    (loan) => loan.status === "ongoing"
  );
  return activeLoans.length >= MAX_ACTIVE_LOANS;
};

export const demoLoans: Loan[] = [
  {
    book: demoBooks[0],
    student: demoStudents[0],
    date: new Date("2025-01-10"),
    status: "ongoing"
  },
  {
    book: demoBooks[1],
    student: demoStudents[0],
    date: new Date("2025-01-15"),
    status: "returned"
  },
  {
    book: demoBooks[2],
    student: demoStudents[1],
    date: new Date("2025-02-01"),
    status: "ongoing"
  }
];