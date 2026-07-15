import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { providerTimeOffKeys } from "../query/provider-timeoff.keys";
import { getProviderTimeOffs, createProviderTimeOff, deleteProviderTimeOff } from "../services/provider-timeoff.service";
import { type ApiCreateTimeOffRequest } from "../types/api.types";

export function useProviderTimeOff() {
  return useQuery({
    queryKey: providerTimeOffKeys.lists(),
    queryFn: getProviderTimeOffs,
  });
}

export function useCreateProviderTimeOff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApiCreateTimeOffRequest) => createProviderTimeOff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerTimeOffKeys.lists() });
    },
  });
}

export function useDeleteProviderTimeOff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProviderTimeOff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerTimeOffKeys.lists() });
    },
  });
}
