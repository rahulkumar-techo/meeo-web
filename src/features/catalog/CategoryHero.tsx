'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface CategoryHeroItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  subcategories?: string[];
}

interface CategoryHeroProps {
  category: CategoryHeroItem;
  subCategory: string;
  onSubCategoryChange: (sub: string) => void;
  totalResults: number;
}

export const CategoryHero: React.FC<CategoryHeroProps> = ({
  category,
  subCategory,
  onSubCategoryChange,
  totalResults,
}) => {
  const subcategories = category.subcategories || [];

  return (
    <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] pb-6 pt-4">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#777588] mb-4">
          <Link href="/" className="hover:text-[#412ce7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/category" className="hover:text-[#412ce7] transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#412ce7] font-semibold">{category.name}</span>
        </nav>

        {/* Hero Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <span>Studio Edition</span>
              <span className="w-1 h-1 rounded-full bg-[#fd6a49]" />
              <span>Autumn / Winter Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">
              {category.name}
              <span className="text-[#fd6a49]">.</span>
            </h1>
            <p className="text-sm text-[#464556] mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end shrink-0">
            <span className="text-base font-bold text-[#131b2e]">
              {totalResults} Curated Styles
            </span>
            <span className="text-xs text-[#777588]">Hand-inspected · Zero break-in period</span>
          </div>
        </div>

        {/* Subcategory Pills */}
        {subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            {subcategories.map((sub) => {
              const isActive = subCategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSubCategoryChange(sub)}
                  className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#412ce7] text-white shadow-sm'
                      : 'bg-white hover:bg-[#eaedff] text-[#131b2e] border border-[#e2e7ff]'
                  }`}
                >
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
