/**
 * parseApiError — extracts a human-readable error message from any thrown error.
 *
 * Priority order:
 *  1. Backend field validation errors (array of { field, message })
 *  2. Backend business error message (string)
 *  3. Network / timeout errors (axios-specific)
 *  4. Fallback generic message
 */

import { AxiosError, isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

export function isApiNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

export function parseApiError(error: unknown): string {
  if (!isAxiosError(error)) {
    // Non-Axios error (programming error, etc.)
    return "An unexpected error occurred. Please try again.";
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  // Network error — no response received
  if (!axiosError.response) {
    if (axiosError.code === "ECONNABORTED") {
      return "Request timed out. Please check your connection and try again.";
    }
    return "Cannot connect to the server. Please check your internet connection.";
  }

  const responseData = axiosError.response.data;

  // Backend returned structured field errors
  if (responseData?.errors && responseData.errors.length > 0) {
    return responseData.errors.map((e) => e.message).join(" ");
  }

  // Backend returned a plain business error message
  if (responseData?.message) {
    return responseData.message;
  }

  // HTTP status fallbacks
  switch (axiosError.response.status) {
    case 401:
      return "Invalid credentials. Please try again.";
    case 403:
      return "Access denied.";
    case 409:
      return "This account already exists.";
    case 429:
      return "Too many requests. Please slow down and try again.";
    case 500:
      return "A server error occurred. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
