'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { UrbanNestProduct } from '@/data/urbanNestData';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ProductQuickViewModalProps {
  product: UrbanNestProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { addToCart, openCartDrawer } = useCart();
  const { showToast } = useToast();

  const [selectedSize, setSelectedSize] = useState('UK 9');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[2] || product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(
        {
          id: product.id,
          slug: product.id,
          name: product.name,
          subtitle: product.category,
          category: 'footwear',
          categoryLabel: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviewCount: parseInt(product.reviewCount) || 500,
          inStock: product.inStock,
          stockCount: 15,
          description: product.description || '',
          images: [product.image],
          specs: { Size: selectedSize, Color: selectedColor },
          tags: ['sneakers', 'lifestyle'],
        },
        quantity,
        selectedColor,
        selectedSize
      );
      showToast(`Added ${quantity} × ${product.name} (${selectedSize}) to bag`);
      openCartDrawer();
      onClose();
    } catch {
      showToast('Could not add to bag. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-urban-fadeInUp"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2DA] flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#2D2621] flex items-center justify-center shadow-xs border border-[#E8E2DA] transition-all cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Visual Column */}
        <div className="w-full md:w-1/2 relative bg-[#F3EFEA] min-h-[300px] md:min-h-[460px] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E8E2DA]">
          <div className="relative w-full aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
            />
          </div>

          {/* Badges Overlay */}
          {product.badge && (
            <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-[#8C5338] text-white shadow-2xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C5338]">
              {product.category}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2D2621] mt-1 leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-[#C27838]">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs font-bold text-[#2D2621]">
                {product.rating}
              </span>
              <span className="text-xs text-[#786C64]">
                ({product.reviewCount} reviews)
              </span>
              <span className="text-[#E8E2DA]">|</span>
              <span className="text-xs font-medium text-emerald-700">● In Stock</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-[#E8E2DA]">
            <span className="text-2xl font-bold text-[#2D2621]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm line-through text-[#786C64]">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-[#8C5338] bg-[#F5EBE6] px-2 py-0.5 rounded-sm">
              {product.discount}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#786C64] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#2D2621]">Select Size</span>
                <span className="text-xs text-[#8C5338] underline cursor-pointer">Size Guide</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#8C5338] bg-[#8C5338] text-white shadow-2xs'
                        : 'border-[#E8E2DA] bg-white text-[#2D2621] hover:border-[#8C5338]/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="mt-auto pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-[#E8E2DA] rounded-full bg-white px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center text-[#786C64] hover:text-[#2D2621] cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#2D2621]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-6 flex items-center justify-center text-[#786C64] hover:text-[#2D2621] cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 py-3 px-6 rounded-full bg-[#8C5338] hover:bg-[#6E3F29] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  isWishlisted
                    ? 'border-[#C27838] bg-[#F5EBE6] text-[#C27838]'
                    : 'border-[#E8E2DA] bg-white text-[#2D2621] hover:border-[#8C5338]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Quick Benefits Strip */}
            <div className="flex items-center justify-between text-[11px] text-[#786C64] pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#8C5338]" /> Free Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C5338]" /> 100% Authentic
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
