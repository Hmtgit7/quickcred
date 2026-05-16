import apiClient from "@/lib/axios/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  LoanPaymentSummary,
  OutstandingBalance,
  Payment,
  RecordPaymentPayload,
  RecordPaymentResponse,
} from "@/types/payment.types";

export const paymentService = {
  recordPayment: async (
    payload: RecordPaymentPayload
  ): Promise<RecordPaymentResponse> => {
    const { data } = await apiClient.post<ApiResponse<RecordPaymentResponse>>(
      "/payments",
      payload
    );
    return data.data;
  },

  getPaymentSummary: async (loanId: string): Promise<OutstandingBalance> => {
    const { data } = await apiClient.get<ApiResponse<OutstandingBalance>>(
      `/payments/loan/${loanId}/summary`
    );
    return data.data;
  },

  getLoanPaymentHistory: async (loanId: string): Promise<Payment[]> => {
    const { data } = await apiClient.get<ApiResponse<Payment[]>>(
      `/payments/loan/${loanId}`
    );
    return data.data;
  },

  getLoanPayments: async (loanId: string): Promise<LoanPaymentSummary> => {
    const [summary, payments] = await Promise.all([
      paymentService.getPaymentSummary(loanId),
      paymentService.getLoanPaymentHistory(loanId),
    ]);

    return {
      ...summary,
      isFullyRepaid: summary.isFullyPaid,
      payments,
    };
  },

  getAllPayments: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Payment>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Payment>>>(
      "/payments",
      { params: { page, limit } }
    );
    return data.data;
  },
};
