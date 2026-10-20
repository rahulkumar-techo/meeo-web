import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, Feather, Recycle, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Our Story · Meeo Modern Lifestyle & Curated Goods',
  description:
    'Learn about Meeo: premium apparel, modern lifestyle essentials, and curated designs crafted for your everyday journey.',
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-8 sm:py-16">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#786C64] mb-8">
          <Link href="/" className="hover:text-[#2D2621] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#2D2621] font-semibold">About Meeo</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16 sm:mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8C5338]">
              The Meeo Philosophy
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2D2621] font-normal leading-[1.08] tracking-tight">
              Every Step<br />A Better You
            </h1>
            <p className="text-sm sm:text-base text-[#786C64] leading-relaxed max-w-xl">
              Meeo was founded on a simple conviction: footwear should never compromise between enduring architectural aesthetics and effortless all-day comfort.
            </p>
            <p className="text-sm text-[#786C64] leading-relaxed max-w-xl">
              We hand-select iconic heritage silhouettes from global pioneers like Nike, Adidas, New Balance, and Puma, alongside bespoke objects engineered for mindful urban living.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/category"
                className="px-7 py-3.5 rounded-full bg-[#8C5338] text-white text-xs font-semibold hover:bg-[#72422C] transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/category?deals=true"
                className="px-7 py-3.5 rounded-full border border-[#E8E2DA] bg-white text-[#2D2621] text-xs font-semibold hover:bg-[#EFEAE4] transition-colors"
              >
                <span>View Archive Drops</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg border border-[#E8E2DA] bg-[#EFEAE4]">
            <Image
              src="/assets/meeo/promo-banner.jpg"
              alt="Meeo Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-10 mb-16 sm:mb-24 shadow-2xs">
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2621]">500+</div>
            <div className="text-xs text-[#786C64] mt-1 font-medium">Curated Brands & Styles</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2621]">50K+</div>
            <div className="text-xs text-[#786C64] mt-1 font-medium">Happy Discerning Walkers</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#8C5338]">4.8 ★</div>
            <div className="text-xs text-[#786C64] mt-1 font-medium">Verified Customer Rating</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2621]">100%</div>
            <div className="text-xs text-[#786C64] mt-1 font-medium">Guaranteed Provenance</div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-16 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C5338]">
              Our Guiding Values
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2621] mt-2">
              What Sets Meeo Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-[#E8E2DA] p-8 shadow-2xs hover:border-[#8C5338]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338] mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2D2621] mb-2">
                Uncompromising Authenticity
              </h3>
              <p className="text-xs text-[#786C64] leading-relaxed">
                Every silhouette undergoes rigorous hands-on physical verification. Serial numbers, stitch density, and leather grain are examined before dispatch.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E2DA] p-8 shadow-2xs hover:border-[#8C5338]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338] mb-5">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2D2621] mb-2">
                Ergonomic Everyday Comfort
              </h3>
              <p className="text-xs text-[#786C64] leading-relaxed">
                Footwear that honors the human foot. We prioritize anatomical support, breathable natural linings, and shock-absorbing midsoles that feel good on mile ten.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E2DA] p-8 shadow-2xs hover:border-[#8C5338]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338] mb-5">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2D2621] mb-2">
                Conscious Longevity
              </h3>
              <p className="text-xs text-[#786C64] leading-relaxed">
                We design and select items that age gracefully rather than ending up in landfills. Suedes that develop patina, repairable outsoles, and plastic-free packaging.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
