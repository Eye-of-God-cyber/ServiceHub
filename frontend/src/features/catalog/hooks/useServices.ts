import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/catalog.service";
import type { CatalogService } from "../types/domain.types";

export const SERVICES_QUERY_KEY = ["services"];

export function useServices(categoryId?: string) {
  return useQuery<CatalogService[], Error>({
    queryKey: [...SERVICES_QUERY_KEY, categoryId],
    queryFn: () => getServices(categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
