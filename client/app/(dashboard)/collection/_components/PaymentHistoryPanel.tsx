"use client";

import { History, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/common/EmptyState";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useLoanPayments } from "@/modules/payments/hooks/useLoanPayments";
import type { Loan } from "@/types/loan.types";
import { getLoanBorrower } from "./loanBorrower";
import { OutstandingBadge } from "./OutstandingBadge";

interface PaymentHistoryPanelProps {
  loan: Loan | null;
  onClose: () => void;
}

export function PaymentHistoryPanel({ loan, onClose }: PaymentHistoryPanelProps) {
  const { data: summary, isLoading } = useLoanPayments(loan?._id ?? "");
  const borrower = loan ? getLoanBorrower(loan) : null;

  return (
    <Sheet open={Boolean(loan)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle>Payment History</SheetTitle>
          <SheetDescription>
            {loan && (
              <>
                Loan{" "}
                <span className="font-mono font-medium">
                  #{loan._id.slice(-8).toUpperCase()}
                </span>{" "}
                - {borrower?.fullName ?? "Borrower"}
              </>
            )}
          </SheetDescription>
        </SheetHeader>

        {summary && (
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <div className="mb-4 grid grid-cols-3 gap-3 text-center">
              <SummaryCell
                label="Total due"
                value={formatCurrency(summary.totalRepayment)}
              />
              <SummaryCell
                label="Paid"
                value={formatCurrency(summary.totalPaid)}
                positive
              />
              <SummaryCell
                label="Outstanding"
                value={formatCurrency(summary.outstanding)}
                warning={summary.outstanding > 0}
              />
            </div>
            <OutstandingBadge
              outstanding={summary.outstanding}
              totalRepayment={summary.totalRepayment}
            />
          </div>
        )}

        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && summary && summary.payments.length === 0 && (
            <EmptyState
              icon={History}
              title="No payments yet"
              description="Recorded payments will appear here."
              className="py-12"
            />
          )}

          {!isLoading && summary && summary.payments.length > 0 && (
            <ol className="space-y-3" aria-label="Payment history">
              {summary.payments.map((payment, index) => (
                <li key={payment._id}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex shrink-0 flex-col items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-primary/20" />
                      {index < summary.payments.length - 1 && (
                        <div className="min-h-8 w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold tabular-nums">
                          {formatCurrency(payment.amount)}
                        </span>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {payment.utrNumber.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.paymentDate)}
                      </p>
                    </div>
                  </div>
                  {index < summary.payments.length - 1 && <Separator />}
                </li>
              ))}
            </ol>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface SummaryCellProps {
  label: string;
  value: string;
  positive?: boolean;
  warning?: boolean;
}

function SummaryCell({ label, value, positive, warning }: SummaryCellProps) {
  return (
    <div>
      <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-sm font-bold tabular-nums",
          positive && "text-green-600 dark:text-green-400",
          warning && "text-amber-600 dark:text-amber-400"
        )}
      >
        {value}
      </p>
    </div>
  );
}
