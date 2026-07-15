import { useMutation, useQueryClient } from '@tanstack/react-query';
import { providerProfileKeys } from '../query/provider-profile.keys';
import { ProviderProfileService } from '../services/provider-profile.service';
import { ApiUpdateProviderProfileRequest } from '../types/api.types';

export function useUpdateProviderProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiUpdateProviderProfileRequest) =>
      ProviderProfileService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerProfileKeys.profile() });
    },
  });
}
