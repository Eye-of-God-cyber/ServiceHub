export const adminBookingKeys = {
  all: ["admin-bookings"] as const,
  lists: () => [...adminBookingKeys.all, "list"] as const,
  list: (params: { page: number; limit: number; status?: string }) =>
    [...adminBookingKeys.lists(), params] as const,
  details: () => [...adminBookingKeys.all, "detail"] as const,
  detail: (id: string) => [...adminBookingKeys.details(), id] as const,
};
