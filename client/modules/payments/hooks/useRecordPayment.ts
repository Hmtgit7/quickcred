import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import { paymentService } from "../services/paymentService";
import type { RecordPaymentPayload } from "@/types/payment.types";

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) =>
      paymentService.recordPayment(payload),
    onSuccess: (result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PAYMENTS.LOAN(variables.loanId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PAYMENTS.SUMMARY(variables.loanId),
      });
      void queryClient.invalidateQueries({ queryKey: ["loans"] });

      toast.success(
        result.autoClosedLoan
          ? "Payment recorded and loan closed"
          : "Payment recorded successfully",
        { description: `UTR: ${variables.utrNumber}` }
      );
    },
    onError: (error) => {
      toast.error(
        getAxiosErrorMessage(error, "Failed to record payment. Please try again.")
      );
    },
  });
}
