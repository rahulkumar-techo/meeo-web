'use client';

/**
 * @file useCoupon.ts
 * @description Promotional coupon code validation and customer redemption history hooks.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { couponService } from '@/services/coupon/couponService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  ValidateCouponPayload,
  ValidateCouponResponse,
  CouponRedemptionRecord,
} from '@/types/coupon/coupon.types';

/**
 * Validate a coupon code against the current cart subtotal.
 */
export function useValidateCouponMutation() {
  return useMutation<ApiResponse<ValidateCouponResponse>, Error, ValidateCouponPayload>({
    mutationFn: (payload) => couponService.validateCoupon(payload),
  });
}

/**
 * Fetch customer's personal coupon redemption history.
 */
export function useMyCouponHistoryQuery() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery<ApiResponse<CouponRedemptionRecord[]>>({
    queryKey: queryKeys.coupons.history(),
    queryFn: () => couponService.getMyCouponHistory(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
