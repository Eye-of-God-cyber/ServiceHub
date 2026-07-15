export const providerTimeOffKeys = {
  all: ["providerTimeOff"] as const,
  lists: () => [...providerTimeOffKeys.all, "list"] as const,
};
