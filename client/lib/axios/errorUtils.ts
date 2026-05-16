import { AxiosError } from "axios";

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

/**
 * Extracts a user-friendly error message from an Axios error.
 * Falls back to the provided default message if nothing is parseable.
 */
export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (error.message === "Network Error") {
      return "Unable to connect. Please check your internet connection.";
    }
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }
  }
  return fallback;
}