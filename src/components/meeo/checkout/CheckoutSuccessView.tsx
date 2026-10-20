'use client';

/**
 * @file CheckoutSuccessView.tsx
 * @description Step 4: Celebratory order confirmation and tracking preview.
 */

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { AppRoute } from '@/routes';
import type { SavedAddress } from '@/types/user/user.types';

interface CheckoutSuccessViewProps {
  order: any;
  selectedAddress: SavedAddress | null;
}

export const CheckoutSuccessView: React.FC<CheckoutSuccessViewProps> = ({
  order,
  selectedAddress,
}) => {
  const orderNumber = order?.orderNumber || order?.id || 'ORD-20261014-9842';
  const grandTotal =
    order?.financials?.grandTotal ||
    order?.totalAmount ||
    order?.grandTotal ||
    0;

  const isCod = order?.paymentMethod === 'COD';
  const isDelivered = order?.status === 'DELIVERED';
  const isPaid = order?.paymentStatus === 'PAID' || isDelivered;

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 text-center animate-in fade-in duration-300">
      {/* Success Animated Badge */}
      <div className="w-20 h-20 rounded-full bg-[#2E6F40] text-white mx-auto flex items-center justify-center shadow-lg mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-[#8C5338] mb-2 block">
        Order Placed Successfully
      </span>

      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2621] mb-3">
        Thank you for your order!
      </h1>

      <p className="text-sm text-[#786C64] max-w-md mx-auto mb-8">
        We have received your order and our logistics team has started preparing your package for dispatch.
      </p>

      {/* Order Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 sm:p-7 shadow-2xs text-left mb-8 space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2DA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#786C64] block">
              Order Reference
            </span>
            <span className="text-sm sm:text-base font-bold text-[#2D2621]">
              {orderNumber}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full font-bold text-xs ${
              isPaid
                ? 'bg-emerald-50 text-[#2E6F40] border border-emerald-200'
                : isCod
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-[#F5EBE6] text-[#8C5338]'
            }`}
          >
            {isPaid
              ? 'Paid · Confirmed'
              : isCod
              ? 'Confirmed · To be collected on delivery'
              : 'Confirmed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-[#8C5338] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2D2621] block">Estimated Arrival</span>
              <span className="text-[#786C64]">2 - 3 Business Days</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-[#8C5338] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2D2621] block">Payment Method</span>
              <span className="text-[#786C64]">
                {isCod ? 'Cash on Delivery' : 'Online (Razorpay)'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#8C5338] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2D2621] block">Payment Status</span>
              <span
                className={
                  isPaid
                    ? 'text-[#2E6F40] font-bold'
                    : isCod
                    ? 'text-amber-800 font-semibold'
                    : 'text-[#8C5338] font-semibold'
                }
              >
                {isPaid
                  ? 'Paid'
                  : isCod
                  ? 'To be collected on delivery'
                  : order?.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {selectedAddress && (
          <div className="pt-3 border-t border-[#E8E2DA] flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-[#8C5338] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#2D2621] block">
                Shipping to {selectedAddress.recipientName} ({selectedAddress.phone})
              </span>
              <span className="text-[#786C64]">
                {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} -{' '}
                {selectedAddress.postalCode}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={AppRoute.ACCOUNT}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Orders in Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href={AppRoute.CATEGORY}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E8E2DA] text-[#2D2621] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#8C5338]" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};
