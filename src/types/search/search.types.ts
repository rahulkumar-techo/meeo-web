/**
 * @file search.types.ts
 * @description Full-text search, live autocomplete suggestions, contextual facets, and discovery feed types.
 */

import { PaginationMeta, PaginationParams } from '../common/api.types';

export interface SearchParams extends PaginationParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'createdAt' | 'popularity' | string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  brandName?: string;
  categoryName?: string;
  thumbnailUrl: string;
}

export interface SearchResultsData {
  query: string;
  totalResults: number;
  items: SearchResultItem[];
  pagination: PaginationMeta;
}

export interface SuggestionProduct {
  id: string;
  title: string;
  slug: string;
}

export interface SuggestionCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SuggestionBrand {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SearchSuggestionsData {
  products: SuggestionProduct[];
  categories: SuggestionCategory[];
  brands: SuggestionBrand[];
}

export interface FacetPriceRange {
  min: number;
  max: number;
}

export interface FacetCategory {
  id: string;
  name: string;
  count: number;
}

export interface FacetBrand {
  id: string;
  name: string;
  count: number;
}

export interface FacetRating {
  stars: number;
  count: number;
}

export interface SearchFacetsData {
  priceRange: FacetPriceRange;
  categories: FacetCategory[];
  brands: FacetBrand[];
  ratings: FacetRating[];
}

export interface DiscoveryItem {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  thumbnailUrl: string;
  rating?: number;
  reviewCount?: number;
  categoryName?: string;
  brandName?: string;
  isNew?: boolean;
}
