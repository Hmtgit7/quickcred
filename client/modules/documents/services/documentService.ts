import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type { Document } from "@/types/document.types";

export const documentService = {
  uploadSalarySlip: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "salary_slip");

    const { data } = await apiClient.post<ApiResponse<Document>>(
      "/documents/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
  },

  getMyDocuments: async (): Promise<Document[]> => {
    const { data } = await apiClient.get<ApiResponse<Document[]>>("/documents/my");
    return data.data;
  },
};