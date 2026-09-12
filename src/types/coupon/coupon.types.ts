/**
 * @file coupon.types.ts
 * @description Promotional discount codes, validation eligibility checks, and redemption history types.
 */

export interface ValidateCouponPayload {
  code: string;
  cartSubtotal: number;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  code: string;
  message?: string;
  discountType?: 'PERCENTAGE' | 'FIXED' | string;
  discountValue?: number;
  discountAmount?: number;
  freeShipping?: boolean;
  minOrderAmount?: number;
  subtotal?: number;
  finalAmount?: number;
  currentSubtotal?: number;
  shortfall?: number;
}

export interface CouponRedemptionRecord {
  couponCode: string;
  discountAmount: number;
  orderId: string;
  orderNumber: string;
  usedAt: string;
}
