'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryHero } from '@/features/catalog/CategoryHero';
import { FilterSidebar } from '@/features/catalog/FilterSidebar';
import { ActiveFilterBar } from '@/features/catalog/ActiveFilterBar';
import { CatalogGrid } from '@/features/catalog/CatalogGrid';
import { FilterState } from '@/types/filter';
import { Drawer } from '@/components/ui/Drawer';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/config/seo';
import { useCategoriesQuery, useProductsQuery } from '@/hooks/catalog/useCatalog';
import { extractArray, normalizeProducts } from '@/lib/apiHelper';
import type { Product } from '@/types/product';

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

  const { data: categoriesData } = useCategoriesQuery();
  const categories = extractArray(categoriesData);

  const { data: productsData } = useProductsQuery({
    categorySlug: filters.category !== 'all' ? filters.category : undefined,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 30000 ? filters.priceRange[1] : undefined,
    inStock: filters.inStockOnly ? true : undefined,
  });

  const rawProducts = normalizeProducts(productsData);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat, subCategory: 'All' }));
    }
  }, [searchParams]);

  const currentCategory = useMemo(() => {
    const found = categories.find((c: any) => c.slug === filters.category);
    if (found) {
      return {
        id: found.id || found.slug,
        slug: found.slug,
        name: found.name,
        description: found.description || 'Curated design hardware and living objects.',
        subcategories: [],
      };
    }
    return {
      id: 'all',
      slug: 'all',
      name: 'Full Catalog',
      description: 'Tactile stoneware, ambient luminescent lamps, and sculptural objects for focused rituals.',
      subcategories: [],
    };
  }, [categories, filters.category]);

  const filteredProducts = useMemo(() => {
    if (isDemoEmpty) return [];

    return rawProducts.filter((product) => {
      // On Sale filter
      if (filters.onSaleOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (filters.sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (filters.sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [rawProducts, filters, isDemoEmpty]);

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
      <CategoryHero
        category={currentCategory}
        subCategory={filters.subCategory || 'All'}
        onSubCategoryChange={(sub) => handleFilterChange('subCategory', sub)}
        totalResults={filteredProducts.length}
      />

      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

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
