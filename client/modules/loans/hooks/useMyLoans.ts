import { useQuery } from "@tanstack/react-query";
import { loanService } from "../services/loanService";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMyLoans(page = 1, limit = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.LOANS.MY(page, limit),
    queryFn: () => loanService.getMyLoans(page, limit),
    staleTime: 30 * 1000,
  });
}