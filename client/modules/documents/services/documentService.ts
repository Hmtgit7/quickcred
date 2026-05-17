import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type { Document } from "@/types/document.types";

export const documentService = {
  /**
   * Upload a salary slip.
   * Field names MUST match server UploadDocumentDto exactly:
   *   - "file"         → the binary file
   *   - "documentType" → enum value e.g. "salary_slip"  (was wrongly "type")
   *   - "loanId"       → optional ObjectId to attach doc to a loan
   */
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
      // Let axios/browser auto-set Content-Type with the correct multipart boundary.
      // Manually setting "multipart/form-data" omits the boundary → server can't parse body.
      { headers: { "Content-Type": undefined } }
    );
    return data.data;
  },

  getMyDocuments: async (): Promise<Document[]> => {
    const { data } = await apiClient.get<ApiResponse<Document[]>>("/documents/my");
    return data.data;
  },
};