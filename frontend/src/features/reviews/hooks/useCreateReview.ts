import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../services/review.service";
import { reviewKeys } from "./reviewKeys";
import type { ApiCreateReviewRequest } from "../types/api.types";
import { toast } from "sonner";
import { parseApiError } from "@/utils/parseApiError";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiCreateReviewRequest) => createReview(data),
    onSuccess: () => {
      toast.success("Review Submitted", {
        description: "Thank you for sharing your feedback!",
      });
      // Invalidate review lists to refetch
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
    onError: (error: unknown) => {
      const message = parseApiError(error);
      toast.error("Failed to submit review", {
        description: message,
      });
    },
  });
}
