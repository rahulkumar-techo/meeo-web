'use client';

/**
 * @file useOrder.ts
 * @description Pre-checkout validation, order placement, order history, and self-service cancellation hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order/orderService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  ValidateCheckoutPayload,
  ValidateCheckoutResponse,
  PlaceOrderPayload,
  PlaceOrderResponse,
  OrderDetails,
  OrderListParams,
  OrderListResponseData,
  CancelOrderPayload,
  CancelOrderResponse,
} from '@/types/order/order.types';

/**
 * Validate pre-checkout pricing, tax, shipping, coupon, and stock breakdown.
 */
export function useValidateCheckoutMutation() {
  return useMutation<ApiResponse<ValidateCheckoutResponse>, Error, ValidateCheckoutPayload>({
    mutationFn: (payload) => orderService.validateCheckout(payload),
  });
}

/**
 * Place order with atomic stock reservation and idempotency.
 */
export function usePlaceOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PlaceOrderResponse>,
    Error,
    { payload: PlaceOrderPayload; idempotencyKey?: string }
  >({
    mutationFn: ({ payload, idempotencyKey }) =>
      orderService.placeOrder(payload, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Fetch customer's paginated order history with status filters.
 */
export function useOrdersQuery(params?: OrderListParams, options?: { live?: boolean }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery<ApiResponse<OrderListResponseData>>({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderService.getOrders(params),
    enabled: isAuthenticated,
    staleTime: 5 * 1000,
    refetchInterval: options?.live === false ? false : 5000,
    refetchIntervalInBackground: false,
  });
}

export interface OrderQueryOptions {
  live?: boolean;
  refetchInterval?: number | false;
}

/**
 * Fetch full order details by UUID with live background auto-polling.
 */
export function useOrderByIdQuery(id: string, options?: OrderQueryOptions) {
  return useQuery<ApiResponse<OrderDetails>>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
    staleTime: 3 * 1000,
    refetchInterval: (query) => {
      if (options?.refetchInterval !== undefined) return options.refetchInterval;
      if (options?.live === false) return false;
      const status = query.state.data?.data?.status;
      // Stop polling once order is in final terminal state
      if (status === 'DELIVERED' || status === 'CANCELLED') {
        return false;
      }
      // Poll every 3 seconds for active orders
      return 3000;
    },
    refetchIntervalInBackground: false,
  });
}

/**
 * Fetch full order details by order number with live background auto-polling.
 */
export function useOrderByNumberQuery(orderNumber: string, options?: OrderQueryOptions) {
  return useQuery<ApiResponse<OrderDetails>>({
    queryKey: queryKeys.orders.byNumber(orderNumber),
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: Boolean(orderNumber),
    staleTime: 3 * 1000,
    refetchInterval: (query) => {
      if (options?.refetchInterval !== undefined) return options.refetchInterval;
      if (options?.live === false) return false;
      const status = query.state.data?.data?.status;
      if (status === 'DELIVERED' || status === 'CANCELLED') {
        return false;
      }
      return 3000;
    },
    refetchIntervalInBackground: false,
  });
}

/**
 * Cancel an eligible pending/confirmed order.
 */
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CancelOrderResponse>,
    Error,
    { id: string; payload: CancelOrderPayload }
  >({
    mutationFn: ({ id, payload }) => orderService.cancelOrder(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    },
  });
}
