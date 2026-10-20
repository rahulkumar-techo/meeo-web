'use client';

/**
 * @file page.tsx
 * @description Flipkart-style shopping cart page with complete empty-cart checkout restriction.
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePublicSettings } from '@/hooks/settings/usePublicSettings';
import { AppRoute } from '@/routes';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    summary,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { standardShippingFee, freeShippingThreshold } = usePublicSettings();

  const [promoInput, setPromoInput] = React.useState('');
  const [promoError, setPromoError] = React.useState('');

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = await applyCoupon(promoInput.trim());
    if (ok) {
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid or expired coupon code');
    }
  };

  // 1. FLIPKART-STYLE EMPTY CART STATE (Strictly restricts checkout)
  if (items.length === 0) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full mx-auto text-center bg-white rounded-3xl border border-[#E8E2DA] p-8 sm:p-12 shadow-sm">
          {/* Missing items bag icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full bg-[#FAF4F0] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#8C5338] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              0
            </div>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#FAF4F0] text-[#8C5338] text-[11px] font-bold uppercase tracking-wider mb-3">
            Your Cart is Empty
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2621] mb-2">
            Missing Cart items?
          </h2>

          <p className="text-sm text-[#786C64] mb-8 max-w-sm mx-auto leading-relaxed">
            Explore our wide range of products and discover great deals. Add items to your cart to proceed with checkout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={AppRoute.CATEGORY}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={AppRoute.WISHLIST}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#EFEAE4] border border-[#E8E2DA] text-[#2D2621] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>View Wishlist</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E2DA] flex items-center justify-center gap-6 text-[11px] text-[#786C64]">
            <span>✓ 100% Genuine Items</span>
            <span>✓ Safe & Secure</span>
            <span>✓ Easy Returns</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. FLIPKART-STYLE ACTIVE CART LAYOUT
  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Cart Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-[#786C64]">
            <Link href="/" className="hover:text-[#2D2621]">Home</Link>
            <span>/</span>
            <span className="text-[#2D2621] font-semibold">Shopping Cart</span>
          </div>

          <Link
            href={AppRoute.CATEGORY}
            className="text-xs font-semibold text-[#8C5338] hover:text-[#72422C] flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Grid: Left Items + Right Flipkart Price Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Items Card Header */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2DA] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#8C5338]" />
                <h1 className="text-base font-bold text-[#2D2621]">
                  Meeo Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h1>
              </div>
              {summary.subtotal >= freeShippingThreshold ? (
                <span className="text-xs text-[#5A6B56] font-semibold bg-[#EAF0E9] px-2.5 py-1 rounded-full">
                  ✓ Free Delivery Unlocked
                </span>
              ) : (
                <span className="text-xs text-[#8C5338] font-semibold bg-[#F5EBE6] px-2.5 py-1 rounded-full">
                  Add ₹{(freeShippingThreshold - summary.subtotal).toLocaleString('en-IN')} more to get FREE Delivery!
                </span>
              )}
            </div>

            {/* Item Rows */}
            <div className="bg-white rounded-2xl border border-[#E8E2DA] divide-y divide-[#E8E2DA] overflow-hidden shadow-xs">
              {items.map((item) => {
                const imgUrl =
                  (Array.isArray(item.product?.images) && item.product.images[0]) ||
                  (item.product as any)?.image ||
                  (item.product as any)?.thumbnail ||
                  '/assets/meeo-icon.svg';

                const unitPrice = Number(item.product?.price || 0);
                const lineTotal = unitPrice * item.quantity;
                const originalPrice = Number(item.product?.originalPrice) || unitPrice;
                const discountPct =
                  originalPrice > unitPrice
                    ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100)
                    : 0;

                return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F3EFEA] shrink-0 border border-[#E8E2DA]"
                      >
                        <img
                          src={imgUrl}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#786C64]">
                          {item.product.categoryLabel || 'Footwear & Lifestyle'}
                        </span>
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="text-sm sm:text-base font-bold text-[#2D2621] truncate hover:text-[#8C5338] transition-colors mt-0.5">
                            {item.product.name}
                          </h3>
                        </Link>

                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex items-center gap-2 text-xs text-[#786C64] mt-1">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedColor && item.selectedSize && <span>·</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2.5 mt-2">
                          <span className="text-base sm:text-lg font-bold text-[#2D2621]">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                          {originalPrice > unitPrice && (
                            <span className="text-xs text-[#786C64] line-through">
                              ₹{(originalPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="text-xs text-[#5A6B56] font-bold">
                              {discountPct}% Off
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Remove Action */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E2DA]">
                      <div className="flex items-center border border-[#E8E2DA] rounded-xl bg-[#FAF8F5] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 text-[#786C64] hover:bg-[#EFEAE4] disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#2D2621]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-[#786C64] hover:bg-[#EFEAE4] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-bold text-[#ba1a1a] hover:bg-red-50 p-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Sticky-bar with Flipkart-style PLACE ORDER Button */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2DA] flex items-center justify-between shadow-xs mt-2">
              <div>
                <span className="text-xs text-[#786C64]">Total Payable</span>
                <p className="text-xl font-bold text-[#2D2621]">
                  ₹{summary.total.toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push(AppRoute.CHECKOUT)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                <span>PLACE ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Flipkart-Style PRICE DETAILS Card */}
          <div className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
            
            <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-6 shadow-xs">
              <h2 className="text-xs uppercase tracking-wider font-bold text-[#786C64] pb-3 border-b border-[#E8E2DA]">
                PRICE DETAILS
              </h2>

              <div className="py-4 space-y-3.5 text-sm border-b border-[#E8E2DA]">
                <div className="flex items-center justify-between text-[#2D2621]">
                  <span>Price ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">₹{summary.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {summary.discount > 0 && (
                  <div className="flex items-center justify-between text-[#5A6B56]">
                    <span>Discount</span>
                    <span className="font-bold">− ₹{summary.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#2D2621]">
                  <span>Delivery Charges</span>
                  <span className="text-[#5A6B56] font-bold">
                    {summary.subtotal >= freeShippingThreshold || summary.shipping === 0 ? 'FREE' : `₹${standardShippingFee}`}
                  </span>
                </div>
              </div>

              {/* Total Amount Row */}
              <div className="pt-4 pb-2 flex items-center justify-between">
                <span className="text-base font-bold text-[#2D2621]">Total Amount</span>
                <span className="text-xl font-bold text-[#2D2621]">
                  ₹{summary.total.toLocaleString('en-IN')}
                </span>
              </div>

              {summary.discount > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#EAF0E9] text-[#5A6B56] text-xs font-bold text-center">
                  You will save ₹{summary.discount.toLocaleString('en-IN')} on this order
                </div>
              )}

              {/* Coupon Form */}
              <div className="mt-5 pt-4 border-t border-[#E8E2DA]">
                {summary.couponCode && summary.discount > 0 ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#EAF0E9] text-xs">
                    <div className="flex items-center gap-1.5 text-[#5A6B56] font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{summary.couponCode} applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-[#ba1a1a] font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter Coupon (e.g. STUDIO1000)"
                      className="flex-1 h-10 px-3.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs outline-none focus:border-[#8C5338] uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 h-10 rounded-xl bg-[#2D2621] hover:bg-black text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-[#ba1a1a] mt-1.5">{promoError}</p>}
              </div>

              {/* Security Guarantee */}
              <div className="mt-5 flex items-center gap-2.5 text-xs text-[#786C64] pt-4 border-t border-[#E8E2DA]">
                <ShieldCheck className="w-5 h-5 text-[#5A6B56] shrink-0" />
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
