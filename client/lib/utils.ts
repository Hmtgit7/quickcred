import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LOAN_CONSTANTS } from "@/constants/app.constants";
import { LoanStatus } from "@/types/enums";

/** Tailwind class merger — shadcn/ui standard utility */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupee */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format ISO date string to readable date */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const defaults: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-IN", options ?? defaults);
}

/** Format ISO datetime to readable datetime */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Calculate simple interest and total repayment */
export function calculateLoan(principal: number, tenureDays: number) {
  const rate = LOAN_CONSTANTS.INTEREST_RATE;
  const simpleInterest = (principal * rate * tenureDays) / (365 * 100);
  const totalRepayment = principal + simpleInterest;
  return {
    principal,
    tenureDays,
    interestRate: rate,
    simpleInterest: Math.round(simpleInterest),
    totalRepayment: Math.round(totalRepayment),
  };
}

/** Map LoanStatus to a human-readable label */
export function getLoanStatusLabel(status: LoanStatus): string {
  const labels: Record<LoanStatus, string> = {
    [LoanStatus.Pending]: "Pending",
    [LoanStatus.Applied]: "Applied",
    [LoanStatus.Sanctioned]: "Sanctioned",
    [LoanStatus.Disbursed]: "Disbursed",
    [LoanStatus.Closed]: "Closed",
    [LoanStatus.Rejected]: "Rejected",
  };
  return labels[status] ?? status;
}

/** Get the Tailwind variant for a loan status */
export function getLoanStatusVariant(
  status: LoanStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case LoanStatus.Disbursed:
    case LoanStatus.Closed:
      return "default";
    case LoanStatus.Sanctioned:
    case LoanStatus.Applied:
      return "secondary";
    case LoanStatus.Rejected:
      return "destructive";
    default:
      return "outline";
  }
}

/** Truncate a string with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/** Get user initials from full name or email */
export function getInitials(nameOrEmail: string): string {
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nameOrEmail.slice(0, 2).toUpperCase();
}

/** Calculate age from ISO date string */
export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Validate PAN format */
export function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
}
