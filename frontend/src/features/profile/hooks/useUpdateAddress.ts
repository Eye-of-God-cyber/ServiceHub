import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "../services/profile.service";
import { profileKeys } from "./profileKeys";
import type { Address } from "@/shared/types/address/domain.types";
import type { ApiUpdateAddressRequest } from "../types/api.types";
import { parseApiError } from "@/utils/parseApiError";

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, { addressId: string; payload: ApiUpdateAddressRequest }>({
    mutationFn: async ({ addressId, payload }) => {
      try {
        return await updateAddress(addressId, payload);
      } catch (error) {
        throw new Error(parseApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses() });
    },
  });
}
