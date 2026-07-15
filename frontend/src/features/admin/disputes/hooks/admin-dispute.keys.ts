export const adminDisputeKeys = {
  all: ["admin-disputes"] as const,
  lists: () => [...adminDisputeKeys.all, "list"] as const,
  list: (params: { page: number; limit: number }) =>
    [...adminDisputeKeys.lists(), params] as const,
  details: () => [...adminDisputeKeys.all, "detail"] as const,
  detail: (id: string) => [...adminDisputeKeys.details(), id] as const,
};
