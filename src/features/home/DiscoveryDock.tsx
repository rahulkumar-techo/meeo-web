'use client';

import React from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface DiscoveryDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DiscoveryDock: React.FC<DiscoveryDockProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { isVisible } = useScrollDirection();

  const tabs = [
    { id: 'trending', label: '⚡ Trending Drops' },
    { id: 'new', label: '✨ New Arrivals' },
    { id: 'best_sellers', label: '🏆 Best Sellers' },
    { id: 'curated_deals', label: '🏷️ Curated Deals' },
    { id: 'recommended', label: '🎯 Recommended' },
    { id: 'archival', label: '📦 Archival Editions' },
  ];

  return (
    <section
      className={`hidden md:block w-full bg-transparent border-b border-[#e2e7ff] dark:border-[#232d44] py-2.5 sm:py-3 sticky z-30 transition-all duration-300 ease-in-out ${
        isVisible ? 'top-[108px]' : 'top-0'
      }`}
    >
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Filter Chips Horizontal Scroll */}
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth pr-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#412ce7] text-white shadow-sm'
                      : 'bg-white hover:bg-[#eaedff] text-[#131b2e] dark:bg-[#182032] dark:hover:bg-[#26314c] dark:text-[#f1f3fa] border border-[#e2e7ff] dark:border-[#232d44]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Refine Action */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/category"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff] px-3 py-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-[#182032] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Full Catalog Refine</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
