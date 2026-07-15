import { useMutation, useQueryClient } from '@tanstack/react-query';
import { providerDocumentKeys } from '../query/provider-document.keys';
import { ProviderDocumentService } from '../services/provider-document.service';
import { ApiCreateProviderDocumentRequest } from '../types/api.types';

export function useCreateProviderDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiCreateProviderDocumentRequest) =>
      ProviderDocumentService.createDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerDocumentKeys.lists() });
    },
  });
}
