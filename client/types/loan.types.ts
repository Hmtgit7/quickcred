import { LoanStatus } from "./enums";
import { User } from "./user.types";

export interface Loan {
  _id: string;
  borrowerId: string | User;
  principalAmount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  status: LoanStatus;
  salarySlipUrl?: string;
  rejectionReason?: string;
  sanctionedBy?: string;
  disbursedBy?: string;
  sanctionedAt?: string;
  disbursedAt?: string;
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
