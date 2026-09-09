'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    summary,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { showToast } = useToast();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyCoupon(promoInput);
    if (success) {
      showToast(`Coupon ${promoInput.toUpperCase()} applied!`);
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try STUDIO1000 or WELCOME500');
    }
  };

  const handleCheckout = () => {
    closeCartDrawer();
    router.push('/checkout');
  };

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      title="Shopping Bag"
      subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
      footer={
        items.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#464556]">Subtotal</span>
              <span className="font-bold text-[#131b2e]">
                ₹{summary.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {summary.discount > 0 && (
              <div className="flex items-center justify-between text-sm text-[#ae3115]">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Discount ({summary.couponCode})</span>
                </span>
                <span className="font-bold">-₹{summary.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#464556]">Air Priority Shipping</span>
              <span className="font-semibold text-[#131b2e]">
                {summary.shipping === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  `₹${summary.shipping}`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-[#e2e7ff] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#777588]">Estimated Total</span>
                <p className="text-xl font-extrabold text-[#131b2e]">
                  ₹{summary.total.toLocaleString('en-IN')}
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleCheckout}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Checkout
              </Button>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#eaedff] text-[#412ce7] flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-bold text-[#131b2e]">Your bag is empty</h4>
          <p className="text-xs text-[#464556] max-w-xs mt-1 mb-6">
            Discover curated architectural hardware, tactile objects, and studio essentials.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              closeCartDrawer();
              router.push('/category');
            }}
          >
            Explore Drops
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Free Shipping Progress Indicator */}
          <div className="p-3.5 rounded-xl bg-[#eaedff]/60 border border-[#dae2fd]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#131b2e] mb-1.5">
              <span>
                {summary.isFreeShippingUnlocked ? (
                  <span className="text-[#412ce7] font-bold">✓ Free Express Shipping Unlocked</span>
                ) : (
                  <>Add ₹{summary.amountNeededForFreeShipping.toLocaleString('en-IN')} for Free Express Delivery</>
                )}
              </span>
              <span>{Math.min(100, Math.round((summary.subtotal / 5000) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-[#412ce7] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (summary.subtotal / 5000) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-[#faf8ff] border border-[#e2e7ff] relative group"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-[#e2e7ff]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-[#131b2e] truncate">
                      {item.product.name}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#777588] hover:text-[#ba1a1a] p-1 rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {(item.selectedColor || item.selectedSize) && (
                    <p className="text-[11px] text-[#777588] mt-0.5">
                      {item.selectedColor} {item.selectedSize && `· ${item.selectedSize}`}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#c7c4d9] rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#464556] hover:bg-[#f2f3ff] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#131b2e]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#464556] hover:bg-[#f2f3ff] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#131b2e]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="pt-2">
            {summary.couponCode && summary.discount > 0 ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffdad2]/40 border border-[#ffdad2] text-xs">
                <div className="flex items-center gap-2 text-[#ae3115] font-semibold">
                  <Tag className="w-4 h-4" />
                  <span>Promo {summary.couponCode} applied</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-[#ae3115] font-bold hover:underline"
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
                  placeholder="Promo code (Try STUDIO1000)"
                  className="flex-1 h-9 px-3 bg-white border border-[#c7c4d9] rounded-lg text-xs outline-none focus:border-[#412ce7]"
                />
                <Button variant="secondary" size="sm" type="submit">
                  Apply
                </Button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-[#ba1a1a] mt-1">{promoError}</p>}
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#e2e7ff] flex items-center gap-2.5 text-xs text-[#464556]">
            <ShieldCheck className="w-4 h-4 text-[#412ce7] shrink-0" />
            <span>2-Year Official Hardware Warranty & 14-Day Discerning Return Policy</span>
          </div>
        </div>
      )}
    </Drawer>
  );
};
