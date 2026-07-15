import type { Review } from "../types/domain.types";
import { ReviewCard } from "./ReviewCard";
import { ReviewEmptyState } from "./ReviewEmptyState";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <ReviewEmptyState />;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
