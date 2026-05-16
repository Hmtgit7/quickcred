"use client";

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginatedResponse } from "@/types/api.types";

interface DataTablePaginationProps {
  meta: Omit<PaginatedResponse<unknown>, "data">;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  meta,
  onPageChange,
}: DataTablePaginationProps) {
  const start = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);
  const canGoBack = meta.page > 1;
  const canGoNext = meta.page < meta.totalPages;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start}-{end} of {meta.total}
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canGoBack}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronFirst />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canGoBack}
          onClick={() => onPageChange(meta.page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span className="px-2 tabular-nums">
          Page {meta.page} of {Math.max(meta.totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(meta.page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(meta.totalPages)}
          aria-label="Last page"
        >
          <ChevronLast />
        </Button>
      </div>
    </div>
  );
}
