import api from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type { ApiCategory, ApiServiceListEntry, ApiServiceDetails } from "../types/api.types";
import type { Category, CatalogService, DetailedService } from "../types/domain.types";
import { mapCategoryToDomain, mapServiceToDomain, mapServiceDetailsToDomain } from "../mappers/catalog.mapper";

/**
 * Catalog API service.
 * Fetches data from the backend and maps it into frontend domain models using the mapper.
 */

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<ApiResponse<ApiCategory[]>>(API_ROUTES.CATALOG.CATEGORIES);
  return response.data.data.map(mapCategoryToDomain);
}

export async function getServices(categoryId?: string): Promise<CatalogService[]> {
  const url = API_ROUTES.CATALOG.SERVICES;
  const config = categoryId ? { params: { categoryId } } : undefined;
  
  const response = await api.get<ApiResponse<ApiServiceListEntry[]>>(url, config);
  return response.data.data.map(mapServiceToDomain);
}

export async function getServiceById(serviceId: string): Promise<DetailedService> {
  // Convert string serviceId back to number for the API if necessary, but API expects path param
  // Assuming the backend handles string/number correctly in the URL
  const response = await api.get<ApiResponse<ApiServiceDetails>>(
    API_ROUTES.CATALOG.SERVICE_BY_ID(Number(serviceId))
  );
  return mapServiceDetailsToDomain(response.data.data);
}
