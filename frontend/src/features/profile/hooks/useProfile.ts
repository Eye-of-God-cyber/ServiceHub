import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/profile.service";
import { profileKeys } from "./profileKeys";
import type { UserProfile } from "../types/domain.types";

export function useProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: profileKeys.details(),
    queryFn: getProfile,
  });
}
