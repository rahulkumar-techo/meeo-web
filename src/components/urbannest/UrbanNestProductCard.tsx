import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { UrbanNestProduct } from '@/data/urbanNestData';

interface UrbanNestProductCardProps {
  product: UrbanNestProduct;
  onQuickView?: (product: UrbanNestProduct) => void;
  onAddToCart: (product: UrbanNestProduct, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  href?: string;
}

export const UrbanNestProductCard: React.FC<UrbanNestProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  href,
}) => {
  const targetHref = href || `/product/${product.id}`;
  // Badge styling lookup
  const getBadgeClass = (variant?: 'warm' | 'neutral' | 'dark') => {
    switch (variant) {
      case 'warm':
        return 'bg-[#8C5338] text-white';
      case 'neutral':
        return 'bg-[#5A6B56] text-white';
      case 'dark':
        return 'bg-[#2D2621] text-white';
      default:
        return 'bg-[#8C5338] text-white';
    }
  };

  return (
    <Link
      href={targetHref}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E2DA] transition-all duration-300 hover:shadow-lg hover:border-[#8C5338]/30 cursor-pointer block"
    >
      {/* Product Image Stage */}
      <div className="relative w-full aspect-square bg-[#F3EFEA] overflow-hidden flex items-center justify-center p-4">
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3.5 left-3.5 z-10 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs ${getBadgeClass(
              product.badgeVariant
            )}`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-2xs ${
            isWishlisted
              ? 'bg-[#F5EBE6] text-[#C27838]'
              : 'bg-white/90 hover:bg-white text-[#786C64] hover:text-[#2D2621]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Photo */}
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Name & Category */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D2621] leading-snug group-hover:text-[#8C5338] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-[#786C64] mt-0.5 line-clamp-1 font-sans">
          {product.category}
        </p>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-base font-bold text-[#2D2621]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs line-through text-[#786C64]">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-bold text-[#8C5338] bg-[#F5EBE6] px-1.5 py-0.5 rounded-sm">
            {product.discount}
          </span>
        </div>

        {/* Rating & Compact Add to Cart Button Bar */}
        <div className="mt-4 pt-3 border-t border-[#E8E2DA]/60 flex items-center justify-between gap-2">
          {/* Star Rating */}
          <div className="flex items-center gap-1.5 text-xs text-[#786C64]">
            <Star className="w-3.5 h-3.5 fill-[#C27838] text-[#C27838]" />
            <span className="font-bold text-[#2D2621]">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>

          {/* Compact Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => onAddToCart(product, e)}
            className="w-9 h-9 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] active:scale-95 text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};
