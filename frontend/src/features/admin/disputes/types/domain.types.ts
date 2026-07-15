export type DisputeStatus = 'OPEN' | 'RESOLVED';

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  bookingId: string;
  raisedById: string;
  raisedByName: string;
  subject: string;
  description: string;
  status: DisputeStatus;
  resolution: string | null;
  createdAt: Date;
  
  // booking info
  serviceName: string;
  bookingStatus?: string; // Only available on details

  messages: DisputeMessage[];
}

export interface DisputeListResult {
  data: Dispute[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
