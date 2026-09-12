'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProductsQuery } from '@/hooks/catalog/useCatalog';
import { extractArray } from '@/lib/apiHelper';

export const HeroSection: React.FC = () => {
  const { data: productsData } = useProductsQuery({ limit: 4 });
  const products = extractArray(productsData);

  const flagshipProduct = products[0] || {
    id: 'prod-apex-studio',
    title: 'Apex Studio Wireless Acoustic Monitors',
    name: 'Apex Studio Wireless Acoustic Monitors',
    basePrice: 34999,
    salePrice: 34999,
    price: 34999,
    thumbnailUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop' }],
  };

  const companionProduct = products[1] || {
    id: 'prod-magdock-pro',
    title: 'MagDock Pro Titanium Magnetic Hub',
    name: 'MagDock Pro Titanium Magnetic Hub',
    basePrice: 8499,
    salePrice: 8499,
    price: 8499,
    thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop' }],
  };

  const flagshipImg = (flagshipProduct as any).thumbnailUrl || (flagshipProduct as any).images?.[0]?.url || (flagshipProduct as any).images?.[0] || '';
  const companionImg = (companionProduct as any).thumbnailUrl || (companionProduct as any).images?.[0]?.url || (companionProduct as any).images?.[0] || '';

  const flagshipPrice = (flagshipProduct as any).salePrice || (flagshipProduct as any).basePrice || (flagshipProduct as any).price || 0;
  const companionPrice = (companionProduct as any).salePrice || (companionProduct as any).basePrice || (companionProduct as any).price || 0;

  const flagshipTitle = (flagshipProduct as any).title || (flagshipProduct as any).name || '';
  const companionTitle = (companionProduct as any).title || (companionProduct as any).name || '';

  return (
    <section className="hidden md:block relative w-full max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 overflow-hidden">
      <div className="absolute -top-32 right-10 w-[38rem] h-[38rem] bg-[#e3dfff]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/4 w-[28rem] h-[28rem] bg-[#ffdad2]/50 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-5 flex flex-col items-start z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] mb-5">
            <span className="w-2 h-2 rounded-full bg-[#fd6a49]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Editorial Drop № 24 · Autumn Edition
            </span>
          </div>

          <h1 className="hidden sm:block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#131b2e] tracking-tight leading-[1.1] mb-4">
            Find something you&apos;ll love<span className="text-[#fd6a49]">.</span>
          </h1>

          <p className="text-sm sm:text-lg text-[#464556] max-w-lg mb-6 sm:mb-8 leading-relaxed">
            Intelligent hardware, quiet desk objects, and tactile living pieces engineered for mindful daily rituals.
          </p>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link href="/drops">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              >
                Explore Curated Drops
              </Button>
            </Link>
            <Link href="/category?cat=audio">
              <Button
                variant="tonal"
                size="lg"
                leftIcon={<Volume2 className="w-4 h-4 text-[#412ce7]" />}
              >
                Meet the Audio Lab
              </Button>
            </Link>
          </div>

          <div className="mt-10 pt-6 flex items-center gap-6 sm:gap-8 border-t border-[#e2e7ff] w-full">
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block">100%</span>
              <span className="text-xs text-[#464556]">Calibrated Touch</span>
            </div>
            <div className="w-px h-8 bg-[#e2e7ff]" />
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block">4.92 / 5</span>
              <span className="text-xs text-[#464556]">Discerning Collectors</span>
            </div>
            <div className="w-px h-8 bg-[#e2e7ff]" />
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-[#131b2e] block">2-Year</span>
              <span className="text-xs text-[#464556]">Hardware Warranty</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 relative grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
          <div className="sm:col-span-8 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group border border-[#e2e7ff]">
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#eaedff]">
              <img
                src={flagshipImg}
                alt={flagshipTitle}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            <div className="absolute bottom-3 inset-x-3 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md flex items-center justify-between border border-[#e2e7ff]/80">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fd6a49]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#464556]">
                    Desktop Flagship
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#131b2e] truncate">
                  {flagshipTitle}
                </h3>
                <p className="text-sm font-extrabold text-[#412ce7] mt-0.5">
                  ₹{Number(flagshipPrice).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#412ce7] text-[10px] font-bold uppercase">
                  In Stock
                </span>
                <Link
                  href={`/product/${flagshipProduct.id}`}
                  className="mt-2 text-[#412ce7] text-xs font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col justify-between gap-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-3.5 flex flex-col group h-full border border-[#e2e7ff]">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#f2f3ff] mb-2.5 relative">
                <img
                  src={companionImg}
                  alt={companionTitle}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[#131b2e] text-[10px] font-bold">
                  15W MagFast
                </div>
              </div>
              <div className="mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#777588]">
                  Charging Hub
                </span>
                <h4 className="text-xs font-bold text-[#131b2e] truncate mt-0.5">
                  {companionTitle}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-extrabold text-[#131b2e]">
                    ₹{Number(companionPrice).toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/product/${companionProduct.id}`}
                    className="w-7 h-7 rounded-full bg-[#eaedff] hover:bg-[#412ce7] text-[#412ce7] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#eaedff] rounded-2xl p-4 flex items-center gap-3 border border-[#dae2fd]">
              <div className="w-9 h-9 rounded-xl bg-[#412ce7] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#131b2e]">Curation Protocol</h5>
                <p className="text-[11px] text-[#464556] truncate">
                  Zero plastic packing. Certified CNC milling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
