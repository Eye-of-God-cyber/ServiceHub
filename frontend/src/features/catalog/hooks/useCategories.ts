import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/catalog.service";
import type { Category } from "../types/domain.types";

export const CATEGORIES_QUERY_KEY = ["categories"];

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
