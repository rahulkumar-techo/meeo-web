import { MeeoProduct } from './meeoData';

export interface CatalogFilterState {
  category: string;
  brands: string[];
  priceRange: [number, number];
  onlyDeals: boolean;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
}

export interface CatalogItem extends MeeoProduct {
  brand: string;
  isDeal?: boolean;
  isNewArrival?: boolean;
  gender?: 'men' | 'women' | 'unisex';
}

/**
 * Empty catalog products array - all items are fetched live from the backend API.
 */
export const ALL_URBAN_PRODUCTS: CatalogItem[] = [];
export const ALL_MEEO_PRODUCTS: CatalogItem[] = ALL_URBAN_PRODUCTS;

export const FILTER_BRANDS: string[] = ['All'];

export const FILTER_CATEGORIES = [
  { key: 'all', label: 'All Items' },
];
