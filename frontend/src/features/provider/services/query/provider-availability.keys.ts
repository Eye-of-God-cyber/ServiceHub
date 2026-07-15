export const providerAvailabilityKeys = {
  all: ["providerAvailability"] as const,
  detail: () => [...providerAvailabilityKeys.all, "detail"] as const,
};
