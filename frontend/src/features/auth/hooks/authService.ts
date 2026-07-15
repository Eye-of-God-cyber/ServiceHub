/**
 * Auth API service — ServiceHub frontend.
 *
 * This module is the ONLY place where network calls for authentication are made.
 * All functions are typed against the exact backend response shapes.
 *
 * Architectural decisions:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Uses the shared Axios instance from @/lib/api. The instance already has the
 *   base URL configured and the request interceptor will inject the token.
 * • Returns only the `data` field of the backend ApiResponse envelope so callers
 *   don't have to unwrap it every time.
 * • Never stores tokens here — that is the AuthProvider's responsibility.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import api from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type {
  LoginResponseData,
  RegisterResponseData,
} from "../types/auth.types";
import type { LoginFormData, RegisterFormData } from "../schema/auth.schema";
import type { ApiResponse } from "@/types/api";

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginRequest(
  payload: Pick<LoginFormData, "email" | "password">
): Promise<LoginResponseData> {
  const response = await api.post<ApiResponse<LoginResponseData>>(
    API_ROUTES.AUTH.LOGIN,
    { email: payload.email, password: payload.password }
  );
  // Unwrap backend ApiResponse envelope
  return response.data.data;
}

// ── Register ──────────────────────────────────────────────────────────────────
export async function registerRequest(
  payload: Omit<RegisterFormData, "confirmPassword" | "rememberMe" | "termsAccepted">
): Promise<{ data: RegisterResponseData; message: string }> {
  const response = await api.post<ApiResponse<RegisterResponseData>>(
    API_ROUTES.AUTH.REGISTER,
    {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: payload.role,
    }
  );
  return { data: response.data.data, message: response.data.message };
}

// ── Get current user (me) ─────────────────────────────────────────────────────
export async function getMeRequest() {
  const response = await api.get(API_ROUTES.AUTH.ME);
  return response.data.data;
}
