/**
 * @file productService.ts
 * @description Product service for fetching items, categories, and single product details directly via APIs.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type { Product } from '@/types/product';

export interface GetProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

export const productService = {
  /**
   * Get all products with query parameters via backend API
   */
  async getProducts(params?: GetProductsParams): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * Get single product by ID or slug via backend API
   */
  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
};