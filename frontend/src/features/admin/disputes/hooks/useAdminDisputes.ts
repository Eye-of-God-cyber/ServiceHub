import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDisputesService } from "../services/admin-disputes.service";
import { adminDisputeKeys } from "./admin-dispute.keys";
import { mapDisputeListToDomain, mapDisputeToDomain } from "../mappers/dispute.mapper";
import { DisputeListResult, Dispute } from "../types/domain.types";

export function useAdminDisputes(params: { page: number; limit: number }) {
  return useQuery<DisputeListResult>({
    queryKey: adminDisputeKeys.list(params),
    queryFn: async () => {
      const data = await adminDisputesService.getDisputes(params);
      return mapDisputeListToDomain(data);
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminDispute(disputeId: string) {
  return useQuery<Dispute>({
    queryKey: adminDisputeKeys.detail(disputeId),
    queryFn: async () => {
      const data = await adminDisputesService.getDisputeById(disputeId);
      return mapDisputeToDomain(data);
    },
    enabled: !!disputeId,
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, resolution }: { disputeId: string; resolution: string }) =>
      adminDisputesService.resolveDispute(disputeId, resolution),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminDisputeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminDisputeKeys.detail(variables.disputeId) });
    },
  });
}

export function useAddDisputeMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, message }: { disputeId: string; message: string }) =>
      adminDisputesService.addDisputeMessage(disputeId, message),
    onSuccess: (data, variables) => {
      // Invalidate the detail query to fetch the updated messages array
      queryClient.invalidateQueries({ queryKey: adminDisputeKeys.detail(variables.disputeId) });
    },
  });
}
