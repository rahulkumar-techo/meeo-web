/**
 * @file paymentService.ts
 * @description Payment intent initialization (Stripe, Razorpay, Mock), status verification, and payment retries.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  InitializePaymentPayload,
  InitializePaymentResponse,
  PaymentDetails,
  RetryPaymentPayload,
  RetryPaymentResponse,
} from '@/types/payment/payment.types';

export const paymentService = {
  /**
   * Initialize payment intent for order in PENDING status.
   */
  async initializePayment(
    payload: InitializePaymentPayload
  ): Promise<ApiResponse<InitializePaymentResponse>> {
    const response = await apiClient.post<ApiResponse<InitializePaymentResponse>>(
      '/payments/initialize',
      payload
    );
    return response.data;
  },

  /**
   * Inspect current payment breakdown, attempts, and verification status.
   */
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentDetails>> {
    const response = await apiClient.get<ApiResponse<PaymentDetails>>(
      `/payments/${paymentId}`
    );
    return response.data;
  },

  /**
   * Retry a failed payment on the same order with a new attempt sequence or method.
   */
  async retryPayment(
    payload: RetryPaymentPayload
  ): Promise<ApiResponse<RetryPaymentResponse>> {
    const response = await apiClient.post<ApiResponse<RetryPaymentResponse>>(
      '/payments/retry',
      payload
    );
    return response.data;
  },
};
