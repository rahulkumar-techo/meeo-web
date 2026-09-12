'use client';

/**
 * @file useSearch.ts
 * @description Search queries, debounced autocomplete suggestions, facets, and discovery feed hooks.
 */

import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search/searchService';
import { queryKeys } from '@/hooks/queryKeys';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  SearchParams,
  SearchResultsData,
  SearchSuggestionsData,
  SearchFacetsData,
  DiscoveryItem,
} from '@/types/search/search.types';

/**
 * Execute full-text multi-attribute search query.
 */
export function useSearchQuery(params: SearchParams) {
  return useQuery<ApiResponse<SearchResultsData>>({
    queryKey: queryKeys.search.results(params),
    queryFn: () => searchService.search(params),
    enabled: Boolean(params.q || params.category || params.brand),
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Fetch live search autocomplete dropdown suggestions.
 */
export function useSearchSuggestionsQuery(query: string) {
  const trimmed = query.trim();

  return useQuery<ApiResponse<SearchSuggestionsData>>({
    queryKey: queryKeys.search.suggestions(trimmed),
    queryFn: () => searchService.getSuggestions(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 60 * 1000,
  });
}

/**
 * Fetch dynamic price range, category, and brand facet counts.
 */
export function useSearchFacetsQuery(query?: string) {
  return useQuery<ApiResponse<SearchFacetsData>>({
    queryKey: queryKeys.search.facets(query),
    queryFn: () => searchService.getFacets(query),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured spotlight promotional products.
 */
export function useFeaturedProductsQuery() {
  return useQuery<ApiResponse<DiscoveryItem[]>>({
    queryKey: queryKeys.discovery.featured(),
    queryFn: () => searchService.getFeatured(),
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch high-velocity trending products.
 */
export function useTrendingProductsQuery() {
  return useQuery<ApiResponse<DiscoveryItem[]>>({
    queryKey: queryKeys.discovery.trending(),
    queryFn: () => searchService.getTrending(),
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch freshly added catalog products.
 */
export function useNewArrivalsQuery() {
  return useQuery<ApiResponse<DiscoveryItem[]>>({
    queryKey: queryKeys.discovery.newArrivals(),
    queryFn: () => searchService.getNewArrivals(),
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch contextual related products for PDP cross-sell recommendations.
 */
export function useRelatedProductsQuery(productId: string, limit = 4) {
  return useQuery<ApiResponse<DiscoveryItem[]>>({
    queryKey: queryKeys.discovery.related(productId),
    queryFn: () => searchService.getRelated(productId, limit),
    enabled: Boolean(productId),
    staleTime: 15 * 60 * 1000,
  });
}
