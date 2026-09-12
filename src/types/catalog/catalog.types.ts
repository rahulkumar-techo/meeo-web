/**
 * @file catalog.types.ts
 * @description Product catalog, variant matrix, swatch attributes, category trees, and brand types.
 */

import { PaginationParams } from '../common/api.types';

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export interface CategoryNode extends CategorySummary {
  children?: CategorySummary[];
}

export interface BrandSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  productCount?: number;
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductVariantAttribute {
  name: string;
  value: string;
  hex?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isAvailable: boolean;
  attributes: ProductVariantAttribute[];
  images?: { url: string }[];
}

export interface ProductVariantsSummary {
  totalVariants: number;
  availableColors: string[];
  availableSizes: string[];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  currency: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | string;
  rating: number;
  reviewCount: number;
  category: CategorySummary;
  brand?: BrandSummary;
  thumbnailUrl: string;
  images: ProductImage[];
  variantsSummary?: ProductVariantsSummary;
  sku?: string;
  metaTitle?: string;
  metaDescription?: string;
  variants?: ProductVariant[];
  ratingSummary?: {
    averageRating: number;
    totalReviews: number;
  };
}

export type AttributeType = 'COLOR_SWATCH' | 'BUTTON_PILL' | 'DROPDOWN' | string;

export interface AttributeOptionValue {
  value: string;
  hex?: string;
  inStock: boolean;
}

export interface ProductConfigurableAttribute {
  attributeId: string;
  name: string;
  type: AttributeType;
  values: AttributeOptionValue[];
}

export interface ProductListParams extends PaginationParams {
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'title' | 'createdAt' | 'popularity' | string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
