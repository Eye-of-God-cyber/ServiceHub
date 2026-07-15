"use client";

import { useReviews } from "@/features/reviews/hooks";
import { ReviewList } from "@/features/reviews/components";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";

export default function ReviewsPage() {
  const { data, isLoading, error, refetch, isRefetching } = useReviews();

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Reviews</h1>
          <p className="text-muted-foreground">
            View the reviews you&apos;ve left for service providers.
          </p>
        </div>
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-12 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Failed to Load Reviews</h2>
        <p className="text-muted-foreground">
          We encountered an error while retrieving your reviews. Please try again.
        </p>
        <Button onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCcw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Reviews</h1>
        <p className="text-muted-foreground">
          View the reviews you&apos;ve left for service providers.
        </p>
      </div>

      <ReviewList reviews={data.items} />
    </div>
  );
}
