'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { URBAN_PROMO_BANNER } from '@/data/urbanNestData';

export const UrbanNestPromoBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF8F5] pb-20 sm:pb-28">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#1A1614] border border-[#2D2621] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[420px] items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col items-start z-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#C27838]" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C27838]">
                  {URBAN_PROMO_BANNER.badge}
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FAF8F5] font-normal leading-[1.08] tracking-tight mb-4">
                {URBAN_PROMO_BANNER.headline}
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#E8E2DA]/80 max-w-md leading-relaxed mb-8 font-sans">
                {URBAN_PROMO_BANNER.subtitle}
              </p>

              {/* CTA Button */}
              <Link
                href={URBAN_PROMO_BANNER.ctaHref}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#2D2621] text-sm sm:text-base font-semibold transition-all shadow-md hover:shadow-lg active:scale-98 group cursor-pointer"
              >
                <span>{URBAN_PROMO_BANNER.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Lifestyle Photography Column with Stamp Badge */}
            <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-full min-h-[320px] w-full overflow-hidden">
              {/* Lifestyle Image */}
              <Image
                src={URBAN_PROMO_BANNER.image}
                alt="UrbanNest Lifestyle Footwear Promotion"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />

              {/* Dark Gradient Overlay for seamless integration */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1A1614] via-transparent to-transparent opacity-90 lg:opacity-75" />

              {/* Circular Editorial Stamp / Badge */}
              <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-white/30 backdrop-blur-md bg-black/30 flex flex-col items-center justify-center p-3 text-center pointer-events-none select-none shadow-lg">
                <span className="text-[9px] uppercase tracking-widest text-[#E8E2DA] font-semibold">
                  BETTER STYLE
                </span>
                <span className="text-xs uppercase tracking-wider text-white font-serif font-bold my-1">
                  EVERYDAY
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#C27838] font-bold">
                  URBANNEST
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
