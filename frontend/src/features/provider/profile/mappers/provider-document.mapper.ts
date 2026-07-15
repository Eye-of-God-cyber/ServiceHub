import { ApiProviderDocumentResponse } from '../types/api.types';
import { ProviderDocument } from '../types/domain.types';

export function mapProviderDocument(apiDoc: ApiProviderDocumentResponse): ProviderDocument {
  return {
    id: String(apiDoc.id),
    documentType: apiDoc.documentType,
    documentUrl: apiDoc.documentUrl,
    status: apiDoc.status,
    adminNotes: apiDoc.adminNotes || '',
    uploadedAt: apiDoc.createdAt
  };
}
