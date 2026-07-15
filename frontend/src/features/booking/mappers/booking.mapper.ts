import type { ApiAddress, ApiBookingResponse, ApiBookingListResponse } from "../types/api.types";
import type { Address, BookingResult, DetailedBooking, BookingStatus, BookingListResult } from "../types/domain.types";

export function mapAddressToDomain(apiAddress: ApiAddress): Address {
  const parts = [apiAddress.line1];
  if (apiAddress.line2) parts.push(apiAddress.line2);
  parts.push(apiAddress.city);
  parts.push(apiAddress.state);
  parts.push(apiAddress.pincode);

  return {
    id: apiAddress.id.toString(),
    label: (apiAddress.label as "Home" | "Work" | "Other") || "Other",
    line1: apiAddress.line1,
    line2: apiAddress.line2 || "",
    city: apiAddress.city,
    state: apiAddress.state,
    pincode: apiAddress.pincode,
    isDefault: apiAddress.isDefault,
    formattedAddress: parts.join(", "),
  };
}

export function mapBookingResultToDomain(apiBooking: ApiBookingResponse): BookingResult {
  return {
    id: apiBooking.id.toString(),
    status: apiBooking.status as BookingStatus,
    scheduledAt: new Date(apiBooking.scheduledAt),
    totalAmount: parseFloat(apiBooking.totalAmount),
  };
}

export function mapDetailedBookingToDomain(apiBooking: ApiBookingResponse): DetailedBooking {
  const addressParts = [apiBooking.address.line1];
  if (apiBooking.address.line2) addressParts.push(apiBooking.address.line2);
  addressParts.push(apiBooking.address.city);
  addressParts.push(apiBooking.address.state);
  addressParts.push(apiBooking.address.pincode);

  return {
    id: apiBooking.id.toString(),
    status: apiBooking.status as BookingStatus,
    scheduledAt: new Date(apiBooking.scheduledAt),
    completedAt: apiBooking.completedAt ? new Date(apiBooking.completedAt) : null,
    baseAmount: parseFloat(apiBooking.baseAmount),
    discountAmount: parseFloat(apiBooking.discountAmount),
    totalAmount: parseFloat(apiBooking.totalAmount),
    cancellationReason: apiBooking.cancellationReason,
    notes: apiBooking.notes,
    createdAt: new Date(apiBooking.createdAt),
    
    service: {
      id: apiBooking.service.id.toString(),
      name: apiBooking.service.name,
      unit: apiBooking.service.unit,
      imageUrl: apiBooking.service.imageUrl,
    },
    
    provider: {
      id: apiBooking.provider.id.toString(),
      name: apiBooking.provider.user.userProfile 
        ? `${apiBooking.provider.user.userProfile.firstName} ${apiBooking.provider.user.userProfile.lastName}`.trim()
        : "Professional",
      email: apiBooking.provider.user.email,
      phone: apiBooking.provider.user.phone,
      bio: apiBooking.provider.bio,
    },
    
    customer: {
      id: apiBooking.customer.id.toString(),
      name: apiBooking.customer.userProfile
        ? `${apiBooking.customer.userProfile.firstName} ${apiBooking.customer.userProfile.lastName}`.trim()
        : "Customer",
      email: apiBooking.customer.email,
      avatarUrl: apiBooking.customer.userProfile?.avatarUrl || null,
    },
    
    address: {
      formattedAddress: addressParts.join(", "),
      city: apiBooking.address.city,
      state: apiBooking.address.state,
      pincode: apiBooking.address.pincode,
    },
  };
}

export function mapBookingListToDomain(apiList: ApiBookingListResponse): BookingListResult {
  return {
    data: apiList.data.map(mapDetailedBookingToDomain),
    meta: apiList.meta,
  };
}
