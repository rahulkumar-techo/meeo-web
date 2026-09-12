/**
 * @file queryKeys.ts
 * @description Centralized, hierarchical, type-safe Query Key Factory for all TanStack Query cache entries.
 */

import type { ProductListParams } from '@/types/catalog/catalog.types';
import type { SearchParams } from '@/types/search/search.types';
import type { OrderListParams } from '@/types/order/order.types';
import type { ReviewListParams } from '@/types/review/review.types';

export const queryKeys = {
  // Auth & Session
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    csrf: () => [...queryKeys.auth.all, 'csrf'] as const,
  },

  // User Profile & Addresses
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    addresses: () => [...queryKeys.user.all, 'addresses'] as const,
    addressDetail: (id: string) => [...queryKeys.user.addresses(), id] as const,
  },

  // Product Catalog
  catalog: {
    all: ['catalog'] as const,
    products: (params?: ProductListParams) =>
      [...queryKeys.catalog.all, 'products', params || {}] as const,
    productBySlug: (slug: string) =>
      [...queryKeys.catalog.all, 'product', 'slug', slug] as const,
    productById: (id: string) =>
      [...queryKeys.catalog.all, 'product', 'id', id] as const,
    productAttributes: (id: string) =>
      [...queryKeys.catalog.all, 'product', id, 'attributes'] as const,
    categories: (tree = true) =>
      [...queryKeys.catalog.all, 'categories', { tree }] as const,
    brands: () => [...queryKeys.catalog.all, 'brands'] as const,
  },

  // Search & Discovery
  search: {
    all: ['search'] as const,
    results: (params: SearchParams) =>
      [...queryKeys.search.all, 'results', params] as const,
    suggestions: (query: string) =>
      [...queryKeys.search.all, 'suggestions', query] as const,
    facets: (query?: string) =>
      [...queryKeys.search.all, 'facets', query || ''] as const,
  },
  discovery: {
    all: ['discovery'] as const,
    featured: () => [...queryKeys.discovery.all, 'featured'] as const,
    trending: () => [...queryKeys.discovery.all, 'trending'] as const,
    newArrivals: () => [...queryKeys.discovery.all, 'new-arrivals'] as const,
    related: (productId: string) =>
      [...queryKeys.discovery.all, 'related', productId] as const,
  },

  // Shopping Cart
  cart: {
    all: ['cart'] as const,
    active: () => [...queryKeys.cart.all, 'active'] as const,
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    active: () => [...queryKeys.wishlist.all, 'active'] as const,
  },

  // Coupons
  coupons: {
    all: ['coupons'] as const,
    history: () => [...queryKeys.coupons.all, 'history'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: (params?: OrderListParams) =>
      [...queryKeys.orders.all, 'list', params || {}] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
    byNumber: (orderNumber: string) =>
      [...queryKeys.orders.all, 'byNumber', orderNumber] as const,
  },

  // Payments
  payments: {
    all: ['payments'] as const,
    status: (paymentId: string) =>
      [...queryKeys.payments.all, 'status', paymentId] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string, params?: ReviewListParams) =>
      [...queryKeys.reviews.all, 'product', productId, params || {}] as const,
    summary: (productId: string) =>
      [...queryKeys.reviews.all, 'summary', productId] as const,
    myReviews: () => [...queryKeys.reviews.all, 'my-reviews'] as const,
  },
};
