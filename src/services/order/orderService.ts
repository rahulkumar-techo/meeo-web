/**
 * @file orderService.ts
 * @description Pre-checkout validation, atomic order placement, order history, and self-service cancellation.
 */

import { apiClient } from '@/config/client';
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

export const orderService = {
  /**
   * Pre-checkout breakdown: calculates live canonical prices, taxes, shipping, coupon discount, and inventory availability.
   */
  async validateCheckout(
    payload: ValidateCheckoutPayload
  ): Promise<ApiResponse<ValidateCheckoutResponse>> {
    const response = await apiClient.post<ApiResponse<ValidateCheckoutResponse>>(
      '/orders/validate-checkout',
      payload
    );
    return response.data;
  },

  /**
   * Atomic order placement with stock reservation and idempotency guarantee.
   */
  async placeOrder(
    payload: PlaceOrderPayload,
    idempotencyKey?: string
  ): Promise<ApiResponse<PlaceOrderResponse>> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await apiClient.post<ApiResponse<PlaceOrderResponse>>(
      '/orders/checkout',
      payload,
      { headers }
    );
    return response.data;
  },

  /**
   * List customer's order history with pagination & status filters.
   */
  async getOrders(
    params?: OrderListParams
  ): Promise<PaginatedResponse<OrderListItem>> {
    const response = await apiClient.get<PaginatedResponse<OrderListItem>>('/orders', {
      params,
    });
    return response.data;
  },

  /**
   * Fetch full order details by UUID.
   */
  async getOrderById(id: string): Promise<ApiResponse<OrderDetails>> {
    const response = await apiClient.get<ApiResponse<OrderDetails>>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Fetch order details by human-readable Order Number (e.g. ORD-20260912-7891).
   */
  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<OrderDetails>> {
    const response = await apiClient.get<ApiResponse<OrderDetails>>(
      `/orders/number/${orderNumber}`
    );
    return response.data;
  },

  /**
   * Cancel an eligible pending/confirmed order and release inventory hold.
   */
  async cancelOrder(
    id: string,
    payload: CancelOrderPayload
  ): Promise<ApiResponse<CancelOrderResponse>> {
    const response = await apiClient.post<ApiResponse<CancelOrderResponse>>(
      `/orders/${id}/cancel`,
      payload
    );
    return response.data;
  },
};
