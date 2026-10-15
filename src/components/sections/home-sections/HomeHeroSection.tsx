'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import type { Product } from '@/types/product';

interface SlideProduct {
  id: string;
  badge: string;
  badgeType: string;
  title: string;
  highlight: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  refCode: string;
  specPill1: string;
  specPill2: string;
  specFooter: string;
  image: string;
  glowColor: string;
  gradientText: string;
  finishes: Array<{ id: string; name: string; hex: string }>;
}

const HERO_SLIDES: SlideProduct[] = [
  {
    id: 'flagship-iphone-16-pro',
    badge: 'FLAGSHIP 2026 // TITANIUM ARCHITECTURE',
    badgeType: 'TITANIUM PRO',
    title: 'Grade 5 Titanium.',
    highlight: 'Engineered for mastery.',
    subtitle: 'Aerospace-grade micro-blasted titanium casing encasing the groundbreaking A18 Pro silicon with 48MP Fusion system and 4K 120fps Dolby Vision.',
    price: 119900,
    originalPrice: 129900,
    refCode: 'REF. IP16PRO-M',
    specPill1: 'A18 Pro 3nm Silicon',
    specPill2: '48MP FUSION',
    specFooter: '4K 120 fps Dolby Vision',
    image: 'https://ik.imagekit.io/ww7mydmoc/products/59579455-7203-444e-bbe3-b2516cbe4224/variants/-original-imahggetkf6y67sr_CXmBIRLMr.webp',
    glowColor: 'rgba(65, 44, 231, 0.28)',
    gradientText: 'from-[#412ce7] via-[#6355ff] to-[#fd6a49]',
    finishes: [
      { id: 'natural', name: 'Natural Titanium', hex: '#989793' },
      { id: 'black', name: 'Black Titanium', hex: '#222326' },
      { id: 'desert', name: 'Desert Titanium', hex: '#c5a88c' },
      { id: 'white', name: 'White Titanium', hex: '#ecebe7' },
    ],
  },
  {
    id: 'studio-audio-xm5',
    badge: 'STUDIO ACOUSTICS // ZERO NOISE CALIBRATION',
    badgeType: 'HI-RES AUDIO',
    title: 'Carbon-Fiber Acoustic.',
    highlight: 'Pure studio silence.',
    subtitle: 'Precision-engineered 30mm carbon composite drivers with dual Integrated Processor V1. LDAC lossless audio streaming with 30-hour continuous playback.',
    price: 26990,
    originalPrice: 34990,
    refCode: 'REF. XM5-STUDIO',
    specPill1: 'Auto NC Optimizer',
    specPill2: 'LDAC LOSSLESS',
    specFooter: '30-Hour Battery • Fast PD',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    glowColor: 'rgba(253, 106, 73, 0.28)',
    gradientText: 'from-[#fd6a49] via-[#ff8f75] to-[#412ce7]',
    finishes: [
      { id: 'midnight', name: 'Midnight Black', hex: '#19191d' },
      { id: 'silver', name: 'Platinum Silver', hex: '#d9d7ce' },
      { id: 'sand', name: 'Smoky Sand', hex: '#b5a593' },
    ],
  },
  {
    id: 'workspace-q1-pro',
    badge: 'CNC WORKSPACE // 6063 BILLET ALUMINUM',
    badgeType: 'CUSTOM HARDWARE',
    title: 'Solid 6063 Aluminum.',
    highlight: 'Double-gasket acoustics.',
    subtitle: 'Machined from single billet 6063 aluminum body with double-gasket acoustic dampening. South-facing RGB, hot-swappable switches, and QMK/VIA programmable layers.',
    price: 18499,
    originalPrice: 22999,
    refCode: 'REF. Q1PRO-CNC',
    specPill1: 'Double-Gasket Mount',
    specPill2: 'HOT-SWAP PCB',
    specFooter: 'QMK/VIA Open Architecture',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    gradientText: 'from-[#059669] via-[#10b981] to-[#6366f1]',
    finishes: [
      { id: 'space-gray', name: 'Space Gray', hex: '#4b4d52' },
      { id: 'carbon', name: 'Carbon Black', hex: '#1c1d1f' },
      { id: 'silver', name: 'Anodized Silver', hex: '#c8cbd0' },
    ],
  },
];

