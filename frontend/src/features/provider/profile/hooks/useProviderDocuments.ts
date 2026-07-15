import { useQuery } from '@tanstack/react-query';
import { providerDocumentKeys } from '../query/provider-document.keys';
import { ProviderDocumentService } from '../services/provider-document.service';

export function useProviderDocuments() {
  return useQuery({
    queryKey: providerDocumentKeys.lists(),
    queryFn: () => ProviderDocumentService.getDocuments(),
  });
}
