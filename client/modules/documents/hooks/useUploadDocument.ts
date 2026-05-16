import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentService } from "../services/documentService";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";

export function useUploadDocument() {
  return useMutation({
    mutationFn: (file: File) => documentService.uploadSalarySlip(file),
    onSuccess: () => {
      toast.success("Salary slip uploaded successfully");
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, "Upload failed. Please try again."));
    },
  });
}
