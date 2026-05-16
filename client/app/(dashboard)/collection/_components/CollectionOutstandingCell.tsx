"use client";

import { Skeleton } from "@/components/common/Skeleton";
import { usePaymentSummary } from "@/modules/payments/hooks/usePaymentSummary";
import type { Loan } from "@/types/loan.types";
import { OutstandingBadge } from "./OutstandingBadge";

interface CollectionOutstandingCellProps {
  loan: Loan;
}

export function CollectionOutstandingCell({ loan }: CollectionOutstandingCellProps) {
  const { data: summary, isLoading } = usePaymentSummary(loan._id);
  const outstanding = summary?.outstanding ?? loan.outstandingAmount ?? loan.totalRepayment;

  if (isLoading && loan.outstandingAmount === undefined) {
    return (
      <div className="min-w-[8.75rem] space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-1.5 w-full" />
      </div>
    );
  }

  return (
    <OutstandingBadge
      outstanding={outstanding}
      totalRepayment={summary?.totalRepayment ?? loan.totalRepayment}
    />
  );
}
