export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  role: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  avatarUrl: string | null;
}
