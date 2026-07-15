export interface ApiDisputeMessageResponse {
  id: number;
  disputeId: number;
  senderId: string;
  message: string;
  createdAt: string;
  sender: {
    userProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

export interface ApiDisputeResponse {
  id: number;
  bookingId: number;
  raisedById: string;
  subject: string;
  description: string;
  status: string; // OPEN, RESOLVED
  resolution: string | null;
  createdAt: string;
  updatedAt: string;

  // relations
  raisedBy?: {
    id?: string;
    email?: string;
    userProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };

  booking?: {
    id: number;
    status?: string;
    service: {
      name: string;
    };
  };

  messages?: ApiDisputeMessageResponse[];
}

export interface ApiDisputeListResponse {
  data: ApiDisputeResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
