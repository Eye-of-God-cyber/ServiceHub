import api from "@/lib/api";
import { type ApiProviderAvailabilityResponse, type ApiUpdateAvailabilityRequest } from "../types/api.types";
import { type ProviderAvailability } from "../types/domain.types";
import { mapProviderAvailability } from "../mappers/provider-availability.mapper";

export async function getProviderAvailability(): Promise<ProviderAvailability[]> {
  const response = await api.get<{ data: ApiProviderAvailabilityResponse[] }>("/providers/availability");
  return response.data.data.map(mapProviderAvailability);
}

export async function updateProviderAvailability(payload: ApiUpdateAvailabilityRequest): Promise<ProviderAvailability[]> {
  const response = await api.put<{ data: ApiProviderAvailabilityResponse[] }>("/providers/availability", payload.schedules);
  return response.data.data.map(mapProviderAvailability);
}
