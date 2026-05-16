import type { LoanStatus } from "@/types/enums";

export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },
  USERS: {
    ALL: (page?: number, limit?: number) => ["users", "all", page, limit] as const,
    LEADS: (page?: number, limit?: number) => ["users", "leads", page, limit] as const,
    DETAIL: (id: string) => ["users", id] as const,
  },
  LOANS: {
    ALL: (page?: number, limit?: number, status?: LoanStatus) =>
      ["loans", "all", page, limit, status] as const,
    MY: (page?: number, limit?: number) => ["loans", "my", page, limit] as const,
    BY_STATUS: (status: string, page?: number) => ["loans", "status", status, page] as const,
    DETAIL: (id: string) => ["loans", id] as const,
  },
  PAYMENTS: {
    ALL: (page?: number, limit?: number) => ["payments", "all", page, limit] as const,
    LOAN: (loanId: string) => ["payments", "loan", loanId] as const,
    SUMMARY: (loanId: string) => ["payments", "summary", loanId] as const,
    BY_LOAN: (loanId: string) => ["payments", "loan", loanId] as const,
    OUTSTANDING: (loanId: string) => ["payments", "outstanding", loanId] as const,
  },
  DOCUMENTS: {
    MY: ["documents", "my"] as const,
    BY_LOAN: (loanId: string) => ["documents", "loan", loanId] as const,
  },
  NOTIFICATIONS: {
    MY: (page?: number) => ["notifications", "my", page] as const,
    UNREAD_COUNT: ["notifications", "unread"] as const,
  },
  ANALYTICS: {
    OVERVIEW: ["analytics", "overview"] as const,
    DISBURSEMENT: (months?: number) => ["analytics", "disbursement", months] as const,
    REPAYMENT: (months?: number) => ["analytics", "repayment", months] as const,
    STATUS_BREAKDOWN: ["analytics", "status-breakdown"] as const,
  },
} as const;
