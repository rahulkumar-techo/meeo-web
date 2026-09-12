/**
 * @file couponService.ts
 * @description Promotional coupon code validation, spend thresholds, and customer redemption history.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  ValidateCouponPayload,
  ValidateCouponResponse,
  CouponRedemptionRecord,
} from '@/types/coupon/coupon.types';

export const couponService = {
  /**
   * Validate coupon code and preview discount calculations without committing an order.
   */
  async validateCoupon(
    payload: ValidateCouponPayload
  ): Promise<ApiResponse<ValidateCouponResponse>> {
    const response = await apiClient.post<ApiResponse<ValidateCouponResponse>>(
      '/coupons/validate',
      payload
    );
    return response.data;
  },

  /**
   * Fetch customer's personal coupon redemption history.
   */
  async getMyCouponHistory(): Promise<ApiResponse<CouponRedemptionRecord[]>> {
    const response = await apiClient.get<ApiResponse<CouponRedemptionRecord[]>>(
      '/coupons/my-history'
    );
    return response.data;
  },
};
