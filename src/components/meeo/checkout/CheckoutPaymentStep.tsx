'use client';

/**
 * @file CheckoutPaymentStep.tsx
 * @description Step 3 of Checkout: Select payment gateway (Razorpay Online vs Cash on Delivery)
 * with order notes, security guarantees, and execution handlers.
 */

import React from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Check,
  Sparkles,
  AlertCircle,
  RotateCw,
} from 'lucide-react';

interface CheckoutPaymentStepProps {
  paymentMethod: 'UPI' | 'COD';
  onSelectPaymentMethod: (pm: 'UPI' | 'COD') => void;
  orderNotes: string;
  onOrderNotesChange: (notes: string) => void;
  onBackToReview: () => void;
  onPlaceOrder: () => Promise<void>;
  isProcessing: boolean;
  grandTotal: number;
  paymentFailed?: boolean;
  paymentError?: string;
  isRetryingPayment?: boolean;
  onRetryPayment?: () => Promise<void>;
}

export const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
  paymentMethod,
  onSelectPaymentMethod,
  orderNotes,
  onOrderNotesChange,
  onBackToReview,
  onPlaceOrder,
  isProcessing,
  grandTotal,
  paymentFailed = false,
  paymentError = '',
  isRetryingPayment = false,
  onRetryPayment,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Payment Failure & Retry Card */}
      {paymentFailed && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{paymentError || 'Payment Failed. Try Again'}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/70 text-amber-900">
              Order Preserved
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Payment was cancelled or could not be completed. Your order remains active and you can retry immediately or choose Cash on Delivery.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              disabled={isRetryingPayment || isProcessing}
              onClick={onRetryPayment}
              className="px-4 py-2 rounded-xl bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRetryingPayment ? 'animate-spin' : ''}`} />
              <span>{isRetryingPayment ? 'Retrying...' : 'Retry Payment'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPaymentMethod('COD')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 text-xs font-semibold transition-all cursor-pointer"
            >
              Switch to Cash on Delivery (COD)
            </button>
          </div>
        </div>
      )}

      {/* Payment Gateway Options Card */}
      <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-7 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2DA] mb-5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-[#8C5338]" />
            <h3 className="text-base font-bold text-[#2D2621]">
              Select Payment Method
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#2E6F40] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit Secure Gateway</span>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Option 1: Razorpay Online (UPI, Cards, NetBanking) */}
          <div
            onClick={() => onSelectPaymentMethod('UPI')}
            className={`p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
              paymentMethod === 'UPI'
                ? 'border-[#8C5338] bg-[#FAF8F5] shadow-xs'
                : 'border-[#E8E2DA] bg-white hover:border-[#8C5338]/40 hover:bg-[#FAF8F5]/40'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="mt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    paymentMethod === 'UPI'
                      ? 'border-[#8C5338] bg-[#8C5338]'
                      : 'border-[#786C64] bg-white'
                  }`}
                >
                  {paymentMethod === 'UPI' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-[#2D2621]">
                    Online Payment (Razorpay)
                  </span>
                  <span className="text-[10px] font-bold text-[#8C5338] bg-[#F5EBE6] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-[#786C64] leading-relaxed mb-2">
                  Instant UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards &amp; NetBanking.
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#786C64]">
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E8E2DA] font-semibold text-[#2D2621]">
                    UPI / QR
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E8E2DA] font-semibold text-[#2D2621]">
                    Visa / Mastercard
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E8E2DA] font-semibold text-[#2D2621]">
                    NetBanking
                  </span>
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338] shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
          </div>

          {/* Option 2: Cash on Delivery (COD) */}
          <div
            onClick={() => onSelectPaymentMethod('COD')}
            className={`p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
              paymentMethod === 'COD'
                ? 'border-[#8C5338] bg-[#FAF8F5] shadow-xs'
                : 'border-[#E8E2DA] bg-white hover:border-[#8C5338]/40 hover:bg-[#FAF8F5]/40'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="mt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    paymentMethod === 'COD'
                      ? 'border-[#8C5338] bg-[#8C5338]'
                      : 'border-[#786C64] bg-white'
                  }`}
                >
                  {paymentMethod === 'COD' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-[#2D2621]">
                    Cash on Delivery (COD)
                  </span>
                </div>
                <p className="text-xs text-[#786C64] leading-relaxed">
                  Pay with cash or UPI at your doorstep upon receiving your package.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338] shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Optional Delivery Instructions */}
      <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 shadow-2xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-2">
          Delivery Instructions &amp; Notes (Optional)
        </label>
        <textarea
          rows={2}
          value={orderNotes}
          onChange={(e) => onOrderNotesChange(e.target.value)}
          placeholder="e.g. Leave package with the security desk or ring the second bell..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none resize-none"
        />
      </div>

      {/* Action Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBackToReview}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786C64] hover:text-[#2D2621] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order Review</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onPlaceOrder}
          className="px-8 py-3.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] active:bg-[#573120] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : paymentMethod === 'COD' ? (
            <Check className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          <span>
            {isProcessing
              ? 'Processing...'
              : paymentMethod === 'COD'
              ? `Place Order (COD) · ₹${grandTotal.toLocaleString('en-IN')}`
              : `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay`}
          </span>
        </button>
      </div>
    </div>
  );
};
