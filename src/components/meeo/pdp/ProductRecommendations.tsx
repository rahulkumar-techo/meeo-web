'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { MeeoProductDetail } from '@/data/meeoProductDetails';
import { useToast } from '@/context/ToastContext';

interface ProductRecommendationsProps {
  recommended?: MeeoProductDetail['recommended'];
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  recommended = [],
}) => {
  const { showToast } = useToast();
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set());

  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed item from your wishlist');
      } else {
        next.add(id);
        showToast('Saved item to your wishlist');
      }
      return next;
    });
  };

  if (!recommended || recommended.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-10 pb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2621] font-normal tracking-tight">
          You Might Also Like
        </h2>

        <div className="flex items-center gap-4">
          <Link
            href="/category"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C5338] hover:text-[#6E3F29] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-[#E8E2DA] bg-white hover:bg-[#F3EFEA] text-[#2D2621] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Previous recommended products"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-[#E8E2DA] bg-white hover:bg-[#F3EFEA] text-[#2D2621] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              aria-label="Next recommended products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {recommended.map((item) => {
          const isWishlisted = wishlistSet.has(item.id);

          return (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E2DA] transition-all duration-300 hover:shadow-lg hover:border-[#8C5338]/30"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square bg-[#F3EFEA] overflow-hidden flex items-center justify-center p-4">
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(item.id, e)}
                  className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-2xs ${
                    isWishlisted
                      ? 'bg-[#F5EBE6] text-[#C27838]'
                      : 'bg-white/90 hover:bg-white text-[#786C64] hover:text-[#2D2621]'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 sm:p-4 flex flex-col flex-1 bg-white">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D2621] leading-snug group-hover:text-[#8C5338] transition-colors line-clamp-1">
                  {item.name}
                </h3>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm sm:text-base font-bold text-[#2D2621]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#786C64]">
                  <Star className="w-3 h-3 fill-[#C27838] text-[#C27838]" />
                  <span className="font-bold text-[#2D2621]">{item.rating}</span>
                  <span>({item.reviewCount})</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
