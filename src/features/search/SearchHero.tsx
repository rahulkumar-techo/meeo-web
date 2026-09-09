'use client';

import React from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface SearchHeroProps {
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  query,
  onQueryChange,
  resultCount,
  selectedTag,
  onSelectTag,
}) => {
  const discoveryTags = [
    'All Results',
    'Italian Sneaker',
    'Mechanical Keyboards',
    'Wireless Charging',
    'Acoustic Lab',
    'Ceramic Vessels',
    'Waxed Canvas',
  ];

  return (
    <section className="w-full bg-[#f2f3ff]/80 border-b border-[#e2e7ff] py-8">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#fd6a49]" />
            <span>Intelligent Omni-Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">
            Search Discovery Matrix<span className="text-[#fd6a49]">.</span>
          </h1>
          <p className="text-sm text-[#464556] mt-1">
            Predictive semantic discovery across silhouettes, materials, acoustic profiles, and hardware.
          </p>
        </div>

        {/* Large Omni-Search Input */}
        <div className="relative  flex items-center w-full max-w-2xl bg-white rounded-2xl border border-[#c7c4d9] focus-within:border-[#412ce7] focus-within:ring-2 focus-within:ring-[#412ce7]/20 shadow-sm transition-all px-4 py-3">
          <Search className="w-5 h-5 text-[#412ce7] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by keyword, material, or design feature..."
            className="w-full text-base text-[#131b2e] placeholder:text-[#777588] outline-none font-medium bg-transparent"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="p-1 rounded-full text-[#777588] hover:text-[#131b2e] hover:bg-[#f2f3ff]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Discovery Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {discoveryTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#412ce7] text-white shadow-sm'
                    : 'bg-white hover:bg-[#eaedff] text-[#131b2e] border border-[#e2e7ff]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
