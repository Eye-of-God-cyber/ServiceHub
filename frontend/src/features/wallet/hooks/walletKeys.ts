export const walletKeys = {
  all: ["wallet"] as const,
  details: () => [...walletKeys.all, "details"] as const,
};
