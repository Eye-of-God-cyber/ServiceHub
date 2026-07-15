export interface ProviderProfile {
  id: string; // Map from number
  email: string;
  phone: string;
  status: string;
  isVerified: boolean;
  
  // Flattened profile data
  firstName: string;
  lastName: string;
  avatarUrl: string;
  
  // Flattened provider data
  bio: string;
  experienceYears: number;
  verificationStatus: string;
  isAvailable: boolean;
  
  // Wallet
  balance: string;
}

export interface ProviderDocument {
  id: string; // Map from number
  documentType: string;
  documentUrl: string;
  status: string; // e.g. PENDING, APPROVED, REJECTED
  adminNotes: string;
  uploadedAt: string; // Map from createdAt
}
