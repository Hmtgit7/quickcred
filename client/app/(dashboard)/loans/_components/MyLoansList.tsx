"use client";

import { FileText } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonCard } from "@/components/common/Skeleton";
import { useMyLoans } from "@/modules/loans/hooks/useMyLoans";
import { LoanCard } from "./LoanCard";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface MyLoansListProps {
  showApplyAction?: boolean;
}

export function MyLoansList({ showApplyAction = true }: MyLoansListProps) {
  const { data, isLoading, isError } = useMyLoans();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={FileText}
        title="Could not load loans"
        description="Something went wrong. Please refresh the page."
      />
    );
  }

  const loans = data?.data ?? [];

  if (loans.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No loans yet"
        description="Apply for your first loan to get started."
        actionLabel={showApplyAction ? "Apply now" : undefined}
        onAction={showApplyAction ? () => router.push(ROUTES.LOANS.APPLY) : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {loans.map((loan) => (
        <LoanCard key={loan._id} loan={loan} />
      ))}
    </div>
  );
}   
