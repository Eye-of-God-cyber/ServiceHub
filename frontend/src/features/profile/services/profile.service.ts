import api from "@/lib/api";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type { ApiUserProfileResponse, ApiUpdateProfileRequest, ApiCreateAddressRequest, ApiUpdateAddressRequest } from "../types/api.types";
import type { ApiAddress } from "@/shared/types/address/api.types";
import type { UserProfile } from "../types/domain.types";
import type { Address } from "@/shared/types/address/domain.types";
import { mapUserProfileToDomain, mapAddressToDomain } from "../mappers/profile.mapper";

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get<ApiResponse<ApiUserProfileResponse>>(API_ROUTES.USERS.PROFILE);
  return mapUserProfileToDomain(response.data.data);
}

export async function updateProfile(payload: ApiUpdateProfileRequest): Promise<UserProfile> {
  const response = await api.put<ApiResponse<ApiUserProfileResponse>>(API_ROUTES.USERS.PROFILE, payload);
  return mapUserProfileToDomain(response.data.data);
}

export async function getAddresses(): Promise<Address[]> {
  const response = await api.get<ApiResponse<ApiAddress[]>>(API_ROUTES.USERS.ADDRESSES);
  return response.data.data.map(mapAddressToDomain);
}

export async function createAddress(payload: ApiCreateAddressRequest): Promise<Address> {
  const response = await api.post<ApiResponse<ApiAddress>>(API_ROUTES.USERS.ADDRESSES, payload);
  return mapAddressToDomain(response.data.data);
}

export async function updateAddress(addressId: string, payload: ApiUpdateAddressRequest): Promise<Address> {
  const response = await api.put<ApiResponse<ApiAddress>>(API_ROUTES.USERS.ADDRESS_BY_ID(Number(addressId)), payload);
  return mapAddressToDomain(response.data.data);
}

export async function deleteAddress(addressId: string): Promise<void> {
  await api.delete(API_ROUTES.USERS.ADDRESS_BY_ID(Number(addressId)));
}

export async function setDefaultAddress(addressId: string): Promise<void> {
  await api.patch(API_ROUTES.USERS.ADDRESS_DEFAULT(Number(addressId)));
}
