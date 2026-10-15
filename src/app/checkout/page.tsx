import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CheckoutView } from '@/components/urbannest/checkout/CheckoutView';

export const metadata: Metadata = {
  title: 'Secure Checkout · Meeo Store | UrbanNest',
  description:
    'Complete your order with verified delivery address, live coupon discounts, and secure Razorpay or Cash on Delivery payment.',
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#FAF8F5]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#786C64]">Preparing Secure Checkout...</span>
          </div>
        </div>
      }
    >
      <CheckoutView />
    </Suspense>
  );
}
