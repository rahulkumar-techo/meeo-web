'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
  badgeType?: 'trending' | 'drop' | 'exclusive' | 'sale' | 'award';
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  badge,
  badgeType,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Main Image Frame */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#e2e7ff] shadow-sm group">
        <img
          src={images[selectedImageIndex] || images[0]}
          alt={productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge Overlay */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant={badgeType === 'drop' ? 'drop' : 'coral'} size="md">
              {badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Strips */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => {
            const isSelected = selectedImageIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                  isSelected
                    ? 'border-[#412ce7] shadow-md scale-105'
                    : 'border-[#e2e7ff] hover:border-[#c7c4d9] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
