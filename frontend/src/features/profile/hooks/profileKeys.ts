export const profileKeys = {
  all: ["profile"] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  addresses: () => [...profileKeys.all, "addresses"] as const,
};
