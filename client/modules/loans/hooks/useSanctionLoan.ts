import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import { loanService } from "../services/loanService";

interface SanctionLoanVariables {
  id: string;
  action: "approve" | "reject";
  rejectionReason?: string;
}

export function useSanctionLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, rejectionReason }: SanctionLoanVariables) =>
      loanService.sanctionLoan(id, { action, rejectionReason }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success(
        variables.action === "approve"
          ? "Loan approved successfully"
          : "Loan rejected successfully"
      );
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, "Unable to update loan"));
    },
  });
}
