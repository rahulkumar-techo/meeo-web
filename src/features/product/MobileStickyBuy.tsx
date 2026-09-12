'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface MobileStickyBuyProps {
  product: Product;
}

export const MobileStickyBuy: React.FC<MobileStickyBuyProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isVisible } = useScrollDirection();

  const handleAdd = () => {
    addToCart(product, 1);
    showToast(`Added ${product.name} to bag`);
  };

  return (
    <div
      className={`md:hidden fixed inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-[#e2e7ff] p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
        isVisible ? 'bottom-14' : 'bottom-0'
      }`}
    >
      <div>
        <span className="text-[10px] text-[#777588] uppercase font-bold block">Total Price</span>
        <span className="text-base font-extrabold text-[#131b2e]">
          ₹{Number(product.price ?? 0).toLocaleString('en-IN')}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
        >
          Add to Bag
        </Button>
      </div>
    </div>
  );
};
