import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "default" | "green" | "amber" | "blue" | "red";
}

const ACCENT_MAP = {
  default: "bg-primary/10 text-primary",
  green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "default",
}: KpiCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-5 pb-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              ACCENT_MAP[accent]
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
