'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useSearchFilter } from '@/context/SearchFilterContext';
import { MOCK_PRODUCTS } from '@/data/products';

export const QuickSearchModal: React.FC = () => {
  const router = useRouter();
  const { isSearchModalOpen, closeSearchModal, searchQuery, setSearchQuery } = useSearchFilter();
  const [localQuery, setLocalQuery] = useState('');

  const trendingSearches = [
    'Aethel-01 Italian Sneaker',
    'Apex Studio Tactile 75',
    'MagDock Pro Fast Wireless',
    'Matte ANC Headphones',
    'Handcrafted Leather Derby',
    'Solis Ceramic Vessel',
  ];

  const filteredResults = useMemo(() => {
    if (!localQuery.trim()) return [];
    const q = localQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [localQuery]);

  const handleSelectQuery = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    closeSearchModal();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localQuery.trim()) {
      handleSelectQuery(localQuery);
    }
  };

  return (
    <Modal isOpen={isSearchModalOpen} onClose={closeSearchModal} maxWidth="2xl" position="top">
      <div className="flex flex-col gap-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center w-full border-b border-[#e2e7ff] pb-3">
          <Search className="w-5 h-5 text-[#412ce7] shrink-0 mr-3" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, materials, silhouettes... (Press Enter)"
            autoFocus
            className="w-full text-base font-medium text-[#131b2e] placeholder:text-[#777588] outline-none bg-transparent"
          />
          {localQuery && (
            <button
              onClick={() => setLocalQuery('')}
              className="p-1 text-[#777588] hover:text-[#131b2e] rounded-full hover:bg-[#f2f3ff]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Results */}
        {filteredResults.length > 0 ? (
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777588]">
              Matching Products ({filteredResults.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={closeSearchModal}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-[#e2e7ff] hover:border-[#412ce7]/40 hover:bg-[#faf8ff] transition-all group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#f2f3ff]"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[#131b2e] group-hover:text-[#412ce7] truncate">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-[#777588] mt-0.5">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#777588] group-hover:text-[#412ce7] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleSelectQuery(localQuery)}
              className="w-full py-2.5 mt-2 bg-[#eaedff] hover:bg-[#dae2fd] text-[#412ce7] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>View all search results for &ldquo;{localQuery}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Trending & Discovery Shortcuts */
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#777588] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fd6a49]" />
                <span>Trending Discovery</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectQuery(term)}
                    className="px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-medium text-[#131b2e] transition-colors flex items-center gap-1.5"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2e7ff] flex items-center justify-between text-xs text-[#777588]">
              <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-[#eaedff] text-[#412ce7] rounded font-bold">Esc</kbd> to exit</span>
              <Link
                href="/category"
                onClick={closeSearchModal}
                className="text-[#412ce7] font-semibold hover:underline"
              >
                Browse Full Catalog →
              </Link>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
