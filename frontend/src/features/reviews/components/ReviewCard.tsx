import { Star, MessageCircle } from "lucide-react";
import type { Review } from "../types/domain.types";
import { cn } from "@/lib/utils";

function ReviewRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            rating >= star ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function ReviewHeader({ review }: { review: Review }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
      <div>
        <h4 className="font-semibold text-lg">
          For {review.provider.firstName} {review.provider.lastName}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <ReviewRating rating={review.rating} />
          <span className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(review.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewComment({ comment }: { comment: string | null }) {
  if (!comment) return null;
  return (
    <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
      &quot;{comment}&quot;
    </p>
  );
}

function ProviderReply({ reply }: { reply: Review["reply"] }) {
  if (!reply) return null;
  
  return (
    <div className="mt-5 bg-muted/40 rounded-xl p-4 border-l-4 border-l-primary/50">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Provider Reply</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(reply.createdAt)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {reply.comment}
      </p>
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-5 sm:p-6 transition-colors hover:bg-muted/10 shadow-sm">
      <ReviewHeader review={review} />
      <ReviewComment comment={review.comment} />
      <ProviderReply reply={review.reply} />
    </div>
  );
}
