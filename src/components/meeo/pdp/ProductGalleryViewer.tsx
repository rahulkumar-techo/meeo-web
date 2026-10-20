'use client';

/**
 * @file ProductGalleryViewer.tsx
 * @description Flipkart-style product gallery viewer with interactive 3D rotation,
 * fixed 3D scroll-to-zoom (preventing outer page jumps), thumbnail carousel, and dual action CTAs.
 */

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Play,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShoppingBag,
  Zap,
  Heart,
  Sparkles,
} from 'lucide-react';
import { GalleryThumbnail } from '@/data/meeoProductDetails';

interface ProductGalleryViewerProps {
  gallery?: GalleryThumbnail[];
  productName?: string;
  activeColorImage?: string;
  onOpenVideo?: () => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isAdding?: boolean;
  inStock?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export const ProductGalleryViewer: React.FC<ProductGalleryViewerProps> = ({
  gallery = [],
  productName = 'Product',
  activeColorImage,
  onOpenVideo,
  onAddToCart,
  onBuyNow,
  isAdding = false,
  inStock = true,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);

  // 3D rotation and zoom state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 2D hover magnification state
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const viewerRef = useRef<HTMLDivElement>(null);

  // Safe fallback if gallery is empty
  const safeGallery =
    gallery.length > 0
      ? gallery
      : [
          {
            id: 'fallback-0',
            label: 'Main',
            type: 'image' as const,
            url: activeColorImage || '/assets/meeo-icon.svg',
          },
        ];

  const activeItem = safeGallery[activeThumbnailIndex] || safeGallery[0];
  const displayImage =
    activeColorImage && activeThumbnailIndex === 0
      ? activeColorImage
      : activeItem?.url || '/assets/meeo-icon.svg';

  // Fix 3D scroll view: Intercept wheel events inside the 3D stage and zoom smoothly
  // Calling preventDefault prevents the outer browser window from scrolling
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!is3DMode) return;
      // Prevent parent window from scrolling while interacting with 3D view
      e.preventDefault();
      e.stopPropagation();
      setZoom((prev) => Math.min(2.5, Math.max(0.7, prev - e.deltaY * 0.002)));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [is3DMode]);

  // Handle 3D mouse drag rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!is3DMode) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - rotation.y,
      y: e.clientY - rotation.x,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is3DMode) {
      if (!isDragging) return;
      const newY = e.clientX - dragStart.current.x;
      const newX = Math.max(-55, Math.min(55, e.clientY - dragStart.current.y));
      setRotation({ x: newX, y: newY });
    } else {
      // 2D gentle pan
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag support for mobile 3D view
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!is3DMode || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX - rotation.y,
      y: e.touches[0].clientY - rotation.x,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!is3DMode || !isDragging || e.touches.length !== 1) return;
    const newY = e.touches[0].clientX - dragStart.current.x;
    const newX = Math.max(-55, Math.min(55, e.touches[0].clientY - dragStart.current.y));
    setRotation({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset3D = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveThumbnailIndex(index);
    if (safeGallery[index]?.type === 'video' && onOpenVideo) {
      onOpenVideo();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Gallery Layout: Left Thumbnail Strip + Main Image Canvas */}
      <div className="w-full flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start">
        {/* Vertical Thumbnail Rail (Horizontal on very small screens) */}
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pb-2 sm:pb-0 w-full sm:w-18 shrink-0 select-none scrollbar-none">
          {safeGallery.map((thumb, idx) => {
            const isSelected = idx === activeThumbnailIndex;
            const isVideo = thumb.type === 'video';

            return (
              <button
                key={thumb.id || `thumb-${idx}`}
                type="button"
                onMouseEnter={() => handleSelectThumbnail(idx)}
                onClick={() => handleSelectThumbnail(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white shrink-0 p-1 ${
                  isSelected
                    ? 'border-[#8C5338] shadow-sm'
                    : 'border-[#E8E2DA] hover:border-[#8C5338]/50 opacity-80 hover:opacity-100'
                }`}
                aria-label={thumb.label || `Thumbnail ${idx + 1}`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={thumb.url}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>

                {isVideo && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-white text-[#212121] flex items-center justify-center shadow-xs">
                      <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Product Canvas */}
        <div
          ref={viewerRef}
          className={`relative flex-1 w-full aspect-square sm:aspect-[4/3] rounded-2xl border border-[#E8E2DA] bg-white shadow-2xs flex items-center justify-center select-none overflow-hidden ${
            is3DMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setIsHovering(false);
            setMousePos({ x: 0, y: 0 });
          }}
          onMouseEnter={() => setIsHovering(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Wishlist Toggle Button (Top Right) */}
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#786C64] hover:text-[#8C5338] flex items-center justify-center shadow-md border border-[#E8E2DA] transition-colors cursor-pointer"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isWishlisted ? 'fill-[#8C5338] text-[#8C5338]' : ''
                }`}
              />
            </button>
          )}

          {/* 3D Mode Toggle Button (Top Left) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIs3DMode(!is3DMode);
              if (is3DMode) handleReset3D();
            }}
            className={`absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
              is3DMode
                ? 'bg-[#8C5338] text-white border border-[#8C5338]'
                : 'bg-white/95 hover:bg-white text-[#2D2621] border border-[#E8E2DA]'
            }`}
            aria-label="Toggle 3D View"
          >
            <Box className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Active' : '3D View'}</span>
          </button>

          {/* 3D Controls Bar (When 3D Mode is Active) */}
          {is3DMode && (
            <div className="absolute top-12 left-3 z-30 flex items-center gap-1 bg-white/95 border border-[#E8E2DA] rounded-lg p-1 shadow-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom((z) => Math.min(2.5, z + 0.2));
                }}
                className="p-1.5 rounded hover:bg-[#FAF8F5] text-[#2D2621] transition-colors"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom((z) => Math.max(0.7, z - 0.2));
                }}
                className="p-1.5 rounded hover:bg-[#FAF8F5] text-[#2D2621] transition-colors"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset3D();
                }}
                className="p-1.5 rounded hover:bg-[#FAF8F5] text-[#2D2621] transition-colors"
                title="Reset orientation"
                aria-label="Reset orientation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Product Image Stage */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 transition-transform duration-75 ease-out"
            style={{
              transform: is3DMode
                ? `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`
                : isHovering
                ? `scale(1.08) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
                : 'scale(1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <Image
              src={displayImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-contain pointer-events-none"
            />
          </div>

          {/* Interactive Guidance Badge */}
          <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
            {is3DMode ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D2621]/80 backdrop-blur-sm text-white text-[11px] font-medium shadow-sm">
                <RotateCw className="w-3 h-3 text-[#C27838]" />
                <span>Drag to rotate 360°</span>
                <span className="text-white/40">•</span>
                <span>Scroll to zoom</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E2DA] text-[#786C64] text-[11px] font-medium shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#8C5338]" />
                <span>Hover to inspect</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App-Themed Dual Action CTAs: ADD TO CART & BUY NOW */}
      <div className="w-full grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!inStock || isAdding}
          className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-[#C27838] hover:bg-[#A86328] active:bg-[#925622] active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          disabled={!inStock || isAdding}
          className="w-full py-3.5 sm:py-4 px-4 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] active:bg-[#573120] active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
