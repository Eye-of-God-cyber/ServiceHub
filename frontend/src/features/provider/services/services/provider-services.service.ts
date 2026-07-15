import api from "@/lib/api";
import { type ApiProviderServiceResponse, type ApiCreateProviderServiceRequest, type ApiUpdateProviderServiceRequest } from "../types/api.types";
import { type ProviderService } from "../types/domain.types";
import { mapProviderService } from "../mappers/provider-service.mapper";

export async function getProviderServices(): Promise<ProviderService[]> {
  const response = await api.get<{ data: ApiProviderServiceResponse[] }>("/providers/services");
  return response.data.data.map(mapProviderService);
}

export async function addProviderService(payload: ApiCreateProviderServiceRequest): Promise<ProviderService> {
  const response = await api.post<{ data: ApiProviderServiceResponse }>("/providers/services", payload);
  return mapProviderService(response.data.data);
}

export async function updateProviderService(id: string, payload: ApiUpdateProviderServiceRequest): Promise<ProviderService> {
  const response = await api.put<{ data: ApiProviderServiceResponse }>(`/providers/services/${id}`, payload);
  return mapProviderService(response.data.data);
}

export async function deleteProviderService(id: string): Promise<void> {
  await api.delete(`/providers/services/${id}`);
}
