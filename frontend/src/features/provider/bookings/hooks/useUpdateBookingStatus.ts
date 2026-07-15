import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "../services/booking.service";
import { providerBookingKeys } from "../query/provider-booking.keys";
import { type ApiUpdateBookingStatusRequest } from "../types/api.types";
import { toast } from "sonner";
import { parseApiError } from "@/utils/parseApiError";

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApiUpdateBookingStatusRequest }) => 
      updateBookingStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerBookingKeys.lists() });
      toast.success("Booking status updated");
    },
    onError: (error: unknown) => {
      const message = parseApiError(error);
      toast.error(message);
    },
  });
}
