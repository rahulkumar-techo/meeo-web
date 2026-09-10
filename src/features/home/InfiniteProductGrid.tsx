'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

interface InfiniteProductGridProps {
  products: Product[];
}

export const InfiniteProductGrid: React.FC<InfiniteProductGridProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');

  const filterTabs = [
    { id: 'all', label: 'All Products' },
    { id: 'deals', label: '🔥 Top Deals' },
    { id: 'under_5k', label: '🏷️ Under ₹5,000' },
    { id: 'footwear', label: '👟 Footwear' },
    { id: 'workspace', label: '💻 Workspace' },
    { id: 'audio', label: '🎧 Audio' },
    { id: 'living', label: '🏠 Home Living' },
    { id: 'top_rated', label: '⭐ Top Rated (4.9+)' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter
    if (selectedCategory === 'deals') {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    } else if (selectedCategory === 'under_5k') {
      list = list.filter((p) => p.price <= 5000);
    } else if (selectedCategory === 'top_rated') {
      list = list.filter((p) => p.rating >= 4.9);
    } else if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  return (
    <section className="w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#e2e7ff] dark:border-[#28334d] mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-2xl font-black text-[#131b2e] dark:text-white tracking-tight">
              Recommended For You
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[10px] font-extrabold uppercase">
              {filteredAndSortedProducts.length} Objects
            </span>
          </div>
          <p className="text-xs text-[#777588] dark:text-[#a6abbf] mt-0.5">
            Verified precision hardware, handcrafted footwear, and acoustic tools.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-[#777588] dark:text-[#a6abbf] hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-3 rounded-lg border border-[#e2e7ff] dark:border-[#28334d] text-xs font-bold text-[#131b2e] dark:text-white outline-none cursor-pointer"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated (4.9+)</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-3 mb-3">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#412ce7] text-white shadow-2xs'
                  : 'text-[#464556] dark:text-[#a6abbf] border border-[#e2e7ff] dark:border-[#28334d] hover:bg-[#eaedff] dark:hover:bg-[#1e273d]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Product Dense Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
