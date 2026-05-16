import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { paymentService } from "../services/paymentService";

export function useLoanPayments(loanId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.LOAN(loanId),
    queryFn: () => paymentService.getLoanPayments(loanId),
    enabled: Boolean(loanId),
    staleTime: 15 * 1000,
  });
}
