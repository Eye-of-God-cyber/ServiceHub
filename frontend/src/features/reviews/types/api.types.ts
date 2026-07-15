export interface ApiReviewReply {
  id: number;
  reviewId: number;
  providerId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiReview {
  id: number;
  bookingId: number;
  customerId: number;
  providerId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: number;
    userProfile: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    } | null;
  };
  provider?: {
    id: number;
    user: {
      userProfile: {
        firstName: string;
        lastName: string;
      } | null;
    } | null;
  };
  reply?: ApiReviewReply | null;
}

export interface ApiCreateReviewRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}
