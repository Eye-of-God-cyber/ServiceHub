import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/profile.service";
import { profileKeys } from "./profileKeys";
import type { UserProfile } from "../types/domain.types";
import type { ApiUpdateProfileRequest } from "../types/api.types";
import { parseApiError } from "@/utils/parseApiError";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, ApiUpdateProfileRequest>({
    mutationFn: async (payload) => {
      try {
        return await updateProfile(payload);
      } catch (error) {
        throw new Error(parseApiError(error));
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.details(), data);
    },
  });
}
