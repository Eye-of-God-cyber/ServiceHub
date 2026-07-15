/**
 * Frontend Domain types for the Booking module.
 */

import { Address } from "@/shared/types/address/domain.types";

export type { Address };

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface BookingResult {
  id: string; // Cast from number
  status: BookingStatus;
  scheduledAt: Date;
  totalAmount: number;
}

export interface DetailedBooking {
  id: string;
  status: BookingStatus;
  scheduledAt: Date;
  completedAt: Date | null;
  baseAmount: number;
  discountAmount: number;
  totalAmount: number;
  cancellationReason: string | null;
  notes: string | null;
  createdAt: Date;
  
  // Nested Domain Models
  service: {
    id: string;
    name: string;
    unit: string;
    imageUrl: string | null;
  };
  
  provider: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    bio: string | null;
  };
  
  customer: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  
  address: {
    formattedAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface BookingListResult {
  data: DetailedBooking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
