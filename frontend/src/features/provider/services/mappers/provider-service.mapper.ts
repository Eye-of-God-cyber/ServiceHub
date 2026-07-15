import { type ApiProviderServiceResponse } from "../types/api.types";
import { type ProviderService } from "../types/domain.types";

export function mapProviderService(api: ApiProviderServiceResponse): ProviderService {
  const customPrice = api.customPrice ? parseFloat(api.customPrice) : null;
  const basePrice = parseFloat(api.service.basePrice);

  return {
    id: String(api.id),
    serviceId: String(api.serviceId),
    baseServiceName: api.service.name,
    basePrice,
    unit: api.service.unit,
    categoryId: String(api.service.categoryId),
    customPrice,
    isAvailable: api.isAvailable,
    description: api.description,
    effectivePrice: customPrice !== null ? customPrice : basePrice,
  };
}
