'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface WishlistGridProps {
  products: Product[];
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ products }) => {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleMoveToBag = (product: Product) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
    showToast(`Moved ${product.name} to your shopping bag!`);
  };

  const handleRemove = (product: Product) => {
    toggleWishlist(product.id);
    showToast(`Removed ${product.name} from wishlist`);
  };

  if (products.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<Heart className="w-8 h-8 stroke-[1.5]" />}
          title="Your Curated Wishboard is Empty"
          description="Save quiet desk objects, calibrated audio lab hardware, and minimalist footwear to monitor inventory and price movements."
          actionLabel="Explore Catalog"
          actionHref="/category"
        />
      </div>
    );
  }

  return (
    <div className="py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#e2e7ff] shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
        >
          <div>
            <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#f2f3ff] mb-2.5 sm:mb-4">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <button
                type="button"
                onClick={() => handleRemove(product)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 text-[#ba1a1a] flex items-center justify-center hover:bg-white shadow-sm transition-colors cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#777588]">
              {product.categoryLabel}
            </span>
            <Link href={`/product/${product.id}`}>
              <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] hover:text-[#412ce7] transition-colors mt-0.5 truncate">
                {product.name}
              </h4>
            </Link>
            <p className="hidden sm:block text-xs text-[#464556] mt-1 line-clamp-1">{product.subtitle}</p>
          </div>

          <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-4 border-t border-[#f2f3ff] flex items-center justify-between gap-2 sm:gap-4">
            <span className="text-xs sm:text-base font-extrabold text-[#131b2e]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleMoveToBag(product)}
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Move to Bag</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
