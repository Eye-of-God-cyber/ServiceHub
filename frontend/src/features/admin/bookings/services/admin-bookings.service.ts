import api from "@/lib/api";
import { ApiBookingListResponse, ApiBookingResponse } from "@/features/booking/types/api.types";

export interface UpdateBookingStatusPayload {
  status: string;
  cancellationReason?: string;
}

export const adminBookingsService = {
  /**
   * List bookings for admin with pagination and optional status filter
   */
  async getBookings(params: { page: number; limit: number; status?: string }): Promise<ApiBookingListResponse> {
    const { data } = await api.get<ApiBookingListResponse>("/bookings", { params });
    return data;
  },

  /**
   * Get booking details by ID
   */
  async getBookingById(bookingId: string): Promise<ApiBookingResponse> {
    const { data } = await api.get<ApiBookingResponse>(`/bookings/${bookingId}`);
    return data;
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, payload: UpdateBookingStatusPayload): Promise<ApiBookingResponse> {
    const { data } = await api.patch<ApiBookingResponse>(`/bookings/${bookingId}/status`, payload);
    return data;
  },
};
