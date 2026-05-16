import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import { loanService } from "../services/loanService";

interface DisburseLoanVariables {
  id: string;
  disbursalUtrNumber: string;
}

export function useDisburseLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, disbursalUtrNumber }: DisburseLoanVariables) =>
      loanService.disburseLoan(id, { disbursalUtrNumber }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan marked as disbursed");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, "Unable to disburse loan"));
    },
  });
}
