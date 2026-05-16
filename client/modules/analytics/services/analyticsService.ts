import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type {
  AnalyticsOverview,
  DisbursementChartPoint,
  LoanStatusBreakdown,
  OverviewKpis,
  RepaymentChartPoint,
} from "../types/analytics.types";

function toAnalyticsOverview(
  overview: OverviewKpis,
  monthlyDisbursements: DisbursementChartPoint[],
  repaymentTrends: RepaymentChartPoint[],
  statusBreakdown: LoanStatusBreakdown[]
): AnalyticsOverview {
  const activeLoans = overview.appliedLoans + overview.sanctionedLoans + overview.disbursedLoans;
  const totalOutstanding = Math.max(
    0,
    overview.totalRepaymentExpected - overview.totalCollected
  );

  return {
    ...overview,
    activeLoans,
    totalOutstanding,
    avgLoanAmount:
      overview.totalLoans > 0
        ? Math.round(overview.totalLoanBookValue / overview.totalLoans)
        : 0,
    statusBreakdown,
    monthlyDisbursements,
    repaymentTrends,
  };
}

export const analyticsService = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const [overview, monthlyDisbursements, repaymentTrends, statusBreakdown] =
      await Promise.all([
        apiClient.get<ApiResponse<OverviewKpis>>("/analytics/overview"),
        apiClient.get<ApiResponse<DisbursementChartPoint[]>>(
          "/analytics/disbursement-chart",
          { params: { days: 180 } }
        ),
        apiClient.get<ApiResponse<RepaymentChartPoint[]>>(
          "/analytics/repayment-chart",
          { params: { months: 6 } }
        ),
        apiClient.get<ApiResponse<LoanStatusBreakdown[]>>(
          "/analytics/status-breakdown"
        ),
      ]);

    return toAnalyticsOverview(
      overview.data.data,
      monthlyDisbursements.data.data,
      repaymentTrends.data.data,
      statusBreakdown.data.data
    );
  },
};
