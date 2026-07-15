export interface ProviderService {
  id: string;
  serviceId: string;
  
  // Flattened from service relation
  baseServiceName: string;
  basePrice: number;
  unit: string;
  categoryId: string;

  customPrice: number | null;
  isAvailable: boolean;
  description: string | null;
  
  // Computed for UI convenience
  effectivePrice: number;
}

export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ProviderAvailability {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ProviderTimeOff {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  createdAt: Date;
}
