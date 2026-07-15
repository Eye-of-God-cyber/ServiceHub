import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../services/booking.service";
import type { Address } from "../types/domain.types";

export const ADDRESSES_QUERY_KEY = ["addresses"];

export function useAddresses() {
  return useQuery<Address[], Error>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
