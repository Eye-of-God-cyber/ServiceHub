import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "../services/profile.service";
import { profileKeys } from "./profileKeys";
import type { Address } from "@/shared/types/address/domain.types";
import type { ApiCreateAddressRequest } from "../types/api.types";
import { parseApiError } from "@/utils/parseApiError";

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, ApiCreateAddressRequest>({
    mutationFn: async (payload) => {
      try {
        return await createAddress(payload);
      } catch (error) {
        throw new Error(parseApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses() });
    },
  });
}
