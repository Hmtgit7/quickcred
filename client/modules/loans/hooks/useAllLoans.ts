import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { LoanStatus } from "@/types/enums";
import { loanService } from "../services/loanService";

export function useAllLoans(page = 1, limit = 10, status?: LoanStatus) {
  return useQuery({
    queryKey: QUERY_KEYS.LOANS.ALL(page, limit, status),
    queryFn: () => loanService.getAllLoans(page, limit, status),
  });
}
