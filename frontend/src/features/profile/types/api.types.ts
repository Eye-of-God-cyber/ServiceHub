export interface ApiUserProfileResponse {
  id: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  wallet: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
  userProfile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface ApiUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface ApiCreateAddressRequest {
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface ApiUpdateAddressRequest {
  label?: string | null;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
}
