import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type { Document } from "@/types/document.types";

export const documentService = {
  uploadSalarySlip: async (file: File, loanId?: string): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", "salary_slip");

    if (loanId) {
      formData.append("loanId", loanId);
    }

    const { data } = await apiClient.post<ApiResponse<Document>>(
      "/documents/upload",
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data.data;
  },

  attachLoan: async (documentId: string, loanId: string): Promise<Document> => {
    const { data } = await apiClient.patch<ApiResponse<Document>>(
      `/documents/${documentId}/attach-loan`,
      { loanId }
    );
    return data.data;
  },

  getMyDocuments: async (): Promise<Document[]> => {
    const { data } = await apiClient.get<ApiResponse<Document[]>>("/documents/my");
    return data.data;
  },
};