export interface OverviewKpis {
  totalLoans: number;
  totalBorrowers: number;
  appliedLoans: number;
  sanctionedLoans: number;
  disbursedLoans: number;
  closedLoans: number;
  rejectedLoans: number;
  totalLoanBookValue: number; // sum of principalAmount for all non-rejected loans
  totalDisbursedValue: number; // sum of principalAmount for disbursed + closed
  totalRepaymentExpected: number; // sum of totalRepayment for disbursed + closed
  totalCollected: number; // sum of all payments recorded
  repaymentRate: number; // (totalCollected / totalRepaymentExpected) * 100
}

export interface DisbursementChartPoint {
  date: string; // 'YYYY-MM-DD'
  count: number;
  totalAmount: number;
}

export interface RepaymentChartPoint {
  month: string; // 'YYYY-MM'
  collected: number;
  expected: number;
  rate: number;
}

export interface LoanStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}
