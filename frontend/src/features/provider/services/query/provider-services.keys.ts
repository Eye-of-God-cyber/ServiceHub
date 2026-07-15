export const providerServicesKeys = {
  all: ["providerServices"] as const,
  lists: () => [...providerServicesKeys.all, "list"] as const,
};
