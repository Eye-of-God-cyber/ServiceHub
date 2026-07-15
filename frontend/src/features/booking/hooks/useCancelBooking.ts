import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../services/booking.service";
import { bookingKeys } from "./bookingKeys";
import type { DetailedBooking } from "../types/domain.types";
import { parseApiError } from "@/utils/parseApiError";

interface CancelBookingParams {
  bookingId: string;
  reason?: string;
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<DetailedBooking, Error, CancelBookingParams>({
    mutationFn: async ({ bookingId, reason }) => {
      try {
        return await cancelBooking(bookingId, reason);
      } catch (error) {
        throw new Error(parseApiError(error));
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific booking detail cache
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
      // Invalidate the list caches
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
