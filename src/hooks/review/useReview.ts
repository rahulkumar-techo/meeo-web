'use client';

/**
 * @file useReview.ts
 * @description Product review listings, star distribution summaries, submissions, and moderation hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review/reviewService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
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

/**
 * Fetch approved reviews for a product with pagination and filters.
 * Stale time: 5 mins.
 */
export function useProductReviewsQuery(productId: string, params?: ReviewListParams) {
  return useQuery<PaginatedResponse<ReviewItem>>({
    queryKey: queryKeys.reviews.byProduct(productId, params),
    queryFn: () => reviewService.getProductReviews(productId, params),
    enabled: Boolean(productId),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch product rating summary with 1-to-5 star breakdown distribution.
 * Stale time: 10 mins.
 */
export function useProductRatingSummaryQuery(productId: string) {
  return useQuery<ApiResponse<ReviewRatingSummary>>({
    queryKey: queryKeys.reviews.summary(productId),
    queryFn: () => reviewService.getProductRatingSummary(productId),
    enabled: Boolean(productId),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Submit a product review.
 */
export function useSubmitReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<SubmitReviewResponse>, Error, SubmitReviewPayload>({
    mutationFn: (payload) => reviewService.submitReview(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProduct(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.summary(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.myReviews() });
    },
  });
}

/**
 * Fetch customer's submitted review history.
 */
export function useMyReviewsQuery() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery<ApiResponse<CustomerReviewItem[]>>({
    queryKey: queryKeys.reviews.myReviews(),
    queryFn: () => reviewService.getMyReviews(),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Update existing customer review.
 */
export function useUpdateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ReviewItem>,
    Error,
    { id: string; payload: UpdateReviewPayload }
  >({
    mutationFn: ({ id, payload }) => reviewService.updateReview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

/**
 * Delete customer's own review.
 */
export function useDeleteReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (id) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

/**
 * Report an abusive review for moderation.
 */
export function useReportReviewMutation() {
  return useMutation<
    ApiResponse<null>,
    Error,
    { id: string; payload: ReportReviewPayload }
  >({
    mutationFn: ({ id, payload }) => reviewService.reportReview(id, payload),
  });
}
