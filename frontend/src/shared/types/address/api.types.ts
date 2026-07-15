export interface ApiAddress {
  id: number;
  userId: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  latitude: string | null;
  longitude: string | null;
  createdAt: string;
  updatedAt: string;
}
