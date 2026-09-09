'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface CatalogGridProps {
  products: Product[];
  viewMode: 'grid3' | 'grid4' | 'list';
  onResetFilters: () => void;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  products,
  viewMode,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No Curated Pieces Match Your Active Filters"
        description="Try relaxing your material, size, or price constraints to view other architectural editions in the Meeo vault."
        actionLabel="Reset All Filters"
        onActionClick={onResetFilters}
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="list" />
        ))}
      </div>
    );
  }

  const gridClass =
    viewMode === 'grid4'
      ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6'
      : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6';

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
