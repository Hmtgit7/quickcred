"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/modules/analytics/hooks/useAnalytics";
import { AnalyticsSkeleton } from "./AnalyticsSkeleton";
import { DisbursementChart } from "./DisbursementChart";
import { KpiGrid } from "./KpiGrid";
import { LoanStatusChart } from "./LoanStatusChart";
import { RepaymentChart } from "./RepaymentChart";

export function AnalyticsContent() {
  const { data, isLoading, isError, refetch } = useAnalytics();

  if (isLoading) return <AnalyticsSkeleton />;

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="max-w-xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load analytics</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-4">
          <span>Could not fetch analytics data.</span>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <KpiGrid data={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DisbursementChart data={data.monthlyDisbursements} />
        <LoanStatusChart data={data.statusBreakdown} />
      </div>

      <RepaymentChart data={data.repaymentTrends} />
    </div>
  );
}