export const HomeHeroSection: React.FC = () => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedFinishes, setSelectedFinishes] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const activeSlide = HERO_SLIDES[currentIdx];
  const activeFinishIdx = selectedFinishes[currentIdx] || 0;
  const activeFinish = activeSlide.finishes[activeFinishIdx] || activeSlide.finishes[0];

  const [slideProgress, setSlideProgress] = useState<number>(0);

  const changeSlide = useCallback((newIdx: number) => {
    if (newIdx === currentIdx || isTransitioning) return;
    setIsTransitioning(true);
    setSlideProgress(0);
    setCurrentIdx(newIdx);
    setTimeout(() => setIsTransitioning(false), 450);
  }, [currentIdx, isTransitioning]);

  const handlePrev = useCallback(() => {
    const nextIdx = (currentIdx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    changeSlide(nextIdx);
  }, [currentIdx, changeSlide]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIdx + 1) % HERO_SLIDES.length;
    changeSlide(nextIdx);
  }, [currentIdx, changeSlide]);

  // Running slide progress timer with pause on hover
  useEffect(() => {
    if (isHovered) return;
    const intervalMs = 40;
    const durationMs = 5200;
    const step = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ x, y });
      setTilt({ x: rotateX, y: rotateY });
    });
  }, []);

  const handleQuickBuy = () => {
    const productModel: Product = {
      id: activeSlide.id,
      slug: activeSlide.id,
      name: `${activeSlide.title.replace('.', '')} - ${activeSlide.highlight.replace('.', '')}`,
      subtitle: activeFinish.name,
      category: 'workspace',
      categoryLabel: activeSlide.badgeType,
      price: activeSlide.price,
      originalPrice: activeSlide.originalPrice,
      rating: 4.9,
      reviewCount: 94,
      inStock: true,
      stockCount: 12,
      description: activeSlide.subtitle,
      images: [activeSlide.image],
      specs: {},
      tags: ['Hero Flagship'],
    };
    addToCart(productModel, 1);
    showToast(`Added ${activeSlide.title} (${activeFinish.name}) to bag`);
  };

  const discountAmount = activeSlide.originalPrice - activeSlide.price;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      className="relative w-full overflow-hidden bg-[#faf8ff] dark:bg-[#0b0f19] border-b border-[#e2e7ff] dark:border-[#1e273d] transition-colors duration-300 min-h-0 lg:min-h-[calc(100vh-108px)] flex flex-col justify-center"
    >
      {/* 1. Ambient Dynamic Glow Cursor Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out"
        style={{
          opacity: isHovered ? 1 : 0.45,
          background: `radial-gradient(650px circle at ${mousePos.x || 650}px ${mousePos.y || 260}px, ${activeSlide.glowColor}, transparent 65%)`,
        }}
      />

      {/* 2. Micro Dot Matrix Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05] bg-[radial-gradient(#131b2e_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-[84rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          
          {/* Left Column: Animated Editorial Content */}
          <div className={`lg:col-span-6 flex flex-col items-start z-10 transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            {/* Top Serial / Protocol Pill with Running Pulse Dot */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-[#131826] border border-[#e2e7ff] dark:border-[#243048] shadow-xs mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#412ce7] dark:bg-[#685aff] animate-meeo-pulse-slow" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#131b2e] dark:text-[#f1f3fa]">
                {activeSlide.badge}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                IN STOCK
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-4xl xl:text-[44px] font-black text-[#131b2e] dark:text-white tracking-tight leading-[1.12]">
              {activeSlide.title}{' '}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.gradientText}`}>
                {activeSlide.highlight}
              </span>
            </h1>

            {/* Precision Subtitle */}
            <p className="text-xs sm:text-sm text-[#464556] dark:text-[#a6abbf] mt-2 max-w-lg leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
              {activeSlide.subtitle}
            </p>

            {/* Finish Swatches with Tailwind v4 outline */}
            <div className="flex items-center gap-3 mt-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777588] dark:text-[#8e95ac]">
                Finish: <strong className="text-[#131b2e] dark:text-white font-black">{activeFinish.name}</strong>
              </span>
              <div className="flex items-center gap-2">
                {activeSlide.finishes.map((finish, fIdx) => {
                  const isSelected = activeFinishIdx === fIdx;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setSelectedFinishes((prev) => ({ ...prev, [currentIdx]: fIdx }))}
                      aria-label={`Select ${finish.name}`}
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'outline-2 outline-offset-2 outline-[#412ce7] dark:outline-[#685aff] scale-110 shadow-xs'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: finish.hex }}
                    >
                      {isSelected && (
                        <Check className="w-2.5 h-2.5 text-white drop-shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Value Proposition Block */}
            <div className="flex items-baseline gap-2.5 mt-3 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#131b2e] dark:text-white tracking-tight">
                ₹{activeSlide.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm sm:text-base text-[#777588] dark:text-[#7f869e] line-through font-semibold">
                ₹{activeSlide.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#ffdad2] dark:bg-[#3d120a] text-[#ae3115] dark:text-[#ff8f75] text-[11px] font-black uppercase tracking-wider">
                Save ₹{discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-[#777588] dark:text-[#8e95ac] mt-0.5 font-medium">
              Zero-fee no cost EMI available • 2-Year Studio Warranty included
            </p>

            {/* Action Buttons Cluster */}
            <div className="flex flex-wrap items-center gap-3 mt-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleQuickBuy}
                className="h-10 px-5 rounded-xl bg-[#412ce7] hover:bg-[#543eff] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3px_12px_rgba(65,44,231,0.25)] hover:shadow-[0_4px_16px_rgba(65,44,231,0.35)] transition-all cursor-pointer active:scale-[0.98] shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Acquire Edition</span>
              </button>

              <Link
                href="#products"
                className="h-10 px-5 rounded-xl bg-white dark:bg-[#141b2c] hover:bg-[#f2f3ff] dark:hover:bg-[#1b243b] text-[#131b2e] dark:text-white border border-[#e2e7ff] dark:border-[#283550] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Motion Hardware Stage with Continuous Floating */}
          <div className="lg:col-span-6 flex items-center justify-center relative perspective-[1200px] py-2 sm:py-0">
            {/* Ambient Multi-Ring Halo Behind Hardware with Continuous Breathing Animation */}
            <div
              className="absolute w-[260px] sm:w-[360px] lg:w-[400px] h-[260px] sm:h-[360px] lg:h-[400px] rounded-full blur-3xl opacity-35 dark:opacity-30 transition-all duration-700 pointer-events-none animate-meeo-aura"
              style={{ backgroundColor: activeFinish.hex }}
            />

            {/* 3D Motion Physical Stage */}
            <div
              className={`relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/4.5] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/80 to-[#f2f4fc]/80 dark:from-[#131929]/80 dark:to-[#0f1422]/80 backdrop-blur-xl border border-white/60 dark:border-[#222d46] p-4 sm:p-5 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out overflow-hidden ${
                isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
              }`}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1, 1, 1)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Metallic Sheen Light Sweep Running Continuously */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
                <div className="w-[50%] h-full bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent animate-meeo-sheen" />
              </div>

              {/* Top Floating Engineering Chip */}
              <div className="flex items-center justify-between w-full z-20">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-md border border-[#e2e7ff]/80 dark:border-[#2a3652] text-[10px] font-bold text-[#131b2e] dark:text-white shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#412ce7] dark:text-[#685aff] animate-meeo-pulse-slow" />
                  <span>{activeSlide.specPill1}</span>
                </div>
                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                  {activeSlide.specPill2}
                </div>
              </div>

              {/* Central Floating Hardware Image with Continuous Running Float Animation */}
              <div className="relative flex-1 flex items-center justify-center my-2 z-10 group overflow-hidden">
                <div className="w-full h-full flex items-center justify-center animate-meeo-float">
                  <img
                    key={activeSlide.id}
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className={`w-auto h-full max-h-[190px] sm:max-h-[230px] object-contain drop-shadow-[0_18px_25px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_22px_32px_rgba(0,0,0,0.55)] group-hover:scale-105 transition-all duration-500 ease-out ${
                      isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
                    }`}
                  />
                </div>
              </div>

              {/* Bottom Spec Footer Pill */}
              <div className="flex items-center justify-between z-20 pt-2 border-t border-[#e2e7ff]/60 dark:border-[#222d46]">
                <span className="text-[10px] font-bold text-[#464556] dark:text-[#a6abbf]">
                  {activeSlide.specFooter}
                </span>
                <span className="text-[9px] font-mono text-[#777588] dark:text-[#8e95ac]">
                  {activeSlide.refCode}
                </span>
              </div>
            </div>
          </div>

        </div>



        {/* Bottom Interactive Slider Navigation Strip with Running Progress Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-2">
          {/* Slide Indicator Cards with Live Running Timer */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
            {HERO_SLIDES.map((slide, sIdx) => {
              const isActive = currentIdx === sIdx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => changeSlide(sIdx)}
                  className={`flex flex-col gap-1 px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white dark:bg-[#151c2e] border border-[#412ce7] dark:border-[#685aff] shadow-xs'
                      : 'hover:bg-white/60 dark:hover:bg-[#151c2e]/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-bold ${
                      isActive
                        ? 'bg-[#412ce7] text-white'
                        : 'bg-[#eaedff] dark:bg-[#1e273d] text-[#777588] dark:text-[#8e95ac]'
                    }`}>
                      0{sIdx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold whitespace-nowrap ${
                        isActive ? 'text-[#131b2e] dark:text-white' : 'text-[#777588] dark:text-[#8e95ac]'
                      }`}>
                        {slide.title.replace('.', '')}
                      </span>
                      <span className="text-[9px] text-[#777588] dark:text-[#8e95ac]">
                        ₹{slide.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Active Slide Running Timer Bar */}
                  {isActive && (
                    <div className="w-full bg-[#eaedff] dark:bg-[#222d46] h-0.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className="h-full bg-[#412ce7] dark:bg-[#685aff] rounded-full transition-all duration-75 ease-linear"
                        style={{ width: `${slideProgress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev / Next Circular Arrows */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous edition"
              className="w-8 h-8 rounded-lg bg-white dark:bg-[#151c2e] hover:bg-[#412ce7] hover:text-white text-[#131b2e] dark:text-white border border-[#e2e7ff] dark:border-[#283550] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next edition"
              className="w-8 h-8 rounded-lg bg-white dark:bg-[#151c2e] hover:bg-[#412ce7] hover:text-white text-[#131b2e] dark:text-white border border-[#e2e7ff] dark:border-[#283550] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeHeroSection;