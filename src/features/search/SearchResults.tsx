'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface SearchResultsProps {
  products: Product[];
  query: string;
  onClearSearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  query,
  onClearSearch,
}) => {
  if (products.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title={`No Architectural Pieces Found for "${query}"`}
          description="Try searching for materials like 'leather', 'aluminum', or broader categories like 'footwear' or 'workspace'."
          actionLabel="Clear Search Query"
          onActionClick={onClearSearch}
        />
      </div>
    );
  }

  return (
    <div className="py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#777588]">
          Found {products.length} {products.length === 1 ? 'Curated Match' : 'Curated Matches'}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
