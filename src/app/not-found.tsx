'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Compass, ArrowLeft, Search } from 'lucide-react';
import { useSearchFilter } from '@/context/SearchFilterContext';

/**
 * Custom 404 Not Found Page
 * Provides a branded, helpful fallback with direct navigation links
 * and omni-search trigger when a requested route cannot be found.
 */
export default function NotFound() {
  const { openSearchModal } = useSearchFilter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
        {/* Visual Badge */}
        <div className="w-20 h-20 rounded-3xl bg-[#eaedff] dark:bg-[#1e273d] border border-[#dae2fd] dark:border-[#28334d] flex items-center justify-center text-[#412ce7] dark:text-[#685aff] shadow-sm">
          <span className="text-3xl font-extrabold tracking-tighter">404</span>
        </div>

        {/* Headings */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] dark:text-[#f1f3fa] tracking-tight">
            Object or Page Not Found
          </h1>
          <p className="text-sm text-[#464556] dark:text-[#a6abbf] max-w-md">
            The requested destination has been moved, archived into our vaults, or the URL address contains a typo.
          </p>
        </div>

        {/* Action Button Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm mt-2">
          <Link
            href="/"
            className="flex-1 min-w-[140px] h-11 rounded-xl bg-[#412ce7] hover:bg-[#5b4dff] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/category"
            className="flex-1 min-w-[140px] h-11 rounded-xl bg-white dark:bg-[#182032] hover:bg-[#faf8ff] dark:hover:bg-[#26314c] text-[#131b2e] dark:text-[#f1f3fa] border border-[#e2e7ff] dark:border-[#232d44] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Catalog</span>
          </Link>
        </div>

        {/* Secondary Quick Search Trigger */}
        <button
          type="button"
          onClick={openSearchModal}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff] transition-colors cursor-pointer mt-2"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search products and archival drops (⌘K)</span>
        </button>
      </div>
    </div>
  );
}
