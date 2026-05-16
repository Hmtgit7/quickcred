import { LoanStatus } from "./enums";

export interface OverviewKpis {
  totalLoanBook: number;
  disbursedValue: number;
  totalCollected: number;
  repaymentRate: number;
  totalBorrowers: number;
  statusCounts: Record<LoanStatus, number>;
}

export interface DisbursementChartPoint {
  month: string;
  amount: number;
  count: number;
}

export interface RepaymentChartPoint {
  month: string;
  collected: number;
  outstanding: number;
}

export interface LoanStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}
