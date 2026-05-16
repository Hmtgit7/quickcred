import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { paymentService } from "../services/paymentService";

export function usePaymentSummary(loanId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENTS.SUMMARY(loanId),
    queryFn: () => paymentService.getPaymentSummary(loanId),
    enabled: Boolean(loanId),
    staleTime: 15 * 1000,
  });
}
