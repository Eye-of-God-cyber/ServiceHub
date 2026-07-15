import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../services/profile.service";
import { profileKeys } from "./profileKeys";
import type { Address } from "@/shared/types/address/domain.types";

export function useProfileAddresses() {
  return useQuery<Address[], Error>({
    queryKey: profileKeys.addresses(),
    queryFn: getAddresses,
  });
}
