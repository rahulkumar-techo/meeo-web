/**
 * @file review.types.ts
 * @description Product customer reviews, rating distribution summaries, submissions, and moderation types.
 */

import { PaginationParams } from '../common/api.types';

export interface RatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  [key: string]: number;
}

export interface ReviewRatingSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  verifiedPurchasesCount?: number;
  ratingDistribution: RatingDistribution;
}

export interface ReviewUser {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface ReviewImage {
  url: string;
  altText?: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount?: number;
  user: ReviewUser;
  images?: ReviewImage[];
  createdAt: string;
  status?: string;
}

export interface ReviewListParams extends PaginationParams {
  rating?: number;
  verifiedOnly?: boolean;
  hasPhotos?: boolean;
  sortBy?: 'recent' | 'highest' | 'lowest' | 'helpful' | string;
}

export interface SubmitReviewPayload {
  productId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
}

export interface SubmitReviewResponse {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  status: string;
  createdAt: string;
}

export interface CustomerReviewItem {
  id: string;
  productId: string;
  productTitle?: string;
  rating: number;
  title: string;
  content?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  helpfulCount?: number;
  createdAt: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  content?: string;
  images?: string[];
}

export interface ReportReviewPayload {
  reason: 'SPAM' | 'OFFENSIVE' | 'IRRELEVANT' | 'INAPPROPRIATE' | string;
  details?: string;
}
