import axios from "axios";

interface BREFailedRule {
  rule: string;
  message: string;
}

interface ApiErrorResponse {
  success: false;
  message?: string | string[];
  statusCode?: number;
  errors?: string[];
  // BRE validation returns this nested shape from UnprocessableEntityException
  failedRules?: BREFailedRule[];
}

/**
 * Extracts a human-readable error message from an Axios error.
 * Handles: class-validator errors (message[]), BRE failedRules, and generic API errors.
 */
export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!axios.isAxiosError(error)) return fallback;

  const responseData = error.response?.data as ApiErrorResponse | undefined;

  // NestJS wraps UnprocessableEntityException body inside response.data.data
  // Shape: { success, data: { message, failedRules } }
  const innerData = (
    error.response?.data as { data?: ApiErrorResponse } | undefined
  )?.data ?? responseData;

  // 1. BRE failedRules array — most specific, show all rule messages joined
  if (innerData?.failedRules?.length) {
    return innerData.failedRules.map((r) => r.message).join(" • ");
  }

  // 2. class-validator sends message as string[]
  if (Array.isArray(innerData?.message) && innerData.message.length > 0) {
    return (innerData.message as string[]).join("; ");
  }

  // 3. Plain string message
  if (typeof innerData?.message === "string" && innerData.message.length > 0) {
    return innerData.message;
  }

  // 4. Fallback by status code
  if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
  if (!error.response) return "Network error. Please check your connection.";

  switch (error.response.status) {
    case 401: return "Session expired. Please log in again.";
    case 403: return "You do not have permission to do this.";
    case 404: return "Resource not found.";
    case 409: return "A record with this information already exists.";
    case 422: return "Eligibility check failed. Please review your details.";
    default:  return fallback;
  }
}

/**
 * Extracts the full BRE failedRules array from a 422 response.
 * Use this when you want to display per-rule feedback in the UI.
 */
export function getBREFailedRules(error: unknown): BREFailedRule[] {
  if (!axios.isAxiosError(error)) return [];

  const inner = (
    error.response?.data as { data?: ApiErrorResponse } | undefined
  )?.data ?? (error.response?.data as ApiErrorResponse | undefined);

  return inner?.failedRules ?? [];
}
