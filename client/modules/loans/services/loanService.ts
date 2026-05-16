import apiClient from "@/lib/axios/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { Loan, CreateLoanPayload } from "@/types/loan.types";
import type { LoanStatus } from "@/types/enums";

export const loanService = {
    getMyLoans: async (page = 1, limit = 10): Promise<PaginatedResponse<Loan>> => {
        const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Loan>>>(
            "/loans/my",
            { params: { page, limit } }
        );
        return data.data;
    },

    getLoanById: async (id: string): Promise<Loan> => {
        const { data } = await apiClient.get<ApiResponse<Loan>>(`/loans/${id}`);
        return data.data;
    },

    getAllLoans: async (
        page = 1,
        limit = 10,
        status?: LoanStatus
    ): Promise<PaginatedResponse<Loan>> => {
        const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Loan>>>(
            "/loans",
            { params: { page, limit, ...(status ? { status } : {}) } }
        );
        return data.data;
    },

    createLoan: async (payload: CreateLoanPayload): Promise<Loan> => {
        const { data } = await apiClient.post<ApiResponse<Loan>>("/loans", payload);
        return data.data;
    },

    sanctionLoan: async (
        id: string,
        payload: { action: "approve" | "reject"; rejectionReason?: string }
    ): Promise<Loan> => {
        const { data } = await apiClient.patch<ApiResponse<Loan>>(
            `/loans/${id}/sanction`,
            payload
        );
        return data.data;
    },

    disburseLoan: async (
        id: string,
        payload: { disbursalUtrNumber: string }
    ): Promise<Loan> => {
        const { data } = await apiClient.patch<ApiResponse<Loan>>(
            `/loans/${id}/disburse`,
            payload
        );
        return data.data;
    },
};
