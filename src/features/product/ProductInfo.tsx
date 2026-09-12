'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Plus, Minus, ShoppingBag, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '@/types/product';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const variants = product.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v: any) => v.status === 'ACTIVE' || v.isAvailable)?.id || variants[0]?.id || ''
  );
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.size || '');
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isInWishlist(product.id);

  const currentVariant = variants.find((v: any) => v.id === selectedVariantId) || variants[0];
  const displayPrice = Number(currentVariant?.price ?? product.price ?? 0);
  const displayOrigCandidate = currentVariant?.compareAtPrice
    ? Number(currentVariant.compareAtPrice)
    : product.originalPrice;
  const displayOriginalPrice =
    displayOrigCandidate !== undefined && displayOrigCandidate > displayPrice
      ? displayOrigCandidate
      : undefined;

  const handleAddToCart = () => {
    const variantTitle = currentVariant?.title || currentVariant?.sku;
    addToCart(product, quantity, selectedColor || variantTitle, selectedSize);
    showToast(`Added ${quantity}x ${product.name} to bag`);
  };

  const handleBuyNow = () => {
    const variantTitle = currentVariant?.title || currentVariant?.sku;
    addToCart(product, quantity, selectedColor || variantTitle, selectedSize);
    router.push('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    showToast(isFavorited ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category & Rating Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#777588]">
            {product.categoryLabel}
          </span>
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#131b2e] tracking-tight leading-tight">
          {product.name}
          <span className="text-[#fd6a49]">.</span>
        </h1>

        <p className="text-sm text-[#464556] mt-2 leading-relaxed">{product.subtitle}</p>
      </div>

      {/* Pricing Lockup */}
      <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-[#131b2e]">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {displayOriginalPrice ? (
              <span className="text-base text-[#777588] line-through">
                ₹{displayOriginalPrice.toLocaleString('en-IN')}
              </span>
            ) : null}
          </div>
          <span className="text-xs text-[#777588]">Inclusive of all taxes · Free Priority Air Delivery</span>
        </div>

        {displayOriginalPrice && displayOriginalPrice > displayPrice && (
          <span className="px-3 py-1.5 rounded-xl bg-[#ffdad2] text-[#ae3115] text-xs font-bold">
            Save {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Product Variants Matrix Selector (Storage / Edition / Sku) */}
      {variants.length > 1 && (
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#777588] mb-2.5">
            <span>Edition / Configuration:</span>
            <span className="text-[#131b2e] font-semibold">
              {currentVariant?.title || currentVariant?.sku || 'Default'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v: any) => {
              const isSelected = v.id === selectedVariantId;
              const isAvailable = v.status === 'ACTIVE' || v.isAvailable !== false;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#412ce7] bg-[#eaedff] text-[#412ce7] shadow-xs'
                      : !isAvailable
                      ? 'opacity-40 border-[#e2e7ff] line-through cursor-not-allowed bg-[#f2f3ff]'
                      : 'border-[#e2e7ff] hover:border-[#c7c4d9] text-[#131b2e] bg-white'
                  }`}
                >
                  <span>{v.title || v.sku || `Variant ${v.id.slice(0, 6)}`}</span>
                  <span className="ml-1.5 text-[11px] opacity-80">
                    ₹{Number(v.price ?? 0).toLocaleString('en-IN')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colorway Selector */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#777588] mb-2.5">
            <span>Colorway:</span>
            <span className="text-[#131b2e] font-semibold">{selectedColor}</span>
          </div>
          <div className="flex items-center gap-3">
            {product.colors.map((col) => {
              const isSelected = selectedColor === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColor(col.name)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-[#412ce7] bg-[#eaedff] text-[#412ce7] shadow-xs'
                      : 'border-[#e2e7ff] hover:border-[#c7c4d9] text-[#464556]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#777588] mb-2.5">
            <span>Select Size:</span>
            <span className="text-[#412ce7] font-semibold cursor-pointer hover:underline">
              Size Guide
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.sizes.map((s) => {
              const isSelected = selectedSize === s.size;
              return (
                <button
                  key={s.size}
                  type="button"
                  disabled={!s.inStock}
                  onClick={() => setSelectedSize(s.size)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    !s.inStock
                      ? 'opacity-40 border-[#e2e7ff] line-through cursor-not-allowed bg-[#f2f3ff]'
                      : isSelected
                      ? 'bg-[#412ce7] text-white border-[#412ce7] shadow-sm'
                      : 'bg-white border-[#e2e7ff] text-[#131b2e] hover:border-[#412ce7]'
                  }`}
                >
                  {s.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & CTA Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#c7c4d9] rounded-xl bg-white h-12 px-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 text-[#464556] hover:text-[#131b2e]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#131b2e]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 text-[#464556] hover:text-[#131b2e]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Bag */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="flex-1"
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Add to Bag
          </Button>

          {/* Wishlist Toggle Button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Wishlist"
            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
              isFavorited
                ? 'bg-[#ffdad2] border-[#ffdad2] text-[#ae3115]'
                : 'border-[#c7c4d9] hover:bg-[#f2f3ff] text-[#464556]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Buy Now / Instant Checkout */}
        <Button
          variant="coral"
          size="lg"
          onClick={handleBuyNow}
          leftIcon={<Zap className="w-4 h-4" />}
        >
          Instant Checkout · Free Delivery
        </Button>
      </div>

      {/* Trust Strip */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#e2e7ff] text-center">
        <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex flex-col items-center">
          <Truck className="w-4 h-4 text-[#412ce7] mb-1" />
          <span className="text-[10px] font-bold text-[#131b2e]">Priority Air</span>
          <span className="text-[9px] text-[#777588]">Free on all orders</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex flex-col items-center">
          <ShieldCheck className="w-4 h-4 text-[#412ce7] mb-1" />
          <span className="text-[10px] font-bold text-[#131b2e]">2-Yr Coverage</span>
          <span className="text-[9px] text-[#777588]">Factory warranty</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex flex-col items-center">
          <RotateCcw className="w-4 h-4 text-[#412ce7] mb-1" />
          <span className="text-[10px] font-bold text-[#131b2e]">14-Day Trial</span>
          <span className="text-[9px] text-[#777588]">Discerning returns</span>
        </div>
      </div>
    </div>
  );
};
