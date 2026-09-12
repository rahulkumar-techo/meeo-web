/**
 * @file apiHelper.ts
 * @description Safe extraction and normalization utilities for API payloads and product data models.
 */

import type { Product } from '@/types/product';

/**
 * Safely extracts an array from various backend response envelope shapes:
 * - Direct array: `[ ... ]`
 * - Standard envelope: `{ data: [ ... ] }`
 * - Nested products envelope: `{ data: { products: [ ... ] } }` or `{ data: { items: [ ... ] } }`
 * - Flat named list: `{ products: [ ... ] }` or `{ items: [ ... ] }`
 */
export function extractArray<T = any>(response: any): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;

  const data = response.data !== undefined ? response.data : response;
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.reviews)) return data.reviews;
    if (Array.isArray(data.brands)) return data.brands;
    if (Array.isArray(data.results)) return data.results;
  }

  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.products)) return response.products;
  if (Array.isArray(response.categories)) return response.categories;
  if (Array.isArray(response.orders)) return response.orders;

  return [];
}

/**
 * Normalizes any backend product payload (CatalogProduct, search result, raw JSON)
 * into a strongly-typed, bulletproof `Product` interface for UI rendering.
 * Extracts actual selling price and compareAt strike-through price from product variants.
 */
export function normalizeProduct(raw: any): Product {
  if (!raw || typeof raw !== 'object') {
    return {
      id: '',
      slug: '',
      name: 'Curated Product',
      subtitle: '',
      category: 'objects',
      categoryLabel: 'Catalog',
      price: 0,
      originalPrice: undefined,
      rating: 4.8,
      reviewCount: 0,
      inStock: true,
      stockCount: 10,
      description: '',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'],
      specs: {},
      tags: [],
      variants: [],
    };
  }

  // 1. Resolve first active variant or fallback variant
  const variants = Array.isArray(raw?.variants) ? raw.variants : [];
  const firstVariant = variants.find((v: any) => v?.status === 'ACTIVE' || v?.isAvailable) || variants[0];

  // 2. Parse price (convert Prisma Decimal string / number to Number)
  const price = Number(firstVariant?.price ?? raw?.price ?? raw?.salePrice ?? raw?.basePrice ?? 0);
  const origCandidate = firstVariant?.compareAtPrice
    ? Number(firstVariant.compareAtPrice)
    : raw?.compareAtPrice
    ? Number(raw.compareAtPrice)
    : raw?.originalPrice
    ? Number(raw.originalPrice)
    : (raw?.salePrice && raw?.basePrice && Number(raw.basePrice) > Number(raw.salePrice) ? Number(raw.basePrice) : undefined);

  // 3. Discount strike-through (only if higher than actual selling price)
  const originalPrice = origCandidate !== undefined && origCandidate > price ? origCandidate : undefined;

  const id = String(raw.id || raw._id || '');
  const slug = String(raw.slug || raw.id || '');
  const name = String(raw.name || raw.title || 'Curated Product');
  const subtitle = String(raw.subtitle || raw.seoTitle || raw.metaDescription || (typeof raw.description === 'string' ? raw.description.slice(0, 80) : '') || '');

  let categorySlug: Product['category'] = 'objects';
  let categoryLabel = 'Catalog';

  if (typeof raw.category === 'string') {
    const cat = raw.category.toLowerCase();
    if (['audio', 'workspace', 'living', 'footwear', 'objects', 'deals'].includes(cat)) {
      categorySlug = cat as Product['category'];
    }
    categoryLabel = raw.categoryLabel || (raw.category.charAt(0).toUpperCase() + raw.category.slice(1));
  } else if (raw.category && typeof raw.category === 'object') {
    const slugVal = String(raw.category.slug || raw.category.name || '').toLowerCase();
    if (['audio', 'workspace', 'living', 'footwear', 'objects', 'deals'].includes(slugVal)) {
      categorySlug = slugVal as Product['category'];
    }
    categoryLabel = raw.category.name || raw.categoryLabel || 'Catalog';
  }

  let images: string[] = [];
  if (Array.isArray(raw.images)) {
    images = raw.images
      .map((img: any) => (typeof img === 'string' ? img : img?.url || ''))
      .filter(Boolean);
  }
  if (images.length === 0 && raw.thumbnailUrl) {
    images = [raw.thumbnailUrl];
  }
  if (images.length === 0 && raw.imageUrl) {
    images = [raw.imageUrl];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'];
  }

  const rating = Number(raw.rating ?? raw.ratingSummary?.averageRating ?? 4.8);
  const reviewCount = Number(raw.reviewCount ?? raw.ratingSummary?.totalReviews ?? 0);
  const inStock = raw?.status !== undefined
    ? (raw.status === 'ACTIVE' && (variants.length > 0 ? variants.some((v: any) => v.status === 'ACTIVE' || v.isAvailable) : true))
    : Boolean(raw?.inStock ?? raw?.variantsSummary?.inStock ?? (raw?.stockCount !== undefined ? raw.stockCount > 0 : true));
  const stockCount = Number(firstVariant?.stock ?? raw?.stockCount ?? raw?.stock ?? raw?.variantsSummary?.totalVariants ?? 10);

  return {
    id,
    slug,
    name,
    subtitle,
    category: categorySlug,
    categoryLabel,
    price,
    originalPrice,
    rating: isNaN(rating) ? 4.8 : rating,
    reviewCount: isNaN(reviewCount) ? 0 : reviewCount,
    inStock,
    stockCount: isNaN(stockCount) ? 10 : stockCount,
    badge: raw.badge,
    badgeType: raw.badgeType,
    description: typeof raw.description === 'string' ? raw.description : '',
    curatorNote: raw.curatorNote,
    images,
    specs: raw.specs || {},
    colors: raw.colors,
    sizes: raw.sizes,
    materials: raw.materials,
    isArchivalDrop: Boolean(raw.isArchivalDrop),
    dropTimeRemaining: raw.dropTimeRemaining,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    variants,
  };
}

/**
 * Normalizes an array or envelope of products into `Product[]`.
 */
export function normalizeProducts(rawList: any): Product[] {
  const arr = extractArray(rawList);
  return arr.map(normalizeProduct);
}
