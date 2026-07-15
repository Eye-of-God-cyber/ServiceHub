import api from "@/lib/api";
import { type ApiProviderTimeOffResponse, type ApiCreateTimeOffRequest } from "../types/api.types";
import { type ProviderTimeOff } from "../types/domain.types";
import { mapProviderTimeOff } from "../mappers/provider-timeoff.mapper";

export async function getProviderTimeOffs(): Promise<ProviderTimeOff[]> {
  const response = await api.get<{ data: ApiProviderTimeOffResponse[] }>("/providers/time-off");
  return response.data.data.map(mapProviderTimeOff);
}

export async function createProviderTimeOff(payload: ApiCreateTimeOffRequest): Promise<ProviderTimeOff> {
  const response = await api.post<{ data: ApiProviderTimeOffResponse }>("/providers/time-off", payload);
  return mapProviderTimeOff(response.data.data);
}

export async function deleteProviderTimeOff(id: string): Promise<void> {
  await api.delete(`/providers/time-off/${id}`);
}
