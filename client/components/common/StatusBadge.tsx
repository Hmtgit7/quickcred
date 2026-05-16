import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LoanStatus } from "@/types/enums";

interface StatusBadgeProps {
  status: LoanStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  LoanStatus,
  { label: string; className: string }
> = {
  [LoanStatus.Pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  [LoanStatus.Applied]: {
    label: "Applied",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  [LoanStatus.Sanctioned]: {
    label: "Sanctioned",
    className: "bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400",
  },
  [LoanStatus.Disbursed]: {
    label: "Disbursed",
    className: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
  [LoanStatus.Closed]: {
    label: "Closed",
    className: "bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
  },
  [LoanStatus.Rejected]: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "" };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium text-xs px-2.5 py-0.5 border-0",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
