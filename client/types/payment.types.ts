export interface Payment {
  _id: string;
  loanId: string;
  borrowerId: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy: string;
  createdAt: string;
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
