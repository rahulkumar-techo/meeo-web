'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { FilterState } from '@/types/filter';
import { CATEGORIES } from '@/data/categories';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const sizes = ['EU 40 / US 7', 'EU 41 / US 8', 'EU 42 / US 9', 'EU 43 / US 10', 'EU 44 / US 11', 'EU 45 / US 12'];
  const materials = ['Italian Nappa Leather', '6063 Aluminum', 'Waxed Canvas', 'Natural Gum Rubber', 'Terracotta', 'Beryllium'];

  const toggleArrayItem = (list: string[], item: string) => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  return (
    <aside className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#412ce7]" />
          <h3 className="text-sm font-bold text-[#131b2e]">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#777588] hover:text-[#412ce7] font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#777588] mb-3">
          Category
        </h4>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange('category', cat.slug)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-[#eaedff] text-[#412ce7] shadow-xs translate-x-1'
                    : 'text-[#464556] hover:bg-[#faf8ff] hover:text-[#131b2e]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] text-[#777588]">({cat.itemCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider using Material UI */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#777588]">
            Price Range
          </h4>
          <span className="text-xs font-bold text-[#412ce7]">
            Up to ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <div className="px-1.5">
          <Slider
            min={2000}
            max={30000}
            step={1000}
            value={filters.priceRange[1]}
            onChange={(_, val) => onFilterChange('priceRange', [0, val as number])}
            sx={{
              color: '#412ce7',
              '& .MuiSlider-thumb': {
                boxShadow: '0 2px 8px rgba(65, 44, 231, 0.3)',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(65, 44, 231, 0.16)',
                },
              },
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-[#777588]">
          <span>₹2,000</span>
          <span>₹30,000+</span>
        </div>
      </div>

      {/* Silhouette & Shoe Size */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#777588] mb-2.5">
          Sizes
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {sizes.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onFilterChange('sizes', toggleArrayItem(filters.sizes, size))}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-[#412ce7] text-white border-[#412ce7] shadow-xs scale-[1.02]'
                    : 'bg-white text-[#464556] border-[#e2e7ff] hover:border-[#c7c4d9]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials using MUI Checkboxes */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#777588] mb-1">
          Authentic Materials
        </h4>
        <div className="flex flex-col">
          {materials.map((mat) => {
            const isChecked = filters.materials.includes(mat);
            return (
              <FormControlLabel
                key={mat}
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={() => onFilterChange('materials', toggleArrayItem(filters.materials, mat))}
                    size="small"
                    sx={{
                      color: '#c7c4d9',
                      '&.Mui-checked': { color: '#412ce7' },
                    }}
                  />
                }
                label={<span className="text-xs text-[#464556] font-medium">{mat}</span>}
              />
            );
          })}
        </div>
      </div>

      {/* Availability Toggles using MUI Switch */}
      <div className="pt-3 border-t border-[#e2e7ff] flex flex-col gap-1">
        <FormControlLabel
          control={
            <Switch
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
              size="small"
            />
          }
          label={<span className="text-xs text-[#131b2e] font-semibold">In Stock Only</span>}
        />
        <FormControlLabel
          control={
            <Switch
              checked={filters.onSaleOnly}
              onChange={(e) => onFilterChange('onSaleOnly', e.target.checked)}
              size="small"
            />
          }
          label={<span className="text-xs text-[#131b2e] font-semibold">Studio Deals Only</span>}
        />
      </div>
    </aside>
  );
};
