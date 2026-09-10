'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface DealsOfTheDayProps {
  products: Product[];
}

export const DealsOfTheDay: React.FC<DealsOfTheDayProps> = ({ products }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <section className="w-full max-w-[84rem] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
      {/* Responsive Section Header */}
      <div className="flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 pb-2.5 sm:pb-3 border-b border-[#e2e7ff] dark:border-[#28334d]">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </div>
              <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-[#131b2e] dark:text-white tracking-tight leading-snug">
                Deals of the Day
              </h2>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md sm:rounded-lg border border-[#e2e7ff] dark:border-[#28334d] text-[10px] sm:text-xs font-bold text-[#464556] dark:text-[#a6abbf] shrink-0">
              <Clock className="w-3 h-3 text-[#fd6a49]" />
              <span className="font-mono text-[#412ce7] dark:text-[#685aff]">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                {String(timeLeft.seconds).padStart(2, '0')}s Left
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/category?deals=true"
          className="h-7 sm:h-8 px-2.5 sm:px-3.5 rounded-lg bg-[#412ce7] hover:bg-[#5b4dff] text-white font-bold text-[10px] sm:text-xs flex items-center gap-1 transition-all shadow-2xs shrink-0 active:scale-95"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 pt-3.5 sm:pt-4">
        {dealProducts.slice(0, 6).map((product) => {
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
                    src={product.images[0]}
                    alt={product.name}
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

              {/* Typography */}
              <div className="flex flex-col flex-1 justify-between px-0.5">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf] truncate">
                    {product.categoryLabel}
                  </span>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs sm:text-sm font-bold text-[#131b2e] dark:text-white group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] line-clamp-1 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Pricing & Add */}
                <div className="mt-1 sm:mt-1.5 pt-1">
                  <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm md:text-base font-black text-[#131b2e] dark:text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[9px] sm:text-[10px] text-[#777588] dark:text-[#a6abbf] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      Free Delivery
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                        showToast(`Added ${product.name} to bag`);
                      }}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] hover:bg-[#412ce7] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Quick Add to Bag"
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
