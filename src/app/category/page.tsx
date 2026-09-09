'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryHero } from '@/features/catalog/CategoryHero';
import { FilterSidebar } from '@/features/catalog/FilterSidebar';
import { ActiveFilterBar } from '@/features/catalog/ActiveFilterBar';
import { CatalogGrid } from '@/features/catalog/CatalogGrid';
import { CATEGORIES } from '@/data/categories';
import { MOCK_PRODUCTS } from '@/data/products';
import { FilterState } from '@/types/filter';

import { Drawer } from '@/components/ui/Drawer';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/config/seo';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: initialCat,
    subCategory: 'All',
    priceRange: [0, 30000],
    materials: [],
    sizes: [],
    colors: [],
    inStockOnly: false,
    onSaleOnly: false,
    searchQuery: '',
    sortBy: 'curated',
    viewMode: 'grid3',
  });

  const [isDemoEmpty, setIsDemoEmpty] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat, subCategory: 'All' }));
    }
  }, [searchParams]);

  const currentCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === filters.category) || CATEGORIES[0];
  }, [filters.category]);

  const filteredProducts = useMemo(() => {
    if (isDemoEmpty) return [];

    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Price Range filter
      if (product.price > filters.priceRange[1]) {
        return false;
      }
      // In Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      // On Sale filter
      if (filters.onSaleOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }
      // Materials filter
      if (
        filters.materials.length > 0 &&
        !product.materials?.some((m) => filters.materials.includes(m))
      ) {
        return false;
      }
      // Sizes filter
      if (
        filters.sizes.length > 0 &&
        !product.sizes?.some((s) => filters.sizes.includes(s.size))
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'rating_desc') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0; // Curated
    });
  }, [filters, isDemoEmpty]);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveFilter = <K extends keyof FilterState>(key: K, value?: string) => {
    if (key === 'sizes' && value) {
      setFilters((prev) => ({ ...prev, sizes: prev.sizes.filter((s) => s !== value) }));
    } else if (key === 'materials' && value) {
      setFilters((prev) => ({ ...prev, materials: prev.materials.filter((m) => m !== value) }));
    } else if (key === 'priceRange') {
      setFilters((prev) => ({ ...prev, priceRange: [0, 30000] }));
    }
  };

  const handleResetFilters = () => {
    setIsDemoEmpty(false);
    setFilters({
      category: 'all',
      subCategory: 'All',
      priceRange: [0, 30000],
      materials: [],
      sizes: [],
      colors: [],
      inStockOnly: false,
      onSaleOnly: false,
      searchQuery: '',
      sortBy: 'curated',
      viewMode: filters.viewMode,
    });
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <JsonLd
        schema={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: currentCategory.name, url: `/category?cat=${currentCategory.slug}` },
        ])}
      />
      {/* 1. Category Hero & Breadcrumbs */}
      <CategoryHero
        category={currentCategory}
        subCategory={filters.subCategory || 'All'}
        onSubCategoryChange={(sub) => handleFilterChange('subCategory', sub)}
        totalResults={filteredProducts.length}
      />

      {/* 2. Main Layout: Left Sidebar + Product Grid */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar (3 cols, hidden on mobile/tablet) */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Product Grid Shell (12 cols on mobile, 9 cols on desktop) */}
          <div className="col-span-1 lg:col-span-9 flex flex-col">
            <ActiveFilterBar
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleResetFilters}
              onSortChange={(s) => handleFilterChange('sortBy', s)}
              onViewModeChange={(m) => handleFilterChange('viewMode', m)}
              isDemoEmpty={isDemoEmpty}
              onToggleDemoEmpty={() => setIsDemoEmpty((prev) => !prev)}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            <CatalogGrid
              products={filteredProducts}
              viewMode={filters.viewMode}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      <Drawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Refine Catalog"
        subtitle={`${filteredProducts.length} objects match current specifications`}
        position="left"
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </Drawer>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
