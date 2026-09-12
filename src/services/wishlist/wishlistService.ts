/**
 * @file wishlistService.ts
 * @description Customer wishlist bookmarks, favorite toggles, and atomic transfer to cart.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  WishlistData,
  AddToWishlistResponse,
  MoveWishlistToCartPayload,
  MoveWishlistToCartResponse,
} from '@/types/wishlist/wishlist.types';

export const wishlistService = {
  /**
   * Retrieve customer's saved wishlist products.
   */
  async getWishlist(): Promise<ApiResponse<WishlistData>> {
    const response = await apiClient.get<ApiResponse<WishlistData>>('/wishlist');
    return response.data;
  },

  /**
   * Add a product to customer wishlist.
   */
  async addToWishlist(productId: string): Promise<ApiResponse<AddToWishlistResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AddToWishlistResponse>>(
        `/wishlist/products/${productId}`
      );
      return response.data;
    } catch {
      // Body payload fallback
      const fallback = await apiClient.post<ApiResponse<AddToWishlistResponse>>('/wishlist', {
        productId,
      });
      return fallback.data;
    }
  },

  /**
   * Remove a product from customer wishlist.
   */
  async removeFromWishlist(productId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/wishlist/products/${productId}`
    );
    return response.data;
  },

  /**
   * Move saved product directly into cart and remove from wishlist in one step.
   */
  async moveToCart(
    productId: string,
    payload: MoveWishlistToCartPayload
  ): Promise<ApiResponse<MoveWishlistToCartResponse>> {
    const response = await apiClient.post<ApiResponse<MoveWishlistToCartResponse>>(
      `/wishlist/products/${productId}/move-to-cart`,
      payload
    );
    return response.data;
  },
};
