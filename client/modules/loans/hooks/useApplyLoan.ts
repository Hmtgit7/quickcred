import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loanService } from "../services/loanService";
import { documentService } from "@/modules/documents/services/documentService";
import { ROUTES } from "@/constants/routes";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import type { CreateLoanPayload } from "@/types/loan.types";

interface ApplyLoanPayload extends CreateLoanPayload {
  salarySlipDocId?: string;
}

export function useApplyLoan() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ApplyLoanPayload) =>
      loanService.createLoan({
        principalAmount: payload.principalAmount,
        tenureDays: payload.tenureDays,
      }),
    onSuccess: async (loan, variables) => {
      // Attach the salary slip doc to the newly created loan
      if (variables.salarySlipDocId) {
        try {
          await documentService.attachLoan(variables.salarySlipDocId, loan._id);
        } catch {
          // Non-fatal — loan was created, doc attachment is best-effort
        }
      }

      queryClient.invalidateQueries({ queryKey: ["loans", "my"] });
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