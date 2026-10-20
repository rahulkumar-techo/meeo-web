'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { MEEO_HERO_SLIDES, MeeoHeroSlide } from '@/data/meeoData';
import { HeroSneakerVisual } from './HeroSneakerVisual';
import { VideoModal } from './VideoModal';

export const MeeoHero: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const currentSlide: MeeoHeroSlide = MEEO_HERO_SLIDES[currentSlideIndex];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % MEEO_HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + MEEO_HERO_SLIDES.length) % MEEO_HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full bg-[#FAF8F5] pt-4 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-5 flex flex-col items-start z-10 pt-2 lg:pt-0">
            {/* Eyebrow Label */}
            <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold text-[#8C5338] mb-4 sm:mb-6">
              {currentSlide.eyebrow}
            </span>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] text-[#2D2621] font-normal leading-[1.08] tracking-tight mb-5 sm:mb-6 whitespace-pre-line">
              {currentSlide.title}
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#786C64] leading-relaxed max-w-md mb-8 sm:mb-10 font-sans">
              {currentSlide.description}
            </p>

            {/* CTAs Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
              {/* Primary CTA */}
              <Link
                href="/category"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#8C5338] hover:bg-[#6E3F29] text-white text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-md active:scale-98 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary CTA: Watch Video */}
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-full text-[#2D2621] hover:text-[#8C5338] transition-colors text-sm sm:text-base font-medium cursor-pointer group"
              >
                <span className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#2D2621] group-hover:border-[#8C5338] group-hover:text-[#8C5338] transition-colors shadow-2xs">
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                </span>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Triple Metrics Row with Dividers */}
            <div className="w-full flex items-center gap-4 sm:gap-8 pt-6 border-t border-[#E8E2DA]">
              {currentSlide.metrics.map((metric, idx) => (
                <React.Fragment key={metric.label}>
                  <div className="flex flex-col">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621] leading-none mb-1">
                      {metric.value}
                    </span>
                    <span className="text-xs sm:text-sm text-[#786C64] whitespace-nowrap">
                      {metric.label}
                    </span>
                  </div>
                  {idx < currentSlide.metrics.length - 1 && (
                    <div className="h-8 w-[1px] bg-[#E8E2DA]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual & Controls */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center">
            {/* Visual Staging with Rounded 3xl Frame & Integrated Carousel Controls */}
            <div className="w-full relative rounded-3xl overflow-hidden border border-[#E8E2DA]/80 shadow-md bg-[#FAF8F5]">
              <HeroSneakerVisual
                imageSrc={currentSlide.image}
                altText={currentSlide.name}
              />

              {/* Bottom Carousel Controls matching reference screenshot inside bottom-right */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-4 sm:gap-6 bg-white/85 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#E8E2DA] shadow-sm">
                {/* Numbered Indicators */}
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#786C64]">
                  {MEEO_HERO_SLIDES.map((_, idx) => {
                    const slideNumber = `0${idx + 1}`;
                    const isActive = idx === currentSlideIndex;
                    return (
                      <button
                        key={slideNumber}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#2D2621] font-bold border-b border-[#2D2621] pb-0.5'
                            : 'hover:text-[#2D2621]'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        {slideNumber}
                      </button>
                    );
                  })}
                  <span className="text-[#786C64] ml-0.5">→</span>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1.5 border-l border-[#E8E2DA] pl-3">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-8 h-8 rounded-full border border-[#E8E2DA] bg-white hover:bg-[#F3EFEA] text-[#2D2621] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-8 h-8 rounded-full bg-[#2D2621] hover:bg-[#1A1614] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title={`${currentSlide.name} · Craftsmanship & Design Story`}
      />
    </section>
  );
};
