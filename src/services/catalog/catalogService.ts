/**
 * @file catalogService.ts
 * @description Catalog browsing, product listings, SKU variants, attributes matrix, categories, and brands.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse, PaginatedResponse } from '@/types/common/api.types';
import type {
  CatalogProduct,
  CategoryNode,
  BrandSummary,
  ProductConfigurableAttribute,
  ProductListParams,
} from '@/types/catalog/catalog.types';

export const catalogService = {
  /**
   * List products with multi-attribute filtering, category/brand constraints, and sorting.
   */
  async getProducts(
    params?: ProductListParams
  ): Promise<PaginatedResponse<CatalogProduct>> {
    const response = await apiClient.get<PaginatedResponse<CatalogProduct>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * Fetch single product details by URL slug for SEO-friendly PDP routing.
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<CatalogProduct>> {
    const response = await apiClient.get<ApiResponse<CatalogProduct>>(`/products/slug/${slug}`);
    return response.data;
  },

  /**
   * Fetch single product details by UUID.
   */
  async getProductById(id: string): Promise<ApiResponse<CatalogProduct>> {
    const response = await apiClient.get<ApiResponse<CatalogProduct>>(`/products/${id}`);
    return response.data;
  },

  /**
   * Fetch product configurable attributes matrix (Color swatches, Size pills).
   */
  async getProductAttributes(
    id: string
  ): Promise<ApiResponse<ProductConfigurableAttribute[]>> {
    const response = await apiClient.get<ApiResponse<ProductConfigurableAttribute[]>>(
      `/products/${id}/attributes`
    );
    return response.data;
  },

  /**
   * Fetch category hierarchy trees for navigation menus.
   */
  async getCategories(tree = true): Promise<ApiResponse<CategoryNode[]>> {
    const response = await apiClient.get<ApiResponse<CategoryNode[]>>('/categories', {
      params: { tree },
    });
    return response.data;
  },

  /**
   * Fetch active brands with logos and product counts.
   */
  async getBrands(): Promise<ApiResponse<BrandSummary[]>> {
    const response = await apiClient.get<ApiResponse<BrandSummary[]>>('/brands');
    return response.data;
  },
};
