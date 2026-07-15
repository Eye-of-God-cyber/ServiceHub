import { useMutation, useQueryClient } from '@tanstack/react-query';
import { providerDocumentKeys } from '../query/provider-document.keys';
import { ProviderDocumentService } from '../services/provider-document.service';

export function useDeleteProviderDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => ProviderDocumentService.deleteDocument(docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerDocumentKeys.lists() });
    },
  });
}
