import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/review.service";
import { reviewKeys } from "./reviewKeys";
import { useAuth } from "@/providers/AuthProvider";

export function useReviews(params: { page?: number; limit?: number; customerId?: number; providerId?: number } = {}) {
  const { user } = useAuth();
  
  // If we want customer's own reviews and no customerId provided, default to current user
  const effectiveParams = { ...params };
  if (!effectiveParams.customerId && !effectiveParams.providerId && user?.id) {
    effectiveParams.customerId = parseInt(user.id, 10);
  }

  return useQuery({
    queryKey: reviewKeys.list(effectiveParams),
    queryFn: () => getReviews(effectiveParams),
    enabled: !!effectiveParams.customerId || !!effectiveParams.providerId,
  });
}
