'use client';

import React from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { CartItem, CartSummary } from '@/types/cart';
import { Button } from '@/components/ui/Button';

interface CheckoutOrderReviewProps {
  items: CartItem[];
  summary: CartSummary;
  isProcessing: boolean;
  onPlaceOrder: () => void;
}

export const CheckoutOrderReview: React.FC<CheckoutOrderReviewProps> = ({
  items,
  summary,
  isProcessing,
  onPlaceOrder,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6 sticky top-32">
      <h3 className="text-base font-bold text-[#131b2e] pb-3 border-b border-[#e2e7ff]">
        Items in Order ({items.length})
      </h3>

      {/* Item List Compact */}
      <div className="flex flex-col gap-3 max-h-56 overflow-y-auto no-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-12 h-12 rounded-xl object-cover bg-[#f2f3ff] border border-[#e2e7ff] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-[#131b2e] truncate">{item.product.name}</h5>
              <p className="text-[11px] text-[#777588]">
                Qty: {item.quantity} {item.selectedSize && `· ${item.selectedSize}`}
              </p>
            </div>
            <span className="text-xs font-bold text-[#131b2e]">
              ₹{(Number(item.product.price || 0) * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-[#e2e7ff] text-xs">
        <div className="flex items-center justify-between text-[#464556]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#131b2e]">₹{summary.subtotal.toLocaleString('en-IN')}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex items-center justify-between text-[#ae3115]">
            <span>Promotional Credit ({summary.couponCode})</span>
            <span className="font-bold">-₹{summary.discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[#464556]">
          <span>Air Priority Courier</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>
        <div className="pt-3 border-t border-[#e2e7ff] flex items-center justify-between">
          <span className="text-sm font-bold text-[#131b2e]">Final Charge</span>
          <span className="text-2xl font-extrabold text-[#412ce7]">
            ₹{summary.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Authorize Button */}
      <Button
        variant="primary"
        size="lg"
        isLoading={isProcessing}
        onClick={onPlaceOrder}
        leftIcon={<Lock className="w-4 h-4" />}
        className="w-full"
      >
        Authorize & Place Order
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#777588]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#412ce7]" />
        <span>Backed by 14-Day Discerning Return Policy</span>
      </div>
    </div>
  );
};
