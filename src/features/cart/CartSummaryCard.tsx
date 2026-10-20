'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartSummary } from '@/types/cart';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { usePublicSettings } from '@/hooks/settings/usePublicSettings';

interface CartSummaryCardProps {
  summary: CartSummary;
  onApplyCoupon: (code: string) => boolean | Promise<boolean>;
  onRemoveCoupon: () => void;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  summary,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const { showToast } = useToast();
  const { standardShippingFee, freeShippingThreshold } = usePublicSettings();
  const [couponInput, setCouponInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await onApplyCoupon(couponInput);
    if (ok) {
      showToast(`Promo ${couponInput.toUpperCase()} successfully applied!`);
      setCouponInput('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid or expired coupon code');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6 sticky top-32">
      <h3 className="text-base font-bold text-[#131b2e] pb-3 border-b border-[#e2e7ff]">
        Order Summary
      </h3>

      {/* Free Delivery Banner */}
      <div className="p-3.5 rounded-2xl bg-[#eaedff]/60 border border-[#dae2fd]">
        <div className="flex items-center justify-between text-xs font-semibold text-[#131b2e] mb-1.5">
          <span>
            {summary.subtotal >= freeShippingThreshold ? (
              <span className="text-[#412ce7] font-bold">✓ Free Delivery Unlocked</span>
            ) : (
              <>Add ₹{(freeShippingThreshold - summary.subtotal).toLocaleString('en-IN')} more to get FREE Delivery!</>
            )}
          </span>
          <span>{Math.min(100, Math.round((summary.subtotal / freeShippingThreshold) * 100))}%</span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-[#412ce7] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (summary.subtotal / freeShippingThreshold) * 100)}%` }}
          />
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-[#464556]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#131b2e]">
            ₹{summary.subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        {summary.discount > 0 && (
          <div className="flex items-center justify-between text-[#ae3115]">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Discount ({summary.couponCode})</span>
            </span>
            <span className="font-bold">-₹{summary.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[#464556]">
          <span>Delivery Fee</span>
          <span className="font-semibold text-[#131b2e]">
            {summary.subtotal >= freeShippingThreshold || summary.shipping === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              `₹${standardShippingFee}`
            )}
          </span>
        </div>

        <div className="pt-4 border-t border-[#e2e7ff] flex items-center justify-between">
          <span className="text-sm font-bold text-[#131b2e]">Total (incl. GST)</span>
          <span className="text-2xl font-extrabold text-[#412ce7]">
            ₹{summary.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Coupon Application Box */}
      <div className="pt-2">
        {summary.couponCode && summary.discount > 0 ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffdad2]/40 border border-[#ffdad2] text-xs">
            <span className="text-[#ae3115] font-semibold">Promo {summary.couponCode} applied</span>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-[#ae3115] font-bold hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Promo code (STUDIO1000)"
              className="flex-1 h-10 px-3 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-xs outline-none focus:border-[#412ce7]"
            />
            <Button variant="secondary" size="md" type="submit">
              Apply
            </Button>
          </form>
        )}
        {errorMsg && <p className="text-xs text-[#ba1a1a] mt-1">{errorMsg}</p>}
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Secure Checkout
        </Button>
      </Link>

      <div className="flex items-center justify-center gap-4 text-[11px] text-[#777588]">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#412ce7]" />
          <span>256-Bit SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-[#412ce7]" />
          <span>BlueDart Priority</span>
        </div>
      </div>
    </div>
  );
};
