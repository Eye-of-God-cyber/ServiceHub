import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { providerAvailabilityKeys } from "../query/provider-availability.keys";
import { getProviderAvailability, updateProviderAvailability } from "../services/provider-availability.service";
import { type ApiUpdateAvailabilityRequest } from "../types/api.types";

export function useProviderAvailability() {
  return useQuery({
    queryKey: providerAvailabilityKeys.detail(),
    queryFn: getProviderAvailability,
  });
}

export function useUpdateProviderAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApiUpdateAvailabilityRequest) => updateProviderAvailability(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerAvailabilityKeys.detail() });
    },
  });
}
