export const providerBookingKeys = {
  all: ["provider-bookings"] as const,
  lists: () => [...providerBookingKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...providerBookingKeys.lists(), filters] as const,
};
