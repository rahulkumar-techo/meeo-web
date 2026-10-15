'use client';

/**
 * @file UrbanNestCategories.tsx
 * @description Dynamic category showcase fetching live categories from the backend API.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useCategoriesQuery } from '@/hooks/catalog/useCatalog';

export const UrbanNestCategories: React.FC = () => {
  const { data: apiCategoriesRes, isLoading } = useCategoriesQuery(false);

  const apiCategories = apiCategoriesRes?.data || [];
  const categories = apiCategories.map((cat) => ({
    id: cat.id || cat.slug,
    label: cat.name,
    slug: cat.slug,
    count: cat.productCount ? `${cat.productCount} Items` : undefined,
    image: cat.imageUrl || '/assets/urbannest/cat-lifestyle.jpg',
    href: `/category?cat=${encodeURIComponent(cat.slug || cat.id)}`,
  }));

  // Do not render section if there are no categories and not loading
  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF8F5] pb-14 sm:pb-20">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2621] font-normal tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-[#786C64] mt-1.5 font-sans">
              Explore live categories and find what suits your style.
            </p>
          </div>
          <Link
            href="/category"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C5338] hover:text-[#6E3F29] group transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`cat-skel-${idx}`}
                  className="flex flex-col bg-[#F3EFEA] rounded-2xl overflow-hidden border border-[#E8E2DA] animate-pulse"
                >
                  <div className="w-full aspect-square bg-[#E8E2DA]/60" />
                  <div className="p-3 bg-white border-t border-[#E8E2DA]/60 space-y-2">
                    <div className="h-3.5 bg-[#E8E2DA] rounded w-3/4" />
                    <div className="h-2.5 bg-[#E8E2DA]/60 rounded w-1/2" />
                  </div>
                </div>
              ))
            : categories.map((category, idx) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group relative flex flex-col bg-[#F3EFEA] rounded-2xl overflow-hidden border border-[#E8E2DA] transition-all duration-300 hover:shadow-md hover:border-[#8C5338]/40"
                >
                  {/* Tile Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden bg-[#F3EFEA] p-2 flex items-center justify-center">
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      loading="eager"
                      priority={idx < 4}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Bottom Label & Arrow Button Bar */}
                  <div className="p-3 sm:p-3.5 flex items-center justify-between bg-white border-t border-[#E8E2DA]/60">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-semibold text-[#2D2621] group-hover:text-[#8C5338] transition-colors line-clamp-1">
                        {category.label}
                      </span>
                      {category.count && (
                        <span className="text-[10px] text-[#786C64]">
                          {category.count}
                        </span>
                      )}
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#F3EFEA] group-hover:bg-[#8C5338] text-[#2D2621] group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
        </div>

      </div>
    </section>
  );
};
