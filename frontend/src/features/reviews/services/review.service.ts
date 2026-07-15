import api from "@/lib/api";
import type { ApiResponse, PaginatedApiResponse, PaginationMeta } from "@/types/api";
import type { ApiReview, ApiCreateReviewRequest } from "../types/api.types";
import type { Review } from "../types/domain.types";
import { mapReviewToDomain } from "../mappers/review.mapper";

export async function getReviews(params?: { customerId?: number; providerId?: number; page?: number; limit?: number }): Promise<{ items: Review[], meta: PaginationMeta }> {
  const response = await api.get<PaginatedApiResponse<ApiReview>>("/reviews", { params });
  return {
    items: response.data.data.map(mapReviewToDomain),
    meta: response.data.meta,
  };
}

export async function createReview(payload: ApiCreateReviewRequest): Promise<Review> {
  const response = await api.post<ApiResponse<ApiReview>>("/reviews", payload);
  return mapReviewToDomain(response.data.data);
}
