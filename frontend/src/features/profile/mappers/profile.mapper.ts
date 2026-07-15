import type { ApiUserProfileResponse } from "../types/api.types";
import type { UserProfile } from "../types/domain.types";
import type { Address } from "@/shared/types/address/domain.types";
import type { ApiAddress } from "@/shared/types/address/api.types";

export function mapUserProfileToDomain(apiUser: ApiUserProfileResponse): UserProfile {
  return {
    id: apiUser.id,
    email: apiUser.email,
    phone: apiUser.phone,
    role: apiUser.role,
    firstName: apiUser.userProfile?.firstName || "",
    lastName: apiUser.userProfile?.lastName || "",
    dateOfBirth: apiUser.userProfile?.dateOfBirth ? new Date(apiUser.userProfile.dateOfBirth) : null,
    avatarUrl: apiUser.userProfile?.avatarUrl || null,
  };
}

export function mapAddressToDomain(apiAddress: ApiAddress): Address {
  const parts = [apiAddress.line1];
  if (apiAddress.line2) parts.push(apiAddress.line2);
  parts.push(apiAddress.city);
  parts.push(apiAddress.state);
  parts.push(apiAddress.pincode);

  return {
    id: apiAddress.id.toString(),
    label: (apiAddress.label as "Home" | "Work" | "Other") || "Other",
    line1: apiAddress.line1,
    line2: apiAddress.line2 || "",
    city: apiAddress.city,
    state: apiAddress.state,
    pincode: apiAddress.pincode,
    isDefault: apiAddress.isDefault,
    formattedAddress: parts.join(", "),
  };
}
