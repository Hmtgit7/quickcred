import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type { Document } from "@/types/document.types";

export const documentService = {
  uploadSalarySlip: async (file: File, loanId?: string): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", "salary_slip"); // ← was "type" — caused 400

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

  getMyDocuments: async (): Promise<Document[]> => {
    const { data } = await apiClient.get<ApiResponse<Document[]>>("/documents/my");
    return data.data;
  },
};