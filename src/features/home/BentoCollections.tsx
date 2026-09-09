'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types/product';

interface BentoCollectionsProps {
  products: Product[];
}

export const BentoCollections: React.FC<BentoCollectionsProps> = ({ products }) => {
  return (
    <section className="w-full max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#412ce7] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#fd6a49]" />
            <span>Autumn / Winter Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
            Curated Architectural Editions
          </h2>
          <p className="text-sm text-[#464556] mt-1">
            Independently designed hardware and tactile living objects built for daily rituals.
          </p>
        </div>

        <Link
          href="/category"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#412ce7] hover:text-[#5b4dff] transition-colors"
        >
          <span>Explore All 48 Pieces</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Asymmetric Bento Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Feature Banner Card (Col 7) */}
        <div className="md:col-span-7 bg-gradient-to-br from-[#131b2e] to-[#283044] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between group shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#412ce7]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider mb-4 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#fd6a49]" />
              <span>Studio Exclusive</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              The Aethel-01 Italian Nappa Sneaker
            </h3>
            <p className="text-xs sm:text-sm text-[#dae2fd] leading-relaxed mb-6">
              Full-grain 1.4mm calfskin handcrafted in Marche, Italy. Natural bio-density orthotic cork core with zero break-in period.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10">
            <div>
              <span className="text-[11px] text-[#dae2fd] uppercase font-bold">Limited Run</span>
              <p className="text-xl font-extrabold text-white">₹8,499</p>
            </div>
            <Link
              href="/product/prod-01"
              className="px-5 py-2.5 bg-[#fd6a49] hover:bg-[#e05736] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Inspect Drop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top Companion Product Card (Col 5) */}
        <div className="md:col-span-5 h-full">
          {products[4] && <ProductCard product={products[4]} aspectRatio="portrait" />}
        </div>

        {/* 3-Column Standard Grid */}
        {products.slice(2, 5).map((product) => (
          <div key={product.id} className="md:col-span-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
