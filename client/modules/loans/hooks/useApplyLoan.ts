import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loanService } from "../services/loanService";
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTES } from "@/constants/routes";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import type { CreateLoanPayload } from "@/types/loan.types";

export function useApplyLoan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateLoanPayload) => loanService.createLoan(payload),
    onSuccess: (loan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOANS.MY() });
      toast.success("Loan application submitted!", {
        description: `Loan #${loan._id.slice(-6).toUpperCase()} is now pending review.`,
      });
      router.replace(ROUTES.LOANS.ROOT);
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, "Failed to submit loan application."));
    },
  });
}