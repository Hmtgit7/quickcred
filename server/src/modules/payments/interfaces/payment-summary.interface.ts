export interface PaymentSummary {
  loanId: string;
  totalRepayment: number;
  totalPaid: number;
  outstanding: number;
  isFullyPaid: boolean;
  paymentCount: number;
}
