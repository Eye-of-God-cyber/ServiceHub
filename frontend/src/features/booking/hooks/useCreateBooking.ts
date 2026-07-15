import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../services/booking.service";
import type { ApiCreateBookingRequest } from "../types/api.types";
import type { BookingResult } from "../types/domain.types";
import { parseApiError } from "@/utils/parseApiError";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResult, Error, ApiCreateBookingRequest>({
    mutationFn: async (payload) => {
      try {
        return await createBooking(payload);
      } catch (error) {
        throw new Error(parseApiError(error));
      }
    },
    onSuccess: () => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
