/**
 * Common API response shape types.
 * These mirror the backend ApiResponse utility class exactly.
 */

// ── Single-item success response ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

// ── Pagination metadata ───────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Paginated success response ────────────────────────────────────────────────
export interface PaginatedApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

// ── Validation / field error ──────────────────────────────────────────────────
export interface FieldError {
  field: string;
  message: string;
}

// ── Error response ────────────────────────────────────────────────────────────
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
}

// ── Pagination query params ───────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Generic request state ─────────────────────────────────────────────────────
export type RequestStatus = "idle" | "loading" | "success" | "error";
