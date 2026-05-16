import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type {
  AuthResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload
    );
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/signup",
      payload
    );
    return data.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const { data } = await apiClient.post<ApiResponse<AuthTokens>>(
      "/auth/refresh",
      { refreshToken }
    );
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
