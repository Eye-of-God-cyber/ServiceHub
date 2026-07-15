import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../services/catalog.service";
import type { DetailedService } from "../types/domain.types";

export const SERVICE_DETAILS_QUERY_KEY = ["serviceDetails"];

export function useServiceDetails(serviceId: string) {
  return useQuery<DetailedService, Error>({
    queryKey: [...SERVICE_DETAILS_QUERY_KEY, serviceId],
    queryFn: () => getServiceById(serviceId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!serviceId,
  });
}
