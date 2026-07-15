export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...reviewKeys.lists(), filters] as const,
};
