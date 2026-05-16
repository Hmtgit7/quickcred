import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/** Base shimmer skeleton block */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a single text line */
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

/** Skeleton for a page/section heading */
export function SkeletonHeading({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-6 w-2/5", className)} />;
}

/** Skeleton for a stat/KPI card */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 space-y-3",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

/** Skeleton for a data table */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {/* Header row */}
      <div className="flex gap-4 pb-3 border-b border-border">
        {[40, 25, 20, 15].map((w, i) => (
          <Skeleton key={i} className={`h-3`} style={{ width: `${w}%` }} />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-border/50">
          {[40, 25, 20, 15].map((w, j) => (
            <Skeleton key={j} className={`h-4`} style={{ width: `${w}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a list of notifications or log items */
export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
