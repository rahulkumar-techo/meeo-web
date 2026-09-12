'use client';

/**
 * @file usePayment.ts
 * @description Payment intent initialization, payment status verification with smart polling, and retry hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment/paymentService';
import { queryKeys } from '@/hooks/queryKeys';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  InitializePaymentPayload,
  InitializePaymentResponse,
  PaymentDetails,
  RetryPaymentPayload,
  RetryPaymentResponse,
} from '@/types/payment/payment.types';

/**
 * Initialize payment intent for order (Stripe, Razorpay, Mock).
 */
export function useInitializePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<InitializePaymentResponse>, Error, InitializePaymentPayload>({
    mutationFn: (payload) => paymentService.initializePayment(payload),
    onSuccess: (res) => {
      if (res.data?.paymentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.status(res.data.paymentId),
        });
      }
    },
  });
}

/**
 * Inspect payment status with auto-polling while status is PROCESSING or PENDING.
 */
export function usePaymentStatusQuery(paymentId?: string, pollInterval = 3000) {
  return useQuery<ApiResponse<PaymentDetails>>({
    queryKey: queryKeys.payments.status(paymentId || ''),
    queryFn: () => paymentService.getPaymentStatus(paymentId!),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === 'PROCESSING' || status === 'PENDING' || status === 'REQUIRES_ACTION') {
        return pollInterval;
      }
      return false;
    },
    staleTime: 5000,
  });
}

/**
 * Retry failed payment attempt with alternative method or sequence.
 */
export function useRetryPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<RetryPaymentResponse>, Error, RetryPaymentPayload>({
    mutationFn: (payload) => paymentService.retryPayment(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.status(variables.paymentId),
      });
    },
  });
}
