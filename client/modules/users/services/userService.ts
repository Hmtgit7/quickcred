import apiClient from "@/lib/axios/client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { User, UpdateProfilePayload } from "@/types/user.types";

export const userService = {
    getMe: async (): Promise<User> => {
        const { data } = await apiClient.get<ApiResponse<User>>("/users/me");
        return data.data;
    },

    updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
        const { data } = await apiClient.patch<ApiResponse<User>>(
            "/users/profile",
            payload
        );
        return data.data;
    },

    getLeads: async (
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<User>> => {
        const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
            "/users/leads",
            { params: { page, limit } }
        );
        return data.data;
    },

    getAllUsers: async (
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<User>> => {
        const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
            "/users",
            { params: { page, limit } }
        );
        return data.data;
    },
};