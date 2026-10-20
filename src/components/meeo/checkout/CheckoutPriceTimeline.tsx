'use client';

/**
 * @file CheckoutPriceTimeline.tsx
 * @description Price breakdown timeline & savings summary for checkout right sidebar.
 */

import React from 'react';
import { ShieldCheck, Sparkles, Lock, RotateCcw, Truck } from 'lucide-react';
import { usePublicSettings } from '@/hooks/settings/usePublicSettings';

interface CheckoutPriceTimelineProps {
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  couponDiscount?: number;
  couponCode?: string | null;
  shippingFee: number;
  taxTotal: number;
  grandTotal: number;
  currency?: string;
  isValidating?: boolean;
}

export const CheckoutPriceTimeline: React.FC<CheckoutPriceTimelineProps> = ({
  itemCount,
  subtotal,
  discountTotal,
  couponDiscount = 0,
  couponCode,
  shippingFee,
  taxTotal,
  grandTotal,
  isValidating,
}) => {
  const { standardShippingFee, freeShippingThreshold } = usePublicSettings();
  const totalSavings = discountTotal + couponDiscount;

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-6 shadow-2xs sticky top-24 space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2DA]">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D2621]">
          Price Details ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
        </h3>
        {isValidating && (
          <span className="text-[10px] text-[#8C5338] animate-pulse">Calculating...</span>
        )}
      </div>

      {/* Free Delivery Banner */}
      {subtotal > 0 && (
        <div className="p-3 rounded-xl bg-[#F5EBE6] border border-[#8C5338]/20 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <div className="flex items-center gap-1.5 text-[#2E6F40] font-bold">
              <span>✓ Free Delivery Unlocked</span>
            </div>
          ) : (
            <div className="text-[#8C5338] font-semibold">
              Add ₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more to get FREE Delivery!
            </div>
          )}
        </div>
      )}

      {/* Itemized Price Breakdown */}
      <div className="space-y-3 text-xs">
        {/* 1. Subtotal */}
        <div className="flex items-center justify-between text-[#786C64]">
          <span>Total MRP</span>
          <span className="font-semibold text-[#2D2621]">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* 2. Discount on MRP */}
        {discountTotal > 0 && (
          <div className="flex items-center justify-between text-[#2E6F40]">
            <span>Discount on MRP</span>
            <span className="font-semibold">-₹{discountTotal.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* 3. Coupon Savings */}
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-[#2E6F40]">
            <span>Coupon Discount {couponCode ? `(${couponCode})` : ''}</span>
            <span className="font-semibold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* 4. Estimated Taxes (GST) */}
        <div className="flex items-center justify-between text-[#786C64]">
          <span>Estimated Taxes (GST)</span>
          <span className="font-semibold text-[#2D2621]">
            {taxTotal > 0 ? `₹${taxTotal.toLocaleString('en-IN')}` : 'Included in MRP'}
          </span>
        </div>

        {/* 5. Delivery Fee */}
        <div className="flex items-center justify-between text-[#786C64]">
          <span>Delivery Fee</span>
          {subtotal >= freeShippingThreshold || shippingFee === 0 ? (
            <span className="font-bold text-[#2E6F40] uppercase">FREE</span>
          ) : (
            <span className="font-semibold text-[#2D2621]">₹{shippingFee || standardShippingFee}</span>
          )}
        </div>

        {/* Total Payable Row */}
        <div className="pt-3.5 border-t border-[#E8E2DA] flex items-baseline justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#2D2621]">Total Amount</span>
            <span className="text-[10px] text-[#786C64]">Inclusive of all taxes</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-[#2D2621]">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Savings Callout Pill */}
      {totalSavings > 0 && (
        <div className="p-3 rounded-xl bg-[#F5EBE6] border border-[#8C5338]/30 flex items-center gap-2 text-xs font-bold text-[#8C5338]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>You are saving ₹{totalSavings.toLocaleString('en-IN')} on this order</span>
        </div>
      )}

      {/* Trust & Guarantee Badges */}
      <div className="pt-3 border-t border-[#E8E2DA] space-y-2.5 text-[11px] text-[#786C64]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8C5338] shrink-0" />
          <span>100% Genuine and authentic products</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#8C5338] shrink-0" />
          <span>Safe &amp; Secure Payments with Razorpay</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-[#8C5338] shrink-0" />
          <span>7-Day Doorstep Replacement Guarantee</span>
        </div>
      </div>
    </div>
  );
};
