'use client';

/**
 * @file useCatalog.ts
 * @description Catalog browsing, product detail, variant swatches, categories, and brand queries with graceful caching.
 */

import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalog/catalogService';
import { queryKeys } from '@/hooks/queryKeys';
import type { PaginatedResponse, ApiResponse } from '@/types/common/api.types';
import type {
  CatalogProduct,
  CategoryNode,
  BrandSummary,
  ProductConfigurableAttribute,
  ProductListParams,
} from '@/types/catalog/catalog.types';

/**
 * Fetch paginated catalog products with multi-attribute filtering & sorting.
 * Caching: Stale for 5 mins, garbage-collected after 30 mins.
 */
export function useProductsQuery(params?: ProductListParams) {
  return useQuery<PaginatedResponse<CatalogProduct>>({
    queryKey: queryKeys.catalog.products(params),
    queryFn: () => catalogService.getProducts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Fetch single product details by URL slug (PDP).
 * Caching: Stale for 10 mins.
 */
export function useProductBySlugQuery(slug: string) {
  return useQuery<ApiResponse<CatalogProduct>>({
    queryKey: queryKeys.catalog.productBySlug(slug),
    queryFn: () => catalogService.getProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch single product details by UUID.
 */
export function useProductByIdQuery(id: string) {
  return useQuery<ApiResponse<CatalogProduct>>({
    queryKey: queryKeys.catalog.productById(id),
    queryFn: () => catalogService.getProductById(id),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch configurable product attributes matrix (Color swatches, Size pills).
 */
export function useProductAttributesQuery(id: string) {
  return useQuery<ApiResponse<ProductConfigurableAttribute[]>>({
    queryKey: queryKeys.catalog.productAttributes(id),
    queryFn: () => catalogService.getProductAttributes(id),
    enabled: Boolean(id),
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch full category tree hierarchy for navigation mega-menus.
 * Caching: Stale for 30 mins.
 */
export function useCategoriesQuery(tree = true) {
  return useQuery<ApiResponse<CategoryNode[]>>({
    queryKey: queryKeys.catalog.categories(tree),
    queryFn: () => catalogService.getCategories(tree),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Fetch active brands list with logos and product counts.
 * Caching: Stale for 30 mins.
 */
export function useBrandsQuery() {
  return useQuery<ApiResponse<BrandSummary[]>>({
    queryKey: queryKeys.catalog.brands(),
    queryFn: () => catalogService.getBrands(),
    staleTime: 30 * 60 * 1000,
  });
}
