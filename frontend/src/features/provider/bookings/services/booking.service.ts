import api from "@/lib/api";
import { type ApiProviderBookingListResponse, type ApiBookingResponse, type ApiUpdateBookingStatusRequest } from "../types/api.types";
import { type ProviderBooking } from "../types/domain.types";
import { mapProviderBooking } from "../mappers/booking.mapper";
import { type PaginationMeta } from "@/types/api";

export async function getProviderBookings(params?: { 
  page?: number; 
  limit?: number; 
  status?: string;
}): Promise<{ items: ProviderBooking[], meta: PaginationMeta }> {
  const response = await api.get<ApiProviderBookingListResponse>("/bookings", { params });
  return {
    items: response.data.data.map(mapProviderBooking),
    meta: response.data.meta,
  };
}

export async function updateBookingStatus(id: string, payload: ApiUpdateBookingStatusRequest): Promise<ProviderBooking> {
  const response = await api.patch<{ success: boolean; data: ApiBookingResponse }>(`/bookings/${id}/status`, payload);
  return mapProviderBooking(response.data.data);
}
