'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchHero } from '@/features/search/SearchHero';
import { SearchResults } from '@/features/search/SearchResults';
import { MOCK_PRODUCTS } from '@/data/products';

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

  const filteredProducts = useMemo(() => {
    let list = MOCK_PRODUCTS;

    if (selectedTag !== 'All Results') {
      const tagQuery = selectedTag.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(tagQuery) ||
          p.categoryLabel.toLowerCase().includes(tagQuery) ||
          p.materials?.some((m) => m.toLowerCase().includes(tagQuery)) ||
          p.tags.some((t) => t.toLowerCase().includes(tagQuery))
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materials?.some((m) => m.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [query, selectedTag]);

  return (
    <div className="flex flex-col w-full pb-16">
      <SearchHero
        query={query}
        onQueryChange={setQuery}
        resultCount={filteredProducts.length}
        selectedTag={selectedTag}
        onSelectTag={(t) => {
          setSelectedTag(t);
          if (t === 'All Results') setQuery('');
        }}
      />

      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SearchResults
          products={filteredProducts}
          query={query || selectedTag}
          onClearSearch={() => {
            setQuery('');
            setSelectedTag('All Results');
          }}
        />
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
