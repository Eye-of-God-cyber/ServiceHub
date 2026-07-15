import { useQuery } from '@tanstack/react-query';
import { providerProfileKeys } from '../query/provider-profile.keys';
import { ProviderProfileService } from '../services/provider-profile.service';

export function useProviderProfile() {
  return useQuery({
    queryKey: providerProfileKeys.profile(),
    queryFn: () => ProviderProfileService.getProfile(),
  });
}
