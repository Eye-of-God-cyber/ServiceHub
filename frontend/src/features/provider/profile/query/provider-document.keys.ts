export const providerDocumentKeys = {
  all: ['provider-documents'] as const,
  lists: () => [...providerDocumentKeys.all, 'list'] as const,
};
