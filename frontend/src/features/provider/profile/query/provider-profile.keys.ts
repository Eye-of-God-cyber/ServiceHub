export const providerProfileKeys = {
  all: ['provider-profile'] as const,
  profile: () => [...providerProfileKeys.all] as const,
};
