import api from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type { ApiAddress, ApiCreateBookingRequest, ApiBookingResponse, ApiBookingListResponse } from "../types/api.types";
import type { Address, BookingResult, DetailedBooking, BookingListResult } from "../types/domain.types";
import { mapAddressToDomain, mapBookingResultToDomain, mapDetailedBookingToDomain, mapBookingListToDomain } from "../mappers/booking.mapper";

/**
 * Booking feature service
 */

export async function getAddresses(): Promise<Address[]> {
  const response = await api.get<ApiResponse<ApiAddress[]>>(API_ROUTES.USERS.ADDRESSES);
  return response.data.data.map(mapAddressToDomain);
}

export async function createBooking(payload: ApiCreateBookingRequest): Promise<BookingResult> {
  const response = await api.post<ApiResponse<ApiBookingResponse>>(
    API_ROUTES.BOOKINGS.CREATE,
    payload
  );
  return mapBookingResultToDomain(response.data.data);
}

export async function getBookings(status?: string): Promise<BookingListResult> {
  const params = status ? { status } : undefined;
  const response = await api.get<ApiResponse<ApiBookingListResponse>>(API_ROUTES.BOOKINGS.LIST, { params });
  return mapBookingListToDomain(response.data.data as unknown as ApiBookingListResponse);
}

export async function getBookingById(bookingId: string): Promise<DetailedBooking> {
  const response = await api.get<ApiResponse<ApiBookingResponse>>(API_ROUTES.BOOKINGS.BY_ID(Number(bookingId)));
  return mapDetailedBookingToDomain(response.data.data);
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<DetailedBooking> {
  const response = await api.patch<ApiResponse<ApiBookingResponse>>(API_ROUTES.BOOKINGS.STATUS(Number(bookingId)), {
    status: 'CANCELLED',
    cancellationReason: reason
  });
  return mapDetailedBookingToDomain(response.data.data);
}
