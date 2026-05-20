export interface Payment {
  _id: string;
  loanId: string;
  borrowerId: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy: string;
  outstandingBefore: number;
  outstandingAfter: number;
  createdAt: string;
}

export interface RecordPaymentResponse {
  payment: Payment;
  autoClosedLoan: boolean;
}

export interface RecordPaymentPayload {
  loanId: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
}

export interface OutstandingBalance {
  loanId: string;
  totalRepayment: number;
  totalPaid: number;
  outstanding: number;
  isFullyPaid: boolean;
  paymentCount: number;
}

export interface LoanPaymentSummary extends OutstandingBalance {
  isFullyRepaid: boolean;
  payments: Payment[];
}