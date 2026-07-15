import api from '@/lib/api';
import { ApiProviderDocumentResponse, ApiCreateProviderDocumentRequest } from '../types/api.types';
import { ProviderDocument } from '../types/domain.types';
import { mapProviderDocument } from '../mappers/provider-document.mapper';

export const ProviderDocumentService = {
  getDocuments: async (): Promise<ProviderDocument[]> => {
    const response = await api.get<{ data: ApiProviderDocumentResponse[] }>('/providers/documents');
    return response.data.data.map(mapProviderDocument);
  },

  createDocument: async (payload: ApiCreateProviderDocumentRequest): Promise<ProviderDocument> => {
    const response = await api.post<{ data: ApiProviderDocumentResponse }>('/providers/documents', payload);
    return mapProviderDocument(response.data.data);
  },

  deleteDocument: async (docId: string): Promise<void> => {
    await api.delete(`/providers/documents/${docId}`);
  }
};
