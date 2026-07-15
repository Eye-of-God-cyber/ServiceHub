import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBookingsService, UpdateBookingStatusPayload } from "../services/admin-bookings.service";
import { adminBookingKeys } from "./admin-booking.keys";
import { mapBookingListToDomain, mapDetailedBookingToDomain } from "@/features/booking/mappers/booking.mapper";
import { BookingListResult, DetailedBooking } from "@/features/booking/types/domain.types";

export function useAdminBookings(params: { page: number; limit: number; status?: string }) {
  return useQuery<BookingListResult>({
    queryKey: adminBookingKeys.list(params),
    queryFn: async () => {
      const data = await adminBookingsService.getBookings(params);
      return mapBookingListToDomain(data);
    },
    // Keep previous data while fetching new pages to prevent layout shifts
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminBooking(bookingId: string) {
  return useQuery<DetailedBooking>({
    queryKey: adminBookingKeys.detail(bookingId),
    queryFn: async () => {
      const data = await adminBookingsService.getBookingById(bookingId);
      return mapDetailedBookingToDomain(data);
    },
    enabled: !!bookingId,
  });
}

export function useUpdateAdminBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: string; payload: UpdateBookingStatusPayload }) =>
      adminBookingsService.updateBookingStatus(bookingId, payload),
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: adminBookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminBookingKeys.detail(variables.bookingId) });
    },
  });
}
