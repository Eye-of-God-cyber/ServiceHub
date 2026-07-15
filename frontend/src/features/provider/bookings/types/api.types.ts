import { type ApiBookingResponse } from "@/features/booking/types/api.types";
import { type BookingStatus } from "../constants/booking-status";

export type { ApiBookingResponse };

export interface ApiProviderBookingListResponse {
  data: ApiBookingResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiUpdateBookingStatusRequest {
  status: BookingStatus;
  cancellationReason?: string;
}
