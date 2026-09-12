/**
 * @file reviewService.ts
 * @description Product customer reviews, rating breakdown summaries, submissions, and moderation reports.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse, PaginatedResponse } from '@/types/common/api.types';
import type {
  ReviewItem,
  ReviewListParams,
  ReviewRatingSummary,
  SubmitReviewPayload,
  SubmitReviewResponse,
  CustomerReviewItem,
  UpdateReviewPayload,
  ReportReviewPayload,
} from '@/types/review/review.types';

export const reviewService = {
  /**
   * List approved reviews for a product with pagination, filtering, and sorting.
   */
  async getProductReviews(
    productId: string,
    params?: ReviewListParams
  ): Promise<PaginatedResponse<ReviewItem>> {
    const response = await apiClient.get<PaginatedResponse<ReviewItem>>(
      `/reviews/products/${productId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Fetch high-level rating summary and 1-to-5 star distribution for PDP rating cards.
   */
  async getProductRatingSummary(
    productId: string
  ): Promise<ApiResponse<ReviewRatingSummary>> {
    const response = await apiClient.get<ApiResponse<ReviewRatingSummary>>(
      `/reviews/products/${productId}/summary`
    );
    return response.data;
  },

  /**
   * Submit a new customer review and rating with optional photo URLs.
   */
  async submitReview(
    payload: SubmitReviewPayload
  ): Promise<ApiResponse<SubmitReviewResponse>> {
    const response = await apiClient.post<ApiResponse<SubmitReviewResponse>>(
      '/reviews',
      payload
    );
    return response.data;
  },

  /**
   * Fetch all reviews submitted by the authenticated customer.
   */
  async getMyReviews(): Promise<ApiResponse<CustomerReviewItem[]>> {
    const response = await apiClient.get<ApiResponse<CustomerReviewItem[]>>(
      '/reviews/my-reviews'
    );
    return response.data;
  },

  /**
   * Update customer's own review.
   */
  async updateReview(
    id: string,
    payload: UpdateReviewPayload
  ): Promise<ApiResponse<ReviewItem>> {
    const response = await apiClient.put<ApiResponse<ReviewItem>>(
      `/reviews/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete customer's own review.
   */
  async deleteReview(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Report an inappropriate or abusive review for moderation.
   */
  async reportReview(
    id: string,
    payload: ReportReviewPayload
  ): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      `/reviews/${id}/report`,
      payload
    );
    return response.data;
  },
};
