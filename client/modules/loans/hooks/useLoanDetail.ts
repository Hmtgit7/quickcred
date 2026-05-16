import { useQuery } from "@tanstack/react-query";
import { loanService } from "../services/loanService";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useLoanDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.LOANS.DETAIL(id),
    queryFn: () => loanService.getLoanById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}