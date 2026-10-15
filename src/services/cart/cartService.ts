/**
 * @file cartService.ts
 * @description Customer and guest cart management, item adjustments, and post-login cart merge.
 */

import { apiClient } from '@/config/client';
import { clearSessionId } from '@/lib/session';
import { ApiRoute } from '@/routes';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  CartData,
  AddToCartPayload,
  AddToCartResponse,
  UpdateCartItemPayload,
  UpdateCartItemResponse,
  RemoveCartItemResponse,
  MergeCartPayload,
  MergeCartResponse,
} from '@/types/cart/cart.types';

export const cartService = {
  /**
   * Fetch active shopping cart with live subtotals, item discounts, and stock validation.
   */
  async getCart(): Promise<ApiResponse<CartData>> {
    const response = await apiClient.get<ApiResponse<CartData>>(ApiRoute.CART.CART);
    return response.data;
  },

  /**
   * Add a product variant to the cart.
   */
  async addToCart(payload: AddToCartPayload): Promise<ApiResponse<AddToCartResponse>> {
    const response = await apiClient.post<ApiResponse<AddToCartResponse>>(
      ApiRoute.CART.CART_ITEMS,
      payload
    );
    return response.data;
  },

  /**
   * Update item quantity in cart. Setting quantity to 0 removes the item.
   */
  async updateCartItem(
    itemId: string,
    payload: UpdateCartItemPayload
  ): Promise<ApiResponse<UpdateCartItemResponse>> {
    const response = await apiClient.patch<ApiResponse<UpdateCartItemResponse>>(
      ApiRoute.CART.UPDATE_CART_ITEMS(itemId),
      payload
    );
    return response.data;
  },

  /**
   * Remove a specific item from the cart.
   */
  async removeFromCart(itemId: string): Promise<ApiResponse<RemoveCartItemResponse>> {
    const response = await apiClient.delete<ApiResponse<RemoveCartItemResponse>>(
      ApiRoute.CART.DELETE_CART_ITEMS(itemId)
    );
    return response.data;
  },

  /**
   * Empty the entire shopping cart.
   */
  async clearCart(): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(ApiRoute.CART.CART);
    return response.data;
  },

  /**
   * Merge anonymous guest cart into customer account after login.
   */
  async mergeGuestCart(payload: MergeCartPayload): Promise<ApiResponse<MergeCartResponse>> {
    const response = await apiClient.post<ApiResponse<MergeCartResponse>>(
      ApiRoute.CART.MERGE_CART,
      payload
    );
    if (response.data.success) {
      clearSessionId();
    }
    return response.data;
  },
};
