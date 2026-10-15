/**
 * @file catalogService.ts
 * @description Catalog browsing, product listings, SKU variants, attributes matrix, categories, and brands.
 */

import { apiClient } from '@/config/client';
import { ApiRoute } from '@/routes';
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
    const response = await apiClient.get<any>(ApiRoute.PRODUCT.PRODUCTS, {
      params,
    });
    const rawData = response.data?.data;
    const items: CatalogProduct[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.items)
      ? rawData.items
      : [];

    return {
      success: response.data?.success ?? true,
      message: response.data?.message,
      data: items,
      pagination: {
        page: rawData?.page || 1,
        limit: rawData?.limit || 10,
        totalItems: rawData?.total || items.length,
        totalPages: rawData?.totalPages || 1,
      },
    };
  },

  /**
   * Fetch single product details by URL slug for SEO-friendly PDP routing.
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<CatalogProduct>> {
    const response = await apiClient.get<ApiResponse<CatalogProduct>>(
      ApiRoute.PRODUCT.PRODUCT_BY_SLUG(slug)
    );
    return response.data;
  },

  /**
   * Fetch single product details by UUID.
   */
  async getProductById(id: string): Promise<ApiResponse<CatalogProduct>> {
    const response = await apiClient.get<ApiResponse<CatalogProduct>>(
      ApiRoute.PRODUCT.PRODUCT_DETAILS(id)
    );
    return response.data;
  },

  /**
   * Fetch product configurable attributes matrix (Color swatches, Size pills).
   */
  async getProductAttributes(
    id: string
  ): Promise<ApiResponse<ProductConfigurableAttribute[]>> {
    const response = await apiClient.get<ApiResponse<ProductConfigurableAttribute[]>>(
      ApiRoute.PRODUCT.PRODUCT_ATTRIBUTES(id)
    );
    return response.data;
  },

  /**
   * Fetch category hierarchy trees for navigation menus.
   */
  async getCategories(tree = false): Promise<ApiResponse<CategoryNode[]>> {
    try {
      const response = await apiClient.get<any>(
        ApiRoute.CATEGORIES.CATEGORIES,
        {
          params: { tree },
        }
      );
      const rawData = response.data?.data;
      const rawItems = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : [];

      const items: CategoryNode[] = rawItems.map((cat: any) => ({
        id: cat.id || cat.slug,
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-'),
        description: cat.description || '',
        imageUrl: cat.imageUrl || '',
        productCount: cat._count?.products ?? cat.productCount ?? 0,
        children: cat.children || [],
      }));

      return {
        success: response.data?.success ?? true,
        message: response.data?.message,
        data: items,
      };
    } catch {
      return { success: false, data: [] };
    }
  },

  /**
   * Fetch active brands with logos and product counts.
   */
  async getBrands(): Promise<ApiResponse<BrandSummary[]>> {
    const response = await apiClient.get<ApiResponse<BrandSummary[]>>(ApiRoute.BRAND.BRANDS);
    return response.data;
  },
};
