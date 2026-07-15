import api from '@/lib/api';
import { ApiProviderProfileResponse, ApiUpdateProviderProfileRequest } from '../types/api.types';
import { ProviderProfile } from '../types/domain.types';
import { mapProviderProfile } from '../mappers/provider-profile.mapper';

export const ProviderProfileService = {
  getProfile: async (): Promise<ProviderProfile> => {
    const response = await api.get<{ data: ApiProviderProfileResponse }>('/providers/me');
    return mapProviderProfile(response.data.data);
  },

  updateProfile: async (payload: ApiUpdateProviderProfileRequest): Promise<ProviderProfile> => {
    const response = await api.put<{ data: ApiProviderProfileResponse }>('/providers/me', payload);
    return mapProviderProfile(response.data.data);
  }
};
