'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="group relative bg-[#ffffff] border border-[#e2e7ff] hover:border-[#412ce7]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 shadow-[0_1px_4px_rgba(19,27,46,0.03)] hover:shadow-md transition-all">
        <Link
          href={`/product/${product.id}`}
          className="w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-[#f2f3ff] relative shrink-0 block"
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

        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777588]">
                {product.categoryLabel}
              </span>
              <RatingStars rating={product.rating} count={product.reviewCount} />
            </div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-base font-bold text-[#131b2e] group-hover:text-[#412ce7] transition-colors mt-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-[#464556] mt-1 line-clamp-2">{product.subtitle}</p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f2f3ff]">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#131b2e]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#777588] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-2 rounded-xl transition-colors ${
                  isFavorited
                    ? 'bg-[#ffdad2] text-[#ae3115]'
                    : 'bg-[#f2f3ff] text-[#464556] hover:bg-[#eaedff]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-4 py-2 bg-[#412ce7] hover:bg-[#5b4dff] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
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
    <div className="group relative bg-[#ffffff] rounded-2xl border border-[#e2e7ff] hover:border-[#412ce7]/30 overflow-hidden shadow-[0_1px_4px_rgba(19,27,46,0.03)] hover:shadow-[0_8px_24px_rgba(65,44,231,0.08)] transition-all duration-300 flex flex-col h-full">
      {/* Image Showcase Container */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-[#f2f3ff]`}>
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 pointer-events-none z-10 scale-90 sm:scale-100 origin-top-left">
          {product.badge && (
            <Badge
              variant={product.badgeType === 'drop' ? 'drop' : product.badgeType === 'award' ? 'coral' : 'primary'}
              size="sm"
            >
              {product.badge}
            </Badge>
          )}
          {product.stockCount <= 8 && product.stockCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
              Only {product.stockCount} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-white text-[#ae3115] shadow-md scale-105'
              : 'bg-white/80 backdrop-blur-md text-[#464556] hover:bg-white hover:text-[#131b2e] opacity-90 group-hover:opacity-100 shadow-sm'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-[#fd6a49] text-[#fd6a49]' : ''}`} />
        </button>

        {/* Floating Quick Action Drawer on Hover */}
        {showQuickAdd && (
          <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2.5 sm:inset-x-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-10 hidden sm:flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex-1 h-8 sm:h-9 bg-white/95 hover:bg-[#412ce7] text-[#131b2e] hover:text-white backdrop-blur-md rounded-xl text-[11px] sm:text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
            <Link
              href={`/product/${product.id}`}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/95 hover:bg-[#131b2e] text-[#131b2e] hover:text-white backdrop-blur-md rounded-xl flex items-center justify-center shadow-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Product Information Lockup */}
      <div className="p-2.5 sm:p-3.5 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-1">
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#777588] truncate">
              {product.categoryLabel}
            </span>
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>

          <Link href={`/product/${product.id}`} className="block group-hover:text-[#412ce7] transition-colors">
            <h4 className="text-xs sm:text-sm md:text-base font-bold text-[#131b2e] line-clamp-1 leading-snug">
              {product.name}
            </h4>
          </Link>
          <p className="hidden sm:block text-[10px] sm:text-xs text-[#464556] mt-0.5 sm:mt-1 line-clamp-1 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Mobile Add CTA */}
        <div className="flex items-center justify-between mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 border-t border-[#f2f3ff]">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#131b2e]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] sm:text-[10px] md:text-[11px] text-[#777588] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-[#ae3115] font-bold">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Quick Add icon for mobile viewports */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            className="sm:hidden w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#eaedff] text-[#412ce7] hover:bg-[#412ce7] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
