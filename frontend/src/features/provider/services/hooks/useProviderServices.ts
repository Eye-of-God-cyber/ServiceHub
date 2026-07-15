import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { providerServicesKeys } from "../query/provider-services.keys";
import { getProviderServices, addProviderService, updateProviderService, deleteProviderService } from "../services/provider-services.service";
import { type ApiCreateProviderServiceRequest, type ApiUpdateProviderServiceRequest } from "../types/api.types";

export function useProviderServices() {
  return useQuery({
    queryKey: providerServicesKeys.lists(),
    queryFn: getProviderServices,
  });
}

export function useAddProviderService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApiCreateProviderServiceRequest) => addProviderService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerServicesKeys.lists() });
    },
  });
}

export function useUpdateProviderService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApiUpdateProviderServiceRequest }) => updateProviderService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerServicesKeys.lists() });
    },
  });
}

export function useDeleteProviderService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProviderService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerServicesKeys.lists() });
    },
  });
}
