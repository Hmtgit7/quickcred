import axios from "axios";

interface ApiErrorResponse {
  success: false;
  message?: string | string[];
  statusCode?: number;
  errors?: string[];
}

export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data as ApiErrorResponse | undefined;

  if (data?.errors?.length) return data.errors[0];
  if (Array.isArray(data?.message) && data.message.length > 0) {
    return data.message[0];
  }
  if (typeof data?.message === "string" && data.message.length > 0) {
    return data.message;
  }

  if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
  if (!error.response) return "Network error. Please check your connection.";
  if (error.response.status === 401) return "Session expired. Please log in again.";
  if (error.response.status === 403) return "You do not have permission to do this.";
  if (error.response.status === 404) return "Resource not found.";
  if (error.response.status === 409) {
    return "A record with this information already exists.";
  }
  if (error.response.status === 422) return "Eligibility check failed.";

  return fallback;
}
