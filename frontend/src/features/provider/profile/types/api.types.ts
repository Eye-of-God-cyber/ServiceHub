export interface ApiProviderUserProfile {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  updatedAt: string;
}

export interface ApiProviderProfileData {
  bio: string | null;
  experienceYears: number | null;
  verificationStatus: string;
  avgRating: string | number;
  totalReviews: number;
  totalBookings: number;
  isAvailable: boolean;
  updatedAt: string;
}

export interface ApiProviderWallet {
  balance: string;
}

export interface ApiProviderProfileResponse {
  id: number;
  email: string;
  phone: string;
  status: string;
  isVerified: boolean;
  profile: ApiProviderUserProfile | null;
  providerProfile: ApiProviderProfileData | null;
  wallet: ApiProviderWallet;
}

export interface ApiUpdateProviderProfileRequest {
  bio?: string | null;
  experienceYears?: number;
  isAvailable?: boolean;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

export interface ApiProviderDocumentResponse {
  id: number;
  documentType: string;
  documentUrl: string;
  status: string;
  adminNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCreateProviderDocumentRequest {
  documentType: string;
  documentUrl: string;
}
