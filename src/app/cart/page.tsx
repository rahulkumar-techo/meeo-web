'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartItemList } from '@/features/cart/CartItemList';
import { CartSummaryCard } from '@/features/cart/CartSummaryCard';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    items,
    summary,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Header Bar */}
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-6">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Studio Bag Review</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Your Shopping Bag<span className="text-[#fd6a49]">.</span>
            </h1>
          </div>

          <Link
            href="/category"
            className="text-xs text-[#412ce7] font-bold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </section>

      {/* Main Grid: Items (8 cols) + Summary Card (4 cols) */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <CartItemList
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
            />
          </div>

          {items.length > 0 && (
            <div className="lg:col-span-4">
              <CartSummaryCard
                summary={summary}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
