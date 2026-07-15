import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultAddress } from "../services/profile.service";
import { profileKeys } from "./profileKeys";
import { parseApiError } from "@/utils/parseApiError";

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (addressId) => {
      try {
        await setDefaultAddress(addressId);
      } catch (error) {
        throw new Error(parseApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.addresses() });
    },
  });
}
