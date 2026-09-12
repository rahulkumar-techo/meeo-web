/**
 * @file searchService.ts
 * @description Full-text search, live autocomplete suggestions, dynamic facets, and curated discovery feeds.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  SearchParams,
  SearchResultsData,
  SearchSuggestionsData,
  SearchFacetsData,
  DiscoveryItem,
} from '@/types/search/search.types';

export const searchService = {
  /**
   * Execute full-text multi-attribute product search with pagination.
   */
  async search(params: SearchParams): Promise<ApiResponse<SearchResultsData>> {
    const response = await apiClient.get<ApiResponse<SearchResultsData>>('/search', {
      params,
    });
    return response.data;
  },

  /**
   * Fetch live autocomplete suggestions for search dropdown.
   */
  async getSuggestions(query: string): Promise<ApiResponse<SearchSuggestionsData>> {
    const response = await apiClient.get<ApiResponse<SearchSuggestionsData>>(
      '/search/suggestions',
      {
        params: { q: query },
      }
    );
    return response.data;
  },

  /**
   * Fetch contextual search facets (price boundaries, categories, brands, star ratings).
   */
  async getFacets(query?: string): Promise<ApiResponse<SearchFacetsData>> {
    const response = await apiClient.get<ApiResponse<SearchFacetsData>>('/search/facets', {
      params: query ? { q: query } : undefined,
    });
    return response.data;
  },

  /**
   * Fetch featured promotional spotlight products.
   */
  async getFeatured(): Promise<ApiResponse<DiscoveryItem[]>> {
    const response = await apiClient.get<ApiResponse<DiscoveryItem[]>>('/discovery/featured');
    return response.data;
  },

  /**
   * Fetch high-velocity trending products.
   */
  async getTrending(): Promise<ApiResponse<DiscoveryItem[]>> {
    const response = await apiClient.get<ApiResponse<DiscoveryItem[]>>('/discovery/trending');
    return response.data;
  },

  /**
   * Fetch freshly cataloged new arrivals.
   */
  async getNewArrivals(): Promise<ApiResponse<DiscoveryItem[]>> {
    const response = await apiClient.get<ApiResponse<DiscoveryItem[]>>('/discovery/new-arrivals');
    return response.data;
  },

  /**
   * Fetch contextual related products for PDP cross-selling.
   */
  async getRelated(
    productId: string,
    limit = 4
  ): Promise<ApiResponse<DiscoveryItem[]>> {
    const response = await apiClient.get<ApiResponse<DiscoveryItem[]>>(
      `/discovery/related/${productId}`,
      {
        params: { limit },
      }
    );
    return response.data;
  },
};
