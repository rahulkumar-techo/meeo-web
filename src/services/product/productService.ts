/**
 * @file productService.ts
 * @description Product service for fetching items, categories, and single product details directly via APIs.
 */

import { apiClient } from '@/config/client';
import { ApiRoute } from '@/routes';
import type { ApiResponse } from '@/types/common/api.types';
import type { ApiProduct } from './productAdapter';

export interface GetProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

export interface ProductsResponseData {
  items: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productService = {
  /**
   * Get all products with query parameters via backend API.
   * Handles both { data: { items: [...] } } and { data: [...] } responses.
   */
  async getProducts(params?: GetProductsParams): Promise<ApiResponse<ApiProduct[]>> {
    const response = await apiClient.get<ApiResponse<any>>(ApiRoute.PRODUCT.PRODUCTS, {
      params,
    });

    const rawData = response.data?.data;
    const items: ApiProduct[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.items)
      ? rawData.items
      : [];

    return {
      success: response.data?.success ?? true,
      message: response.data?.message,
      data: items,
    };
  },

  /**
   * Get single product by UUID or slug via backend API.
   */
  async getProductById(idOrSlug: string): Promise<ApiResponse<ApiProduct | null>> {
    try {
      // First try slug endpoint if alphanumeric string contains dashes
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const endpoint = isUuid
        ? ApiRoute.PRODUCT.PRODUCT_DETAILS(idOrSlug)
        : ApiRoute.PRODUCT.PRODUCT_BY_SLUG(idOrSlug);
      const response = await apiClient.get<ApiResponse<ApiProduct>>(endpoint);
      return response.data;
    } catch {
      // Fallback to direct ID
      try {
        const fallbackRes = await apiClient.get<ApiResponse<ApiProduct>>(
          ApiRoute.PRODUCT.PRODUCT_DETAILS(idOrSlug)
        );
        return fallbackRes.data;
      } catch {
        return { success: false, data: null };
      }
    }
  },

  /**
   * Get single product by slug via backend API.
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<ApiProduct | null>> {
    const response = await apiClient.get<ApiResponse<ApiProduct>>(
      ApiRoute.PRODUCT.PRODUCT_BY_SLUG(slug)
    );
    return response.data;
  },
};