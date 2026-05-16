export interface OverviewKpis {
  totalLoans: number;
  totalBorrowers: number;
  appliedLoans: number;
  sanctionedLoans: number;
  disbursedLoans: number;
  closedLoans: number;
  rejectedLoans: number;
  totalLoanBookValue: number;
  totalDisbursedValue: number;
  totalRepaymentExpected: number;
  totalCollected: number;
  repaymentRate: number;
}

export interface DisbursementChartPoint {
  date: string;
  count: number;
  totalAmount: number;
}

export interface RepaymentChartPoint {
  month: string;
  collected: number;
  expected: number;
  rate: number;
}

export interface LoanStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface AnalyticsOverview extends OverviewKpis {
  totalOutstanding: number;
  activeLoans: number;
  avgLoanAmount: number;
  statusBreakdown: LoanStatusBreakdown[];
  monthlyDisbursements: DisbursementChartPoint[];
  repaymentTrends: RepaymentChartPoint[];
}
