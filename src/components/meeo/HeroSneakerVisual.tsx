'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroSneakerVisualProps {
  imageSrc: string;
  altText: string;
  is3dAvailable?: boolean;
}

export const HeroSneakerVisual: React.FC<HeroSneakerVisualProps> = ({
  imageSrc,
  altText,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-4/3 sm:aspect-16/12 lg:aspect-4/3 flex items-center justify-center overflow-hidden select-none">
      {/* Background Soft Warm Atmospheric Glow */}
      <div className="absolute inset-0 bg-radial from-[#F5EBE6]/60 via-[#FAF8F5]/30 to-transparent blur-2xl pointer-events-none" />

      {/* Main Photographic Staging Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
          className={`object-contain transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Subtle Floating Ambient Accent Crystals */}
      <div
        className="absolute top-12 right-16 w-3 h-3 bg-[#C27838]/40 rotate-45 rounded-xs animate-urban-float pointer-events-none hidden sm:block"
        style={{ animationDelay: '1.2s' }}
      />
      <div
        className="absolute bottom-24 left-10 w-2.5 h-2.5 bg-[#8C5338]/30 rotate-12 rounded-xs animate-urban-float pointer-events-none hidden sm:block"
        style={{ animationDelay: '2.5s' }}
      />
    </div>
  );
};
