'use client';

/**
 * @file CheckoutReviewStep.tsx
 * @description Step 2 of Checkout: Order summary & line item review with delivery speed
 * and live coupon code validation.
 */

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Tag,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import type { CartItem } from '@/types/cart';
import type { SavedAddress } from '@/types/user/user.types';
import type { ValidateCheckoutResponse } from '@/types/order/order.types';

interface CheckoutReviewStepProps {
  items: CartItem[];
  selectedAddress: SavedAddress | null;
  onBackToAddress: () => void;
  onProceedToPayment: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: string | null;
  onApplyCoupon: () => Promise<void>;
  onRemoveCoupon: () => Promise<void>;
  isValidatingCoupon: boolean;
  validationData: ValidateCheckoutResponse | null;
}

export const CheckoutReviewStep: React.FC<CheckoutReviewStepProps> = ({
  items,
  selectedAddress,
  onBackToAddress,
  onProceedToPayment,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isValidatingCoupon,
  validationData,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Delivery Destination Snapshot Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E2DA] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center shrink-0 text-[#8C5338] mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                Delivering To:
              </span>
              <span className="text-xs font-bold text-[#2D2621]">
                {selectedAddress?.recipientName || 'Default Customer'}
              </span>
              <span className="text-[11px] text-[#786C64]">({selectedAddress?.phone})</span>
            </div>
            <p className="text-xs text-[#786C64] line-clamp-1 mt-0.5">
              {selectedAddress?.addressLine1}
              {selectedAddress?.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''},{' '}
              {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.postalCode}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToAddress}
          className="text-xs font-bold text-[#8C5338] hover:underline self-end sm:self-center cursor-pointer shrink-0"
        >
          Change
        </button>
      </div>

      {/* Items in Cart Review Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-7 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2DA] mb-4">
          <h3 className="text-base font-bold text-[#2D2621]">
            Order Items ({items.length})
          </h3>
          <span className="text-xs text-[#786C64]">
            {items.reduce((acc, it) => acc + it.quantity, 0)} Total Units
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#786C64]">
            Your shopping cart is empty.
          </div>
        ) : (
          <div className="divide-y divide-[#E8E2DA]/60">
            {items.map((item) => {
              const product = item.product as any;
              const img =
                product.image ||
                product.images?.[0] ||
                '/assets/meeo-icon.svg';

              return (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-16 h-16 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] overflow-hidden shrink-0">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#2D2621] truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#786C64] truncate">
                        {product.brand && `${product.brand} • `}
                        Qty: {item.quantity}
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                        {item.selectedColor && ` • ${item.selectedColor}`}
                      </p>
                      <div className="text-xs font-semibold text-[#8C5338] mt-0.5">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')} each
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-[#2D2621]">
                      ₹{(Number(product.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delivery Guarantee Timeline */}
        <div className="mt-6 pt-4 border-t border-[#E8E2DA] flex items-center gap-3 text-xs text-[#786C64] bg-[#FAF8F5] p-3.5 rounded-xl">
          <Truck className="w-4 h-4 text-[#8C5338] shrink-0" />
          <span>
            <strong className="text-[#2D2621]">Estimated Delivery:</strong> Arrives within 2-3 business days with Free Courier Insurance.
          </span>
        </div>
      </div>

      {/* Coupon Application Box */}
      <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2621] mb-3 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-[#8C5338]" />
          <span>Promotions &amp; Coupons</span>
        </h4>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5EBE6] border border-[#8C5338]/30">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C5338]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Coupon `{appliedCoupon}` applied successfully</span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs font-semibold text-[#786C64] hover:text-[#B3261E] flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter Promo or Coupon Code"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white uppercase outline-none"
            />
            <button
              type="button"
              disabled={isValidatingCoupon || !couponCode.trim()}
              onClick={onApplyCoupon}
              className="px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isValidatingCoupon ? 'Checking...' : 'Apply'}
            </button>
          </div>
        )}
      </div>

      {/* Action Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBackToAddress}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786C64] hover:text-[#2D2621] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Address</span>
        </button>

        <button
          type="button"
          onClick={onProceedToPayment}
          disabled={items.length === 0}
          className="px-6 py-3 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
