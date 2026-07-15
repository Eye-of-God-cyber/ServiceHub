import { type ApiProviderTimeOffResponse } from "../types/api.types";
import { type ProviderTimeOff } from "../types/domain.types";

export function mapProviderTimeOff(api: ApiProviderTimeOffResponse): ProviderTimeOff {
  return {
    id: String(api.id),
    startDate: new Date(api.startDate),
    endDate: new Date(api.endDate),
    reason: api.reason,
    createdAt: new Date(api.createdAt),
  };
}
