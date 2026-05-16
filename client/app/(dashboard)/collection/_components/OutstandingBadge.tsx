import { cn, formatCurrency } from "@/lib/utils";

interface OutstandingBadgeProps {
  outstanding: number;
  totalRepayment: number;
  className?: string;
}

export function OutstandingBadge({
  outstanding,
  totalRepayment,
  className,
}: OutstandingBadgeProps) {
  const paidAmount = Math.max(0, totalRepayment - outstanding);
  const paidPercent =
    totalRepayment > 0
      ? Math.min(100, Math.round((paidAmount / totalRepayment) * 100))
      : 0;
  const isFullyPaid = outstanding <= 0;

  return (
    <div className={cn("min-w-[8.75rem] space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isFullyPaid && "text-green-600 dark:text-green-400"
          )}
        >
          {isFullyPaid ? "Paid off" : formatCurrency(outstanding)}
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {paidPercent}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isFullyPaid
              ? "bg-green-500"
              : paidPercent >= 75
                ? "bg-primary"
                : paidPercent >= 40
                  ? "bg-amber-500"
                  : "bg-destructive"
          )}
          style={{ width: `${paidPercent}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={paidPercent}
        />
      </div>
    </div>
  );
}
