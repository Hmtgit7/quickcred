"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonCard } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useLoanDetail } from "@/modules/loans/hooks/useLoanDetail";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { FileQuestion } from "lucide-react";

interface LoanDetailViewProps {
  id: string;
}

export function LoanDetailView({ id }: LoanDetailViewProps) {
  const { data: loan, isLoading, isError } = useLoanDetail(id);

  if (isLoading) return <SkeletonCard className="h-64" />;

  if (isError || !loan) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Loan not found"
        description="This loan doesn't exist or you don't have access."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={ROUTES.LOANS.ROOT}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Loans
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-1">
              Loan #{loan._id.slice(-8).toUpperCase()}
            </p>
            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(loan.principalAmount)}
            </CardTitle>
          </div>
          <StatusBadge status={loan.status} />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <DetailRow label="Principal" value={formatCurrency(loan.principalAmount)} />
            <DetailRow label="Tenure" value={`${loan.tenureDays} days`} />
            <DetailRow label="Interest Rate" value={`${loan.interestRate}% p.a.`} />
            <DetailRow label="Simple Interest" value={formatCurrency(loan.simpleInterest)} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Repayment</p>
            <p className="text-lg font-bold tabular-nums text-primary">
              {formatCurrency(loan.totalRepayment)}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <DetailRow label="Applied on" value={formatDate(loan.createdAt)} />
            {loan.sanctionedAt && (
              <DetailRow label="Sanctioned on" value={formatDate(loan.sanctionedAt)} />
            )}
            {loan.disbursedAt && (
              <DetailRow label="Disbursed on" value={formatDate(loan.disbursedAt)} />
            )}
          </div>

          {loan.rejectionReason && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-xs font-medium text-destructive mb-0.5">Rejection Reason</p>
              <p className="text-sm text-foreground">{loan.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  );
}