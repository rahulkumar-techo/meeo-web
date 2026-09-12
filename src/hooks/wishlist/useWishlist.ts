'use client';

/**
 * @file useWishlist.ts
 * @description Customer wishlist queries, optimistic toggle mutations, and atomic move-to-cart hook.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist/wishlistService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  WishlistData,
  AddToWishlistResponse,
  MoveWishlistToCartPayload,
  MoveWishlistToCartResponse,
} from '@/types/wishlist/wishlist.types';

/**
 * Fetch customer's saved wishlist products.
 * Stale time: 3 mins.
 */
export function useWishlistQuery() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery<ApiResponse<WishlistData>>({
    queryKey: queryKeys.wishlist.active(),
    queryFn: () => wishlistService.getWishlist(),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Add a product to wishlist.
 */
export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AddToWishlistResponse>, Error, string>({
    mutationFn: (productId) => wishlistService.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.active() });
    },
  });
}

/**
 * Remove a product from wishlist with optimistic update.
 */
export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    string,
    { previousWishlist?: ApiResponse<WishlistData> }
  >({
    mutationFn: (productId) => wishlistService.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.active() });
      const previousWishlist = queryClient.getQueryData<ApiResponse<WishlistData>>(
        queryKeys.wishlist.active()
      );

      if (previousWishlist?.data) {
        const updatedItems = previousWishlist.data.items.filter(
          (item) => item.productId !== productId && item.id !== productId
        );

        queryClient.setQueryData<ApiResponse<WishlistData>>(queryKeys.wishlist.active(), {
          ...previousWishlist,
          data: {
            totalItems: updatedItems.length,
            items: updatedItems,
          },
        });
      }

      return { previousWishlist };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist.active(), context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.active() });
    },
  });
}

/**
 * Move saved wishlist product directly to active cart.
 */
export function useMoveWishlistToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MoveWishlistToCartResponse>,
    Error,
    { productId: string; payload: MoveWishlistToCartPayload }
  >({
    mutationFn: ({ productId, payload }) => wishlistService.moveToCart(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() });
    },
  });
}
