/**
 * @file api.types.ts
 * @description Standard API envelopes, pagination structures, error envelopes, and HTTP request headers.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
  error?: string;
  details?: Array<{
    field?: string;
    issue?: string;
    message?: string;
  }>;
  timestamp?: string;
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems?: number;
  totalOrders?: number;
  totalReviews?: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
