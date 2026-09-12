'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { EmptyState } from '@/components/ui/EmptyState';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your Shopping Bag is Currently Empty"
        description="Explore our latest editorial drop or curated architectural collections to begin."
        actionLabel="Explore Catalog"
        actionHref="/category"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e2e7ff] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Thumbnail & Title */}
          <div className="flex items-center gap-4">
            <Link
              href={`/product/${item.product.id}`}
              className="w-20 h-20 rounded-xl overflow-hidden bg-[#f2f3ff] shrink-0 border border-[#e2e7ff]"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </Link>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777588]">
                {item.product.categoryLabel}
              </span>
              <Link href={`/product/${item.product.id}`}>
                <h4 className="text-sm font-bold text-[#131b2e] hover:text-[#412ce7] transition-colors mt-0.5">
                  {item.product.name}
                </h4>
              </Link>
              {(item.selectedColor || item.selectedSize) && (
                <p className="text-xs text-[#464556] mt-0.5">
                  {item.selectedColor} {item.selectedSize && `· ${item.selectedSize}`}
                </p>
              )}
              <span className="text-xs font-bold text-[#412ce7] block mt-1 sm:hidden">
                ₹{Number(item.product.price || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quantity Controls & Price */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f2f3ff]">
            {/* Counter */}
            <div className="flex items-center border border-[#c7c4d9] rounded-xl bg-[#faf8ff] h-10 px-1">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="p-1.5 text-[#464556] hover:text-[#131b2e]"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-[#131b2e]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1.5 text-[#464556] hover:text-[#131b2e]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Price */}
            <div className="text-right hidden sm:block min-w-[80px]">
              <span className="text-sm font-extrabold text-[#131b2e] block">
                ₹{(Number(item.product.price || 0) * item.quantity).toLocaleString('en-IN')}
              </span>
              {item.quantity > 1 && (
                <span className="text-[10px] text-[#777588]">
                  ₹{Number(item.product.price || 0).toLocaleString('en-IN')} each
                </span>
              )}
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-[#777588] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors"
              title="Remove Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
