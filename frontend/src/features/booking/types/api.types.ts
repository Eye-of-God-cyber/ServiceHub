/**
 * Backend API response types for the Booking module.
 */

import { ApiAddress } from "@/shared/types/address/api.types";

export type { ApiAddress };

export interface ApiCreateBookingRequest {
  providerServiceId: number;
  addressId: number;
  scheduledAt: string;
  notes?: string;
  couponId?: number;
}

export interface ApiBookingResponse {
  id: number;
  customerId: string;
  providerId: number;
  serviceId: number;
  providerServiceId: number;
  addressId: number;
  couponId: number | null;
  status: string; // PENDING, CONFIRMED, CANCELLED, etc.
  scheduledAt: string;
  completedAt: string | null;
  baseAmount: string;
  discountAmount: string;
  totalAmount: string;
  cancellationReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  
  // From BOOKING_INCLUDE
  customer: {
    id: string;
    email: string;
    userProfile: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    } | null;
  };
  provider: {
    id: number;
    bio: string | null;
    user: {
      email: string;
      phone: string | null;
      userProfile: {
        firstName: string;
        lastName: string;
      } | null;
    };
  };
  service: {
    id: number;
    name: string;
    unit: string;
    imageUrl: string | null;
  };
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface ApiBookingListResponse {
  data: ApiBookingResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
