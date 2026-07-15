export interface Address {
  id: string; // Cast from number
  label: "Home" | "Work" | "Other";
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  formattedAddress: string; // Pre-calculated string for UI display
}
