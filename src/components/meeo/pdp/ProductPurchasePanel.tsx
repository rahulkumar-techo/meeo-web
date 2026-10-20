'use client';

/**
 * @file ProductPurchasePanel.tsx
 * @description Flipkart-style product information panel featuring dynamic variant selection,
 * special pricing, bank offers, pincode delivery checker, ratings badge, and key highlights.
 */

import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  MeeoProductDetail,
  ProductColorOption,
  FormattedProductVariant,
} from '@/data/meeoProductDetails';

interface ProductPurchasePanelProps {
  product: MeeoProductDetail;
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
  selectedColor?: ProductColorOption;
  onColorChange?: (color: ProductColorOption) => void;
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
  selectedVariantId,
  onVariantChange,
  selectedColor,
  onColorChange,
}) => {
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);

  // Derive active variant gracefully
  const variants = product?.variants || [];
  const activeVariant: FormattedProductVariant | undefined =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const currentPrice = activeVariant?.price ?? product?.price ?? 0;
  const originalPrice = activeVariant?.originalPrice ?? product?.originalPrice ?? 0;
  const currentDiscount = activeVariant?.discount || product?.discount || '';
  const inStock = activeVariant?.inStock ?? product?.inStock ?? true;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length >= 4) {
      setPincodeChecked(true);
    }
  };

  const offers = [
    {
      type: 'Bank Offer',
      text: '5% Unlimited Cashback on Meeo Axis Bank Credit Card',
      terms: 'T&C',
    },
    {
      type: 'Special Price',
      text: 'Get extra ₹300 off on select credit/debit card transactions',
      terms: 'T&C',
    },
    {
      type: 'Partner Offer',
      text: 'Sign-up for Meeo Pay Later & get ₹100 instant cashback on your first order',
      terms: 'Know More',
    },
    {
      type: 'No Cost EMI',
      text: 'Avail No Cost EMI on select cards on orders above ₹3,000',
      terms: 'View Plans',
    },
  ];

  const visibleOffers = showAllOffers ? offers : offers.slice(0, 2);

  return (
    <div className="w-full flex flex-col pt-1">
      {/* Brand & Assured Tag */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-bold text-[#8C5338] uppercase tracking-wider">
          {product?.brand || 'Brand'}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-[#2D2621] leading-snug mb-2 font-serif">
        {product?.name || 'Product Details'}
      </h1>

      {/* Ratings Pill + Assured Badge */}
      <div className="flex items-center flex-wrap gap-2.5 mb-3.5 pb-3 border-b border-[#E8E2DA]">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2E6F40] text-white text-xs font-bold shadow-2xs">
          <span>{product?.rating || 4.3}</span>
          <Star className="w-3 h-3 fill-white" />
        </div>

        <span className="text-xs font-medium text-[#786C64]">
          {product?.reviewCount || '1,248'} Ratings &amp; Reviews
        </span>

        <span className="text-[#E8E2DA]">•</span>

        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5EBE6] text-[#8C5338] border border-[#8C5338]/20 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Assured</span>
        </div>

        <span className="text-[#E8E2DA]">•</span>

        {inStock ? (
          <span className="text-xs font-semibold text-[#2E6F40]">In Stock</span>
        ) : (
          <span className="text-xs font-semibold text-[#B3261E]">Currently Out of Stock</span>
        )}
      </div>

      {/* Special Price Tag & Pricing Row */}
      <div className="mb-4">
        {currentDiscount && (
          <span className="inline-block text-xs font-bold text-[#8C5338] mb-1">
            Special price
          </span>
        )}

        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-[#2D2621]">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>

          {originalPrice > currentPrice && (
            <span className="text-sm sm:text-base text-[#786C64] line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}

          {currentDiscount && (
            <span className="text-xs sm:text-sm font-bold text-[#8C5338] bg-[#F5EBE6] px-2 py-0.5 rounded">
              {currentDiscount}
            </span>
          )}
        </div>
      </div>

      {/* Available Offers Section */}
      <div className="mb-5 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA]">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#2D2621]">
          <Tag className="w-3.5 h-3.5 text-[#8C5338]" />
          <span>Available Offers</span>
        </div>

        <div className="space-y-2">
          {visibleOffers.map((offer, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#2D2621]">
              <span className="font-bold text-[#8C5338] shrink-0">{offer.type}:</span>
              <span className="text-[#786C64] leading-relaxed">
                {offer.text}{' '}
                <span className="text-[#8C5338] font-semibold cursor-pointer hover:underline">
                  {offer.terms}
                </span>
              </span>
            </div>
          ))}
        </div>

        {offers.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAllOffers(!showAllOffers)}
            className="mt-2 text-xs font-bold text-[#8C5338] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showAllOffers ? 'View fewer offers' : `View ${offers.length - 2} more offers`}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllOffers ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        )}
      </div>

      {/* Variant Selector: At least one variant is always present */}
      {variants.length > 1 && (
        <div className="mb-5 pb-5 border-b border-[#E8E2DA]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#786C64] uppercase tracking-wider">
              Select Variant / Option:
            </span>
            <span className="text-xs font-semibold text-[#2D2621]">
              {activeVariant?.sku || activeVariant?.attributes?.colors || 'Selected'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {variants.map((variant) => {
              const isSelected = variant.id === activeVariant?.id;
              const title =
                variant.attributes?.colors ||
                variant.attributes?.Color ||
                variant.attributes?.Colour ||
                variant.attributes?.size ||
                variant.sku;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onVariantChange?.(variant.id)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'border-[#8C5338] bg-[#F5EBE6] text-[#8C5338] ring-1 ring-[#8C5338] shadow-2xs'
                      : 'border-[#E8E2DA] bg-white text-[#2D2621] hover:border-[#8C5338]/50'
                  } ${!variant.inStock ? 'opacity-40 line-through' : ''}`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#8C5338]" />}
                  <span>{title}</span>
                  <span className="font-bold text-[#2D2621]">
                    ₹{variant.price.toLocaleString('en-IN')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Swatches if configured */}
      {product?.colors && product.colors.length > 0 && (
        <div className="mb-5 pb-5 border-b border-[#E8E2DA]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#786C64] uppercase tracking-wider">
              Color:
            </span>
            <span className="text-xs font-semibold text-[#2D2621]">
              {selectedColor?.name || product.colors[0]?.name}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {product.colors.map((color) => {
              const isSelected = color.id === selectedColor?.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onColorChange?.(color)}
                  className={`relative w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'border-[#8C5338] ring-2 ring-[#8C5338] scale-105'
                      : 'border-[#E8E2DA] hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.swatchColor || color.hex }}
                  title={color.name}
                  aria-label={color.name}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery & Pincode Checker */}
      <div className="mb-5 pb-5 border-b border-[#E8E2DA]">
        <span className="block text-xs font-bold text-[#786C64] uppercase tracking-wider mb-2">
          Delivery Options:
        </span>

        <form onSubmit={handlePincodeCheck} className="flex items-center gap-2 max-w-sm mb-2.5">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C64]" />
            <input
              type="text"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setPincodeChecked(false);
              }}
              placeholder="Enter Delivery Pincode"
              maxLength={6}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E2DA] rounded-xl focus:outline-none focus:border-[#8C5338] bg-white text-[#2D2621]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-[#8C5338] hover:text-white border border-[#8C5338] hover:bg-[#8C5338] rounded-xl transition-colors cursor-pointer"
          >
            Check
          </button>
        </form>

        {pincodeChecked ? (
          <div className="flex items-center gap-2 text-xs text-[#2E6F40] font-semibold">
            <Check className="w-4 h-4" />
            <span>Delivery by Tomorrow, Free ₹40 for orders above ₹500</span>
          </div>
        ) : (
          <p className="text-[11px] text-[#786C64]">
            Please enter PIN code to check delivery time &amp; Pay on Delivery availability.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-[#E8E2DA] text-xs text-[#786C64]">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#8C5338] shrink-0" />
            <span>7 Days Replacement Policy</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#8C5338] shrink-0" />
            <span>Cash on Delivery available</span>
          </div>
        </div>
      </div>

      {/* Highlights / Key Features */}
      {product?.highlights && product.highlights.length > 0 && (
        <div className="mb-4">
          <span className="block text-xs font-bold text-[#786C64] uppercase tracking-wider mb-2">
            Highlights:
          </span>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#2D2621] marker:text-[#8C5338]">
            {product.highlights.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Short Description */}
      {product?.description && (
        <div className="mt-2 text-xs text-[#786C64] leading-relaxed">
          <span className="font-bold text-[#2D2621]">Description: </span>
          {product.description}
        </div>
      )}
    </div>
  );
};
