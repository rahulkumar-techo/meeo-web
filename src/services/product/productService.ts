/**
 * @file productService.ts
 * @description Product service for fetching items, categories, and single product details.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/auth';
import type { Product } from '@/types/product';
import { MOCK_PRODUCTS } from '@/data/products';

export interface GetProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

export const productService = {
  /**
   * Get all products with query parameters and local mock fallback
   */
  async getProducts(params?: GetProductsParams): Promise<ApiResponse<Product[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
        params,
      });
      return response.data;
    } catch {
      // Graceful fallback to rich local catalog if backend endpoint is in progress
      let filtered = [...MOCK_PRODUCTS];
      if (params?.category) {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return {
        success: true,
        message: 'Products retrieved',
        data: filtered,
      };
    }
  },

  /**
   * Get single product by ID or slug
   */
  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
      return {
        success: Boolean(found),
        message: found ? 'Product found' : 'Product not found',
        data: found,
      };
    }
  },
};