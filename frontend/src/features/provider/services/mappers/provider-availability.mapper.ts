import { type ApiProviderAvailabilityResponse } from "../types/api.types";
import { type ProviderAvailability } from "../types/domain.types";

export function mapProviderAvailability(api: ApiProviderAvailabilityResponse): ProviderAvailability {
  return {
    id: String(api.id),
    dayOfWeek: api.dayOfWeek,
    startTime: api.startTime,
    endTime: api.endTime,
    isAvailable: api.isAvailable,
  };
}
