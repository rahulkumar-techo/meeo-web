'use client';

import React from 'react';
import { X, LayoutGrid, Grid3X3, List, SearchX, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '@/types/filter';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface ActiveFilterBarProps {
  filters: FilterState;
  onRemoveFilter: <K extends keyof FilterState>(key: K, value?: string) => void;
  onClearAll: () => void;
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: 'grid3' | 'grid4' | 'list') => void;
  isDemoEmpty: boolean;
  onToggleDemoEmpty: () => void;
  onOpenMobileFilters?: () => void;
}

export const ActiveFilterBar: React.FC<ActiveFilterBarProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  onSortChange,
  onViewModeChange,
  isDemoEmpty,
  onToggleDemoEmpty,
  onOpenMobileFilters,
}) => {
  const { isVisible } = useScrollDirection();

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.materials.length > 0 ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.priceRange[1] < 30000;

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-md py-3 px-4 sm:px-6 rounded-2xl border border-[#e2e7ff] shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6 sticky z-20 transition-all duration-300 ease-in-out ${
        isVisible ? 'top-[116px]' : 'top-3 shadow-md'
      }`}
    >
      {/* Left: Active Badges Strip */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-[#777588]">
          Active:
        </span>

        {filters.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onRemoveFilter('sizes', s)}
            className="h-7 pl-2.5 pr-1.5 rounded-full bg-[#eaedff] text-[#131b2e] text-xs font-semibold flex items-center gap-1 hover:bg-[#dae2fd] transition-colors"
          >
            <span>Size {s}</span>
            <X className="w-3.5 h-3.5 text-[#777588] hover:text-[#ba1a1a]" />
          </button>
        ))}

        {filters.materials.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onRemoveFilter('materials', m)}
            className="h-7 pl-2.5 pr-1.5 rounded-full bg-[#eaedff] text-[#131b2e] text-xs font-semibold flex items-center gap-1 hover:bg-[#dae2fd] transition-colors"
          >
            <span>{m}</span>
            <X className="w-3.5 h-3.5 text-[#777588] hover:text-[#ba1a1a]" />
          </button>
        ))}

        {filters.priceRange[1] < 30000 && (
          <button
            type="button"
            onClick={() => onRemoveFilter('priceRange')}
            className="h-7 pl-2.5 pr-1.5 rounded-full bg-[#eaedff] text-[#131b2e] text-xs font-semibold flex items-center gap-1 hover:bg-[#dae2fd] transition-colors"
          >
            <span>Under ₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
            <X className="w-3.5 h-3.5 text-[#777588] hover:text-[#ba1a1a]" />
          </button>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-[#ae3115] font-bold hover:underline ml-1"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Right: Controls (Sort, Demo Toggle, Layout) */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
        {/* Mobile Filter Sheet Trigger */}
        {onOpenMobileFilters && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden h-8 px-3 rounded-lg bg-[#412ce7] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-[#fd6a49] text-white text-[10px] font-extrabold flex items-center justify-center">
                !
              </span>
            )}
          </button>
        )}

        {/* Demo Empty View Switch */}
        <button
          type="button"
          onClick={onToggleDemoEmpty}
          className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors hidden sm:flex ${
            isDemoEmpty
              ? 'bg-[#ba1a1a] text-white'
              : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#412ce7]'
          }`}
        >
          <SearchX className="w-3.5 h-3.5" />
          <span>{isDemoEmpty ? 'Exit Demo' : 'Demo Empty'}</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-[#f2f3ff] px-2.5 sm:px-3 h-8 rounded-lg text-xs font-semibold text-[#131b2e]">
          <span className="text-[#777588] hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-[#131b2e] font-bold outline-none cursor-pointer"
          >
            <option value="curated">Curated / Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Customer Rating</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* View Mode Density Toggles */}
        <div className="hidden sm:flex items-center gap-0.5 bg-[#f2f3ff] p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => onViewModeChange('grid3')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
              filters.viewMode === 'grid3'
                ? 'bg-white text-[#412ce7] shadow-xs'
                : 'text-[#777588] hover:text-[#131b2e]'
            }`}
            title="3-column grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid4')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
              filters.viewMode === 'grid4'
                ? 'bg-white text-[#412ce7] shadow-xs'
                : 'text-[#777588] hover:text-[#131b2e]'
            }`}
            title="4-column dense grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
              filters.viewMode === 'list'
                ? 'bg-white text-[#412ce7] shadow-xs'
                : 'text-[#777588] hover:text-[#131b2e]'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
