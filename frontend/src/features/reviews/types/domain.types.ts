export interface ReviewReply {
  id: string;
  comment: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string | null;
  createdAt: Date;
  
  // Who wrote the review
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  
  // Who the review is for
  provider: {
    id: string;
    firstName: string;
    lastName: string;
  };
  
  reply: ReviewReply | null;
}
