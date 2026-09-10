'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react';
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
    'Nordic Wool Desk Mat',
    'Titanium Bolt-Action Pen',
  ];

  // Sync state when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      setLocalQuery(searchQuery || '');
    }
  }, [isSearchModalOpen, searchQuery]);

  const filteredResults = useMemo(() => {
    if (!localQuery.trim()) return [];
    const q = localQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
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
    <Modal
      isOpen={isSearchModalOpen}
      onClose={closeSearchModal}
      maxWidth="2xl"
      position="top"
      fullScreenOnMobile={true}
    >
      <div className="flex flex-col h-full gap-4">
        {/* Search Input Bar (With Mobile Back Button) */}
        <div className="relative flex items-center w-full border-b border-[#e2e7ff] dark:border-[#28334d] pb-3 pt-1 sm:pt-0">
          {/* Mobile Back Arrow Button */}
          <button
            type="button"
            onClick={closeSearchModal}
            className="sm:hidden p-1.5 -ml-1 mr-2 rounded-lg text-[#464556] dark:text-[#a6abbf] hover:bg-[#f2f3ff] dark:hover:bg-[#1e273d] transition-colors cursor-pointer"
            aria-label="Close Search"
          >
            <ArrowLeft className="w-5 h-5 text-[#131b2e] dark:text-white" />
          </button>

          {/* Desktop Search Icon */}
          <Search className="hidden sm:block w-5 h-5 text-[#412ce7] dark:text-[#685aff] shrink-0 mr-3" />

          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, brands, materials... (Press Enter)"
            autoFocus
            className="w-full text-base sm:text-lg font-medium text-[#131b2e] dark:text-white placeholder:text-[#777588] outline-none bg-transparent"
          />

          {localQuery ? (
            <button
              type="button"
              onClick={() => setLocalQuery('')}
              className="p-1.5 text-[#777588] hover:text-[#131b2e] dark:hover:text-white rounded-full hover:bg-[#f2f3ff] dark:hover:bg-[#1e273d] cursor-pointer"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={closeSearchModal}
              className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[11px] font-bold"
            >
              ESC
            </button>
          )}
        </div>

        {/* Live Search Results */}
        {filteredResults.length > 0 ? (
          <div className="flex flex-col flex-1 gap-2 pt-1 overflow-y-auto overscroll-contain">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf]">
              Matching Catalog Objects ({filteredResults.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={closeSearchModal}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-[#e2e7ff] dark:border-[#28334d] hover:border-[#412ce7]/40 hover:bg-[#faf8ff] dark:hover:bg-[#182032] transition-all group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#f4f5f8] dark:bg-[#181d28] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs sm:text-sm font-bold text-[#131b2e] dark:text-white group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] truncate">
                      {product.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-[#131b2e] dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-[#777588] dark:text-[#a6abbf] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#777588] group-hover:text-[#412ce7] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleSelectQuery(localQuery)}
              className="w-full py-3 mt-3 bg-[#412ce7] hover:bg-[#5b4dff] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <span>View all search results for &ldquo;{localQuery}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Trending & Discovery Shortcuts */
          <div className="flex flex-col flex-1 gap-4 pt-2 overflow-y-auto overscroll-contain">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#fd6a49]" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectQuery(term)}
                    className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] dark:bg-[#182032] hover:bg-[#eaedff] dark:hover:bg-[#1e273d] text-xs font-semibold text-[#131b2e] dark:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3 h-3 text-[#777588]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[#e2e7ff] dark:border-[#28334d] flex items-center justify-between text-xs text-[#777588] dark:text-[#a6abbf]">
              <span className="hidden sm:inline">Tip: Press <kbd className="px-1.5 py-0.5 bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] rounded font-bold">Esc</kbd> to exit</span>
              <Link
                href="/category"
                onClick={closeSearchModal}
                className="text-[#412ce7] dark:text-[#685aff] font-semibold hover:underline"
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
