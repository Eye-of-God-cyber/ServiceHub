import { ApiProviderProfileResponse } from '../types/api.types';
import { ProviderProfile } from '../types/domain.types';

export function mapProviderProfile(apiProfile: ApiProviderProfileResponse): ProviderProfile {
  return {
    id: String(apiProfile.id),
    email: apiProfile.email,
    phone: apiProfile.phone || '',
    status: apiProfile.status,
    isVerified: apiProfile.isVerified,
    
    // Fallbacks for profile
    firstName: apiProfile.profile?.firstName || '',
    lastName: apiProfile.profile?.lastName || '',
    avatarUrl: apiProfile.profile?.avatarUrl || '',
    
    // Fallbacks for providerProfile
    bio: apiProfile.providerProfile?.bio || '',
    experienceYears: apiProfile.providerProfile?.experienceYears || 0,
    verificationStatus: apiProfile.providerProfile?.verificationStatus || 'PENDING',
    isAvailable: apiProfile.providerProfile?.isAvailable ?? false,
    
    balance: apiProfile.wallet?.balance || '0.00'
  };
}
