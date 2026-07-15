import { useQuery } from "@tanstack/react-query";
import { getProviderBookings } from "../services/booking.service";
import { providerBookingKeys } from "../query/provider-booking.keys";

export function useProviderBookings(params: { page: number; limit: number; status?: string }) {
  return useQuery({
    queryKey: providerBookingKeys.list(params),
    queryFn: () => getProviderBookings(params),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}
