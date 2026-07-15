import { type BookingStatus } from "../constants/booking-status";

export interface ProviderBooking {
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
  
  customerName: string;
  customerEmail: string;
  customerAvatarUrl: string | null;

  serviceName: string;
  serviceImageUrl: string | null;

  addressLine1: string;
  addressLine2: string | null;
  addressCity: string;
  addressState: string;
  addressPincode: string;
}
