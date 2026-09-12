'use client';

/**
 * @file useCart.ts
 * @description Active cart queries and mutations with optimistic updates and graceful rollback.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart/cartService';
import { queryKeys } from '@/hooks/queryKeys';
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

/**
 * Query hook for current active shopping cart.
 */
export function useCartQuery() {
  return useQuery<ApiResponse<CartData>>({
    queryKey: queryKeys.cart.active(),
    queryFn: () => cartService.getCart(),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Mutation for adding an item variant to the cart.
 */
export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AddToCartResponse>, Error, AddToCartPayload>({
    mutationFn: (payload) => cartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() });
    },
  });
}

/**
 * Mutation for updating item quantity with optimistic cache updates.
 */
export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateCartItemResponse>,
    Error,
    { itemId: string; payload: UpdateCartItemPayload },
    { previousCart?: ApiResponse<CartData> }
  >({
    mutationFn: ({ itemId, payload }) => cartService.updateCartItem(itemId, payload),
    onMutate: async ({ itemId, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() });
      const previousCart = queryClient.getQueryData<ApiResponse<CartData>>(
        queryKeys.cart.active()
      );

      if (previousCart?.data) {
        const updatedItems = previousCart.data.items
          .map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: payload.quantity,
                  lineTotal: item.unitPrice * payload.quantity,
                }
              : item
          )
          .filter((item) => item.quantity > 0);

        const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.lineTotal, 0);

        queryClient.setQueryData<ApiResponse<CartData>>(queryKeys.cart.active(), {
          ...previousCart,
          data: {
            ...previousCart.data,
            items: updatedItems,
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: newSubtotal,
            total: Math.max(0, newSubtotal - (previousCart.data.discountTotal || 0)),
          },
        });
      }

      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() });
    },
  });
}

/**
 * Mutation for removing an item from the cart with optimistic update.
 */
export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RemoveCartItemResponse>,
    Error,
    string,
    { previousCart?: ApiResponse<CartData> }
  >({
    mutationFn: (itemId) => cartService.removeFromCart(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() });
      const previousCart = queryClient.getQueryData<ApiResponse<CartData>>(
        queryKeys.cart.active()
      );

      if (previousCart?.data) {
        const updatedItems = previousCart.data.items.filter((item) => item.id !== itemId);
        const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.lineTotal, 0);

        queryClient.setQueryData<ApiResponse<CartData>>(queryKeys.cart.active(), {
          ...previousCart,
          data: {
            ...previousCart.data,
            items: updatedItems,
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: newSubtotal,
            total: Math.max(0, newSubtotal - (previousCart.data.discountTotal || 0)),
          },
        });
      }

      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() });
    },
  });
}

/**
 * Mutation for clearing the entire shopping cart.
 */
export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, void>({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.cart.active(), (prev: any) =>
        prev?.data
          ? {
              ...prev,
              data: {
                ...prev.data,
                items: [],
                itemCount: 0,
                subtotal: 0,
                total: 0,
                discountTotal: 0,
              },
            }
          : prev
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() });
    },
  });
}

/**
 * Mutation for merging anonymous guest cart into customer account post-login.
 */
export function useMergeCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<MergeCartResponse>, Error, MergeCartPayload>({
    mutationFn: (payload) => cartService.mergeGuestCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() });
    },
  });
}
