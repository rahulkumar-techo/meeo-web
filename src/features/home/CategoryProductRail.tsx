'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface CategoryProductRailProps {
  title: string;
  subtitle?: string;
  viewAllHref: string;
  badge?: string;
  products: Product[];
}

export const CategoryProductRail: React.FC<CategoryProductRailProps> = ({
  title,
  subtitle,
  viewAllHref,
  badge,
  products,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  return (
    <section className="w-full max-w-[84rem] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
      {/* Fully Responsive Section Header */}
      <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 pb-2.5 sm:pb-3 border-b border-[#e2e7ff] dark:border-[#28334d]">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-[#131b2e] dark:text-white tracking-tight leading-snug">
              {title}
            </h2>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-[#777588] dark:text-[#a6abbf] mt-0.5 line-clamp-1 sm:line-clamp-none font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          href={viewAllHref}
          className="h-7 sm:h-8 px-2.5 sm:px-3.5 rounded-lg bg-[#412ce7] hover:bg-[#5b4dff] text-white font-bold text-[10px] sm:text-xs flex items-center gap-1 transition-all shadow-2xs shrink-0 active:scale-95"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Borderless Product Grid with Monochrome Image Backgrounds */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 pt-3.5 sm:pt-4">
        {products.map((product) => {
          const isFav = isInWishlist(product.id);
          const discountPercent = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between transition-all"
            >
              {/* Monochrome Image Background Box */}
              <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#f4f5f8] dark:bg-[#181d28] mb-1.5 sm:mb-2">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {discountPercent > 0 && (
                  <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-2xs">
                    {discountPercent}% OFF
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                    showToast(isFav ? `Removed from wishlist` : `Added to wishlist`);
                  }}
                  className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                    isFav
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 dark:bg-black/70 text-[#777588] hover:text-red-500'
                  } shadow-2xs cursor-pointer`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Info (No Card Background) */}
              <div className="flex flex-col flex-1 justify-between px-0.5">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf] truncate">
                      {product.categoryLabel}
                    </span>
                    <div className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[8px] sm:text-[9px] font-extrabold shrink-0">
                      <span>{product.rating}</span>
                      <Star className="w-2 h-2 fill-current" />
                    </div>
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs sm:text-sm font-bold text-[#131b2e] dark:text-white group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] line-clamp-1 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Pricing & Add to Bag */}
                <div className="mt-1 sm:mt-1.5 pt-1">
                  <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm md:text-base font-black text-[#131b2e] dark:text-white">
                      ₹{Number(product.price ?? 0).toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice ? (
                      <span className="text-[9px] sm:text-[10px] text-[#777588] dark:text-[#a6abbf] line-through">
                        ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] sm:text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                      In Stock ({product.stockCount})
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                        showToast(`Added ${product.name} to bag`);
                      }}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] hover:bg-[#412ce7] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
