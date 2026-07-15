import { type ApiBookingResponse } from "../types/api.types";
import { type ProviderBooking } from "../types/domain.types";
import { type BookingStatus } from "../constants/booking-status";

export function mapProviderBooking(api: ApiBookingResponse): ProviderBooking {
  return {
    id: String(api.id),
    status: api.status as BookingStatus,
    scheduledAt: new Date(api.scheduledAt),
    completedAt: api.completedAt ? new Date(api.completedAt) : null,
    baseAmount: parseFloat(api.baseAmount),
    discountAmount: parseFloat(api.discountAmount),
    totalAmount: parseFloat(api.totalAmount),
    cancellationReason: api.cancellationReason,
    notes: api.notes,
    createdAt: new Date(api.createdAt),
    
    customerName: api.customer.userProfile 
      ? `${api.customer.userProfile.firstName} ${api.customer.userProfile.lastName}`.trim()
      : "Unknown Customer",
    customerEmail: api.customer.email,
    customerAvatarUrl: api.customer.userProfile?.avatarUrl || null,
    
    serviceName: api.service.name,
    serviceImageUrl: api.service.imageUrl,
    
    addressLine1: api.address.line1,
    addressLine2: api.address.line2,
    addressCity: api.address.city,
    addressState: api.address.state,
    addressPincode: api.address.pincode,
  };
}
