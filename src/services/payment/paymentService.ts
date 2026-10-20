/**
 * @file paymentService.ts
 * @description Payment intent initialization (Stripe, Razorpay, Mock), status verification, and payment retries.
 */

import { apiClient } from '@/config/client';
import { ApiRoute } from '@/routes';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  InitializePaymentPayload,
  InitializePaymentResponse,
  PaymentDetails,
  RetryPaymentPayload,
  RetryPaymentResponse,
  VerifyPaymentPayload,
} from '@/types/payment/payment.types';

export const paymentService = {
  /**
   * Initialize payment intent for order in PENDING status.
   */
  async initializePayment(
    payload: InitializePaymentPayload
  ): Promise<ApiResponse<InitializePaymentResponse>> {
    const response = await apiClient.post<ApiResponse<InitializePaymentResponse>>(
      ApiRoute.PAYMENTS.INITIALIZE,
      payload
    );
    return response.data;
  },

  /**
   * Verify payment signature / transaction status.
   */
  async verifyPayment(payload: VerifyPaymentPayload): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      ApiRoute.PAYMENTS.VERIFY,
      payload
    );
    return response.data;
  },

  /**
   * Inspect current payment breakdown, attempts, and verification status.
   */
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentDetails>> {
    const response = await apiClient.get<ApiResponse<PaymentDetails>>(
      ApiRoute.PAYMENTS.GET_PAYMENT(paymentId)
    );
    return response.data;
  },

  /**
   * Record payment failure or dismissal.
   */
  async recordFailure(payload: {
    orderId: string;
    failureCode?: string;
    failureMessage?: string;
    providerPaymentId?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      ApiRoute.PAYMENTS.FAIL,
      payload
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
      ApiRoute.PAYMENTS.RETRY,
      payload
    );
    return response.data;
  },
};
