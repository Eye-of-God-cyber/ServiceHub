import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../services/booking.service";
import { bookingKeys } from "./bookingKeys";
import type { DetailedBooking } from "../types/domain.types";

export function useBookingDetails(bookingId: string) {
  return useQuery<DetailedBooking, Error>({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });
}
