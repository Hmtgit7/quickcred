import { useState, useCallback } from "react";
import { PAGINATION_DEFAULTS } from "@/constants/app.constants";

interface PaginationState {
  page: number;
  limit: number;
}

interface PaginationActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination(
  initialPage = PAGINATION_DEFAULTS.PAGE,
  initialLimit = PAGINATION_DEFAULTS.LIMIT
): PaginationState & PaginationActions & { totalPages: number; setTotalPages: (n: number) => void } {
  const [page, setPageState] = useState<number>(initialPage);
  const [limit, setLimitState] = useState<number>(initialLimit);
  const [totalPages, setTotalPages] = useState(1);

  const setPage = useCallback((p: number) => setPageState(p), []);
  const setLimit = useCallback((l: number) => { setLimitState(l); setPageState(1); }, []);
  const nextPage = useCallback(() => setPageState((p) => Math.min(p + 1, totalPages)), [totalPages]);
  const prevPage = useCallback(() => setPageState((p) => Math.max(p - 1, 1)), []);
  const reset = useCallback(() => { setPageState(initialPage); setLimitState(initialLimit); }, [initialPage, initialLimit]);

  return { page, limit, totalPages, setTotalPages, setPage, setLimit, nextPage, prevPage, reset };
}
