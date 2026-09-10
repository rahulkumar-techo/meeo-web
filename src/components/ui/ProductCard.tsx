'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Plus, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { Badge } from './Badge';
import { RatingStars } from './RatingStars';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
  aspectRatio?: 'square' | 'portrait' | 'video';
  layout?: 'grid' | 'list';
  showQuickAdd?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'square',
  layout = 'grid',
  showQuickAdd = true,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added ${product.name} to bag`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(
      isFavorited
        ? `Removed ${product.name} from wishlist`
        : `Saved ${product.name} to wishlist`
    );
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[4/5]'
      : 'aspect-[4/3]';

  if (layout === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 py-3 transition-all">
        {/* Monochrome Image Background Box */}
        <Link
          href={`/product/${product.id}`}
          className="w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-[#f4f5f8] dark:bg-[#181d28] relative shrink-0 block"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.badge && (
            <div className="absolute top-2 left-2">
              <Badge variant={product.badgeType === 'drop' ? 'drop' : 'primary'} size="sm">
                {product.badge}
              </Badge>
            </div>
          )}
        </Link>

        {/* Text & Price Info without card background */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf]">
                {product.categoryLabel}
              </span>
              <RatingStars rating={product.rating} count={product.reviewCount} />
            </div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-base font-bold text-[#131b2e] dark:text-white group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] transition-colors mt-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-[#464556] dark:text-[#a6abbf] mt-1 line-clamp-2">{product.subtitle}</p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#131b2e] dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#777588] dark:text-[#a6abbf] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isFavorited
                    ? 'bg-[#ffdad2] text-[#ae3115]'
                    : 'text-[#464556] dark:text-[#a6abbf] hover:bg-[#eaedff] dark:hover:bg-[#1e273d]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-4 py-2 bg-[#412ce7] hover:bg-[#5b4dff] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col h-full transition-all duration-200">
      {/* 1. Monochromatic Background Box for Image ONLY */}
      <div className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-[#f4f5f8] dark:bg-[#181d28] mb-2.5`}>
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10 scale-90 sm:scale-100 origin-top-left">
          {product.badge && (
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-2xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
            isFavorited
              ? 'bg-red-500 text-white shadow-2xs scale-105'
              : 'bg-white/90 dark:bg-black/70 text-[#777588] hover:text-red-500 hover:bg-white shadow-2xs'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Floating Quick Action Drawer on Hover */}
        {showQuickAdd && (
          <div className="absolute bottom-2 inset-x-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-10 hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex-1 h-8 bg-white/95 hover:bg-[#412ce7] text-[#131b2e] hover:text-white backdrop-blur-md rounded-lg text-[11px] font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
            <Link
              href={`/product/${product.id}`}
              className="w-8 h-8 bg-white/95 hover:bg-[#131b2e] text-[#131b2e] hover:text-white backdrop-blur-md rounded-lg flex items-center justify-center shadow-sm transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 2. Product Information (No Card Border, No Background, Pure Clean Text) */}
      <div className="flex-1 flex flex-col justify-between px-0.5">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf] truncate">
              {product.categoryLabel}
            </span>
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>

          <Link href={`/product/${product.id}`} className="block group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] transition-colors">
            <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] dark:text-white line-clamp-1 leading-snug">
              {product.name}
            </h4>
          </Link>
          <p className="hidden sm:block text-[11px] text-[#464556] dark:text-[#a6abbf] mt-0.5 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Mobile Add CTA */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-[#131b2e] dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-[#777588] dark:text-[#a6abbf] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] hover:bg-[#412ce7] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
