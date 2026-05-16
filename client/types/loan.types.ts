import { LoanStatus } from "./enums";
import { User } from "./user.types";

export interface Loan {
  _id: string;
  borrowerId: string | User;
  borrower?: Pick<User, "_id" | "fullName" | "email">;
  principalAmount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  outstandingAmount?: number;
  status: LoanStatus;
  salarySlipUrl?: string;
  rejectionReason?: string;
  sanctionedBy?: string;
  disbursedBy?: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  disbursalUtrNumber?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanPayload {
  principalAmount: number;
  tenureDays: number;
}

export interface LoanCalculation {
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}
