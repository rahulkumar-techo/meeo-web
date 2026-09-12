'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import type { WishlistItem } from '@/types/wishlist/wishlist.types';

interface WishlistGridProps {
  products: (WishlistItem | any)[];
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ products }) => {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleMoveToBag = (product: any) => {
    const title = product.title || product.name || 'Product';
    const price = product.salePrice || product.basePrice || product.price || 0;
    const prodId = product.productId || product.id;

    addToCart(
      {
        id: prodId,
        slug: product.slug || prodId,
        name: title,
        subtitle: product.description || '',
        category: 'audio',
        categoryLabel: product.categoryName || 'Catalog',
        price,
        rating: 4.8,
        reviewCount: 0,
        inStock: true,
        stockCount: 10,
        description: '',
        images: [product.thumbnailUrl || product.images?.[0] || ''],
        specs: {},
        tags: [],
      },
      1
    );
    toggleWishlist(prodId);
    showToast(`Moved ${title} to your shopping bag!`);
  };

  const handleRemove = (product: any) => {
    const prodId = product.productId || product.id;
    toggleWishlist(prodId);
    showToast(`Removed from wishlist`);
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
      {products.map((product) => {
        const prodId = product.productId || product.id;
        const title = product.title || product.name || 'Catalog Item';
        const img = product.thumbnailUrl || product.images?.[0]?.url || product.images?.[0] || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300';
        const price = product.salePrice || product.basePrice || product.price || 0;

        return (
          <div
            key={prodId}
            className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#e2e7ff] shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div>
              <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#f2f3ff] mb-2.5 sm:mb-4">
                <Link href={`/product/${prodId}`}>
                  <img
                    src={img}
                    alt={title}
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
                {product.categoryName || product.categoryLabel || 'Catalog'}
              </span>
              <Link href={`/product/${prodId}`}>
                <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] hover:text-[#412ce7] transition-colors mt-0.5 truncate">
                  {title}
                </h4>
              </Link>
            </div>

            <div className="pt-2.5 sm:pt-4 mt-2 sm:mt-4 border-t border-[#f2f3ff] flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs sm:text-base font-extrabold text-[#131b2e]">
                ₹{Number(price).toLocaleString('en-IN')}
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
        );
      })}
    </div>
  );
};
