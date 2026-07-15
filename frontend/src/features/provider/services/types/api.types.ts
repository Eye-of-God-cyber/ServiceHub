export interface ApiProviderServiceResponse {
  id: number;
  providerId: number;
  serviceId: number;
  customPrice: string | null; // Decimal
  isAvailable: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  service: {
    name: string;
    basePrice: string; // Decimal
    unit: string;
    categoryId: number;
  };
}

export interface ApiCreateProviderServiceRequest {
  serviceId: number;
  customPrice?: number;
  isAvailable?: boolean;
  description?: string;
}

export interface ApiUpdateProviderServiceRequest {
  customPrice?: number;
  isAvailable?: boolean;
  description?: string;
}

export interface ApiProviderAvailabilityResponse {
  id: number;
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

export interface ApiUpdateAvailabilityRequest {
  schedules: {
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    startTime: string;
    endTime: string;
    isAvailable?: boolean;
  }[];
}

export interface ApiProviderTimeOffResponse {
  id: number;
  startDate: string; // ISO8601
  endDate: string; // ISO8601
  reason: string | null;
  createdAt: string;
}

export interface ApiCreateTimeOffRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason?: string;
}
