import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../services/booking.service";
import { bookingKeys } from "./bookingKeys";
import type { BookingListResult } from "../types/domain.types";

export function useBookings(statusFilter?: string) {
  return useQuery<BookingListResult, Error>({
    queryKey: statusFilter ? bookingKeys.list(statusFilter) : bookingKeys.lists(),
    queryFn: () => getBookings(statusFilter),
  });
}
