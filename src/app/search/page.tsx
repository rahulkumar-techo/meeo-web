'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchHero } from '@/features/search/SearchHero';
import { SearchResults } from '@/features/search/SearchResults';
import { useProductsQuery } from '@/hooks/catalog/useCatalog';
import { normalizeProducts } from '@/lib/apiHelper';
import type { Product } from '@/types/product';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [selectedTag, setSelectedTag] = useState('All Results');

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [queryParam]);

  const activeSearch = query || (selectedTag !== 'All Results' ? selectedTag : '');

  const { data: productsData, isLoading } = useProductsQuery({
    search: activeSearch,
  });

  const productsList = normalizeProducts(productsData);

  return (
    <div className="flex flex-col w-full pb-16">
      <SearchHero
        query={query}
        onQueryChange={setQuery}
        resultCount={productsList.length}
        selectedTag={selectedTag}
        onSelectTag={(t) => {
          setSelectedTag(t);
          if (t === 'All Results') setQuery('');
        }}
      />

      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#777588]">Searching catalog...</div>
        ) : (
          <SearchResults
            products={productsList}
            query={query || selectedTag}
            onClearSearch={() => {
              setQuery('');
              setSelectedTag('All Results');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
