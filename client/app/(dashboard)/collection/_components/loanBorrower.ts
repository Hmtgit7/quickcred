import type { Loan } from "@/types/loan.types";
import type { User } from "@/types/user.types";

export function getLoanBorrower(
  loan: Loan
): Pick<User, "_id" | "fullName" | "email"> | null {
  if (loan.borrower) return loan.borrower;
  return typeof loan.borrowerId === "object" ? loan.borrowerId : null;
}
