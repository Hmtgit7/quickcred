import { Banknote, FileText, IndianRupee, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { AnalyticsOverview } from "@/modules/analytics/types/analytics.types";
import { KpiCard } from "./KpiCard";

interface KpiGridProps {
  data: AnalyticsOverview;
}

export function KpiGrid({ data }: KpiGridProps) {
  const cards = [
    {
      label: "Total Loans",
      value: data.totalLoans.toLocaleString("en-IN"),
      sub: `${data.activeLoans} active, ${data.closedLoans} closed`,
      icon: FileText,
      accent: "default" as const,
    },
    {
      label: "Total Disbursed",
      value: formatCurrency(data.totalDisbursedValue),
      sub: "Cumulative principal disbursed",
      icon: Banknote,
      accent: "blue" as const,
    },
    {
      label: "Total Collected",
      value: formatCurrency(data.totalCollected),
      sub: `${data.repaymentRate}% repayment rate`,
      icon: IndianRupee,
      accent: "green" as const,
    },
    {
      label: "Outstanding",
      value: formatCurrency(data.totalOutstanding),
      sub: `Avg loan: ${formatCurrency(data.avgLoanAmount)}`,
      icon: TrendingUp,
      accent: data.totalOutstanding > 0 ? ("amber" as const) : ("green" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
