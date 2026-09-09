'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FilterState } from '@/types/filter';

interface SearchFilterContextType {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const DEFAULT_FILTERS: FilterState = {
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
  viewMode: 'grid3',
};

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

export const SearchFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.subCategory && filters.subCategory !== 'All' ? 1 : 0) +
    filters.materials.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 30000 ? 1 : 0);

  return (
    <SearchFilterContext.Provider
      value={{
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        activeFilterCount,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
};
