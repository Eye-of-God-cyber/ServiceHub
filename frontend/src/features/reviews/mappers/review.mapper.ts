import type { ApiReview, ApiReviewReply } from "../types/api.types";
import type { Review, ReviewReply } from "../types/domain.types";

export function mapReviewReplyToDomain(apiReply: ApiReviewReply): ReviewReply {
  return {
    id: apiReply.id.toString(),
    comment: apiReply.comment,
    createdAt: new Date(apiReply.createdAt),
  };
}

export function mapReviewToDomain(apiReview: ApiReview): Review {
  return {
    id: apiReview.id.toString(),
    bookingId: apiReview.bookingId.toString(),
    rating: apiReview.rating,
    comment: apiReview.comment,
    createdAt: new Date(apiReview.createdAt),
    customer: {
      id: apiReview.customerId.toString(),
      firstName: apiReview.customer?.userProfile?.firstName || "Unknown",
      lastName: apiReview.customer?.userProfile?.lastName || "Customer",
      avatarUrl: apiReview.customer?.userProfile?.avatarUrl || null,
    },
    provider: {
      id: apiReview.providerId.toString(),
      firstName: apiReview.provider?.user?.userProfile?.firstName || "Unknown",
      lastName: apiReview.provider?.user?.userProfile?.lastName || "Provider",
    },
    reply: apiReview.reply ? mapReviewReplyToDomain(apiReview.reply) : null,
  };
}
