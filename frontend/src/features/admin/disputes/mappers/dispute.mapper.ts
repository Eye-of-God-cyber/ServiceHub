import { ApiDisputeResponse, ApiDisputeListResponse, ApiDisputeMessageResponse } from "../types/api.types";
import { Dispute, DisputeStatus, DisputeListResult, DisputeMessage } from "../types/domain.types";

export function mapDisputeMessageToDomain(apiMessage: ApiDisputeMessageResponse): DisputeMessage {
  return {
    id: apiMessage.id.toString(),
    senderId: apiMessage.senderId,
    senderName: apiMessage.sender?.userProfile 
      ? `${apiMessage.sender.userProfile.firstName} ${apiMessage.sender.userProfile.lastName}`.trim()
      : "Unknown User",
    message: apiMessage.message,
    createdAt: new Date(apiMessage.createdAt),
  };
}

export function mapDisputeToDomain(apiDispute: ApiDisputeResponse): Dispute {
  return {
    id: apiDispute.id.toString(),
    bookingId: apiDispute.bookingId.toString(),
    raisedById: apiDispute.raisedById,
    raisedByName: apiDispute.raisedBy?.userProfile
      ? `${apiDispute.raisedBy.userProfile.firstName} ${apiDispute.raisedBy.userProfile.lastName}`.trim()
      : "Unknown User",
    subject: apiDispute.subject,
    description: apiDispute.description,
    status: apiDispute.status as DisputeStatus,
    resolution: apiDispute.resolution,
    createdAt: new Date(apiDispute.createdAt),
    
    serviceName: apiDispute.booking?.service?.name || "Unknown Service",
    bookingStatus: apiDispute.booking?.status,

    messages: apiDispute.messages ? apiDispute.messages.map(mapDisputeMessageToDomain) : [],
  };
}

export function mapDisputeListToDomain(apiList: ApiDisputeListResponse): DisputeListResult {
  return {
    data: apiList.data.map(mapDisputeToDomain),
    meta: apiList.meta,
  };
}
