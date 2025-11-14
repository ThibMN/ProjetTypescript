// Réalisé par Alexis

import { Book, demoBooks } from "./book";
import { Student, demoStudents } from "./user";

export type LoanStatus = "ongoing" | "returned";

export interface Loan {
  book: Book;
  student: Student;
  date: Date;
  dueDate: Date;
  status: LoanStatus;
  returnedAt?: Date;
}

export const MAX_ACTIVE_LOANS = 3;
export const LOAN_DURATION_DAYS = 14;
export const DAILY_PENALTY = 1;

export const calculateDueDate = (
  startDate: Date,
  durationDays = LOAN_DURATION_DAYS
): Date => {
  const due = new Date(startDate);
  due.setDate(due.getDate() + durationDays);
  return due;
};

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

export const getOverdueLoans = (
  loans: Loan[],
  referenceDate = new Date()
): Loan[] => {
  return loans.filter(
    (loan) => loan.status === "ongoing" && referenceDate > loan.dueDate
  );
};

export const getLateDays = (loan: Loan, referenceDate = new Date()): number => {
  if (referenceDate <= loan.dueDate) {
    return 0;
  }
  const diffMs = referenceDate.getTime() - loan.dueDate.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const calculatePenalty = (
  loan: Loan,
  referenceDate = new Date(),
  dailyRate = DAILY_PENALTY
): number => getLateDays(loan, referenceDate) * dailyRate;

export const demoLoans: Loan[] = [
  {
    book: demoBooks[0],
    student: demoStudents[0],
    date: new Date("2025-01-10"),
    dueDate: calculateDueDate(new Date("2025-01-10")),
    status: "ongoing"
  },
  {
    book: demoBooks[1],
    student: demoStudents[0],
    date: new Date("2025-01-15"),
    dueDate: calculateDueDate(new Date("2025-01-15")),
    status: "returned",
    returnedAt: new Date("2025-01-25")
  },
  {
    book: demoBooks[2],
    student: demoStudents[1],
    date: new Date("2025-02-01"),
    dueDate: calculateDueDate(new Date("2025-02-01")),
    status: "ongoing"
  }
];