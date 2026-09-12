'use client';

/**
 * @file useOrder.ts
 * @description Pre-checkout validation, order placement, order history, and self-service cancellation hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order/orderService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse, PaginatedResponse } from '@/types/common/api.types';
import type {
  ValidateCheckoutPayload,
  ValidateCheckoutResponse,
  PlaceOrderPayload,
  PlaceOrderResponse,
  OrderDetails,
  OrderListItem,
  OrderListParams,
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
export function useOrdersQuery(params?: OrderListParams) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery<PaginatedResponse<OrderListItem>>({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderService.getOrders(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/**
 * Fetch full order details by UUID.
 */
export function useOrderByIdQuery(id: string) {
  return useQuery<ApiResponse<OrderDetails>>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch full order details by order number.
 */
export function useOrderByNumberQuery(orderNumber: string) {
  return useQuery<ApiResponse<OrderDetails>>({
    queryKey: queryKeys.orders.byNumber(orderNumber),
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: Boolean(orderNumber),
    staleTime: 30 * 1000,
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
