'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Flame, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Slide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlight: string;
  subtitle: string;
  offer: string;
  bankOffer: string;
  ctaText: string;
  ctaHref: string;
  bgGradient: string;
  textColor: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 'slide-tech',
    badge: 'MEGA ELECTRONICS FEST',
    badgeColor: 'bg-amber-400 text-slate-900',
    title: 'Up to 70% Off on',
    highlight: 'Precision Tech & Keyboards',
    subtitle: 'CNC mechanical boards, MagSafe Qi2 docks, fast chargers & monitor lamps',
    offer: 'MIN 40% OFF',
    bankOffer: 'Extra ₹1,500 Off on HDFC & ICICI Cards',
    ctaText: 'Shop Tech Deals',
    ctaHref: '/category?cat=workspace',
    bgGradient: 'from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]',
    textColor: 'text-indigo-100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqvFJ9Jq4rAD2WZ09ddauyJ96v_Jjo9zZGaUT5-2Q3mE1h4q0LolxR7l72iG0KRQ9hkpDWerA_xsSedGeJC6HwhssAvCW2yh9NAfN547jqMdHDDzjTm_2l4f5fgSkd-6VudOtzbYAoHcI_LIEmXdX2yTZxI_ELZotvRtNSZXx0jiczB5E0b0FVW9bTuSTZQTRhHJiYu07h4U4mgoZEIVax5Wvsp24Iy6TvdcXVCTbE6Uzta8iB_Bpg',
  },
  {
    id: 'slide-footwear',
    badge: 'FASHION & FOOTWEAR CARNIVAL',
    badgeColor: 'bg-rose-500 text-white',
    title: 'Trending Craft Kicks &',
    highlight: 'Italian Leather Derbys',
    subtitle: 'Supercritical foam runners, handcrafted Goodyear derbys & urban sneakers',
    offer: 'FLAT 35% - 50% OFF',
    bankOffer: 'Free Express Delivery On All Orders',
    ctaText: 'Explore Footwear',
    ctaHref: '/category?cat=footwear',
    bgGradient: 'from-[#881337] via-[#9f1239] to-[#4c0519]',
    textColor: 'text-rose-100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFz_4n49d79QvD3zNrk5mffQxXUoGgZ0j934Yh3N3g9QJqHnZ-7a6bE5FvLw_m=s1600',
  },
  {
    id: 'slide-audio',
    badge: 'STUDIO SOUND REVOLUTION',
    badgeColor: 'bg-cyan-400 text-slate-950',
    title: 'Pure Beryllium Drivers &',
    highlight: 'High-Fidelity ANC Audio',
    subtitle: 'Immersive soundstage, lossless LDAC codecs & all-day ergonomic battery life',
    offer: 'FROM ₹2,499',
    bankOffer: 'Instant 10% Cashback on UPI & Cards',
    ctaText: 'Grab Audio Deals',
    ctaHref: '/category?cat=audio',
    bgGradient: 'from-[#082f49] via-[#0c4a6e] to-[#082f49]',
    textColor: 'text-cyan-100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3-3pUFszAOGHgA_jQzKwl01e8Q3ZQy-mbmwLW1eJMrHW5src2l95G1pB5qtQMnxBzqt03RKdhHoqP1sEOFyJx3V_qH4V-hZ2h2sm0xxxUgJweWVa6Wm1TpfbI11CfM837p4ungawt9W5__vxyZs7ZKcRyZJsilad9Ch8YEdFe4ewDFWXebelExtBtKeUjOWxW_ZlzNWjqrCi_D78M-LXZORKXG2dZvw9bSl-tqUMXTBm7n4aj_m0Y3g',
  },
  {
    id: 'slide-workspace',
    badge: 'BUDGET FINDS & EDC',
    badgeColor: 'bg-emerald-400 text-slate-950',
    title: 'Minimalist Workspace &',
    highlight: 'Everyday Essentials Under ₹4,999',
    subtitle: 'Waxed canvas bags, titanium carabiners, matte desk pads & magnetic organizers',
    offer: 'UNDER ₹4,999 SPECIAL',
    bankOffer: '7-Day Hassle-Free Replacement',
    ctaText: 'View Budget Steals',
    ctaHref: '/category',
    bgGradient: 'from-[#064e3b] via-[#047857] to-[#022c22]',
    textColor: 'text-emerald-100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqvFJ9Jq4rAD2WZ09ddauyJ96v_Jjo9zZGaUT5-2Q3mE1h4q0LolxR7l72iG0KRQ9hkpDWerA_xsSedGeJC6HwhssAvCW2yh9NAfN547jqMdHDDzjTm_2l4f5fgSkd-6VudOtzbYAoHcI_LIEmXdX2yTZxI_ELZotvRtNSZXx0jiczB5E0b0FVW9bTuSTZQTRhHJiYu07h4U4mgoZEIVax5Wvsp24Iy6TvdcXVCTbE6Uzta8iB_Bpg',
  },
];

export const FlipkartHeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="w-full max-w-[84rem] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Flipkart-Style Hero Banner Carousel Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-slate-800">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`w-full shrink-0 bg-gradient-to-r ${slide.bgGradient} relative overflow-hidden min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex items-center`}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-black/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 w-full px-5 sm:px-10 lg:px-14 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left Text & Offers Content */}
                <div className="w-full md:w-3/5 text-left text-white space-y-2.5 sm:space-y-3.5">
                  {/* Badge & Offer Pill */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${slide.badgeColor} shadow-xs`}
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      {slide.badge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      {slide.offer}
                    </span>
                  </div>

                  {/* Main Title */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                      {slide.title}{' '}
                      <span className="text-amber-300 drop-shadow-sm block sm:inline">
                        {slide.highlight}
                      </span>
                    </h2>
                    <p className={`text-xs sm:text-sm font-normal line-clamp-2 ${slide.textColor} max-w-xl`}>
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Bank Offer Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-white/90">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{slide.bankOffer}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1.5 sm:pt-2 flex items-center gap-3">
                    <Link
                      href={slide.ctaHref}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/category"
                      className="px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-colors"
                    >
                      All Offers
                    </Link>
                  </div>
                </div>

                {/* Right Product Spotlight Image */}
                <div className="w-full md:w-2/5 flex items-center justify-center relative">
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                    {/* Glowing circular backdrop */}
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl transform scale-90" />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Prev/Next Buttons (Flipkart style) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all active:scale-90 z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all active:scale-90 z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Dots Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 bg-white shadow-xs'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
