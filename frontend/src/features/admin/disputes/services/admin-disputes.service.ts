import api from "@/lib/api";
import { ApiDisputeListResponse, ApiDisputeResponse, ApiDisputeMessageResponse } from "../types/api.types";

export const adminDisputesService = {
  /**
   * List disputes for admin
   */
  async getDisputes(params: { page: number; limit: number }): Promise<ApiDisputeListResponse> {
    const { data } = await api.get<ApiDisputeListResponse>("/disputes", { params });
    return data;
  },

  /**
   * Get dispute details by ID
   */
  async getDisputeById(disputeId: string): Promise<ApiDisputeResponse> {
    const { data } = await api.get<ApiDisputeResponse>(`/disputes/${disputeId}`);
    return data;
  },

  /**
   * Resolve a dispute (Admin only)
   */
  async resolveDispute(disputeId: string, resolution: string): Promise<ApiDisputeResponse> {
    const { data } = await api.patch<ApiDisputeResponse>(`/admin/disputes/${disputeId}/resolve`, { resolution });
    return data;
  },

  /**
   * Add a message to a dispute
   */
  async addDisputeMessage(disputeId: string, message: string): Promise<ApiDisputeMessageResponse> {
    const { data } = await api.post<ApiDisputeMessageResponse>(`/disputes/${disputeId}/messages`, { message });
    return data;
  }
};
