// Product Model Interface for Meeo E-Commerce Catalog
export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: 'audio' | 'workspace' | 'living' | 'footwear' | 'objects' | 'deals';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  badgeType?: 'trending' | 'drop' | 'exclusive' | 'sale' | 'award';
  description: string;
  curatorNote?: string;
  images: string[];
  specs: Record<string, string>;
  colors?: { name: string; hex: string; inStock: boolean }[];
  sizes?: { size: string; inStock: boolean }[];
  materials?: string[];
  isArchivalDrop?: boolean;
  dropTimeRemaining?: string;
  tags: string[];
}

export type SortOption =
  | 'curated'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'newest';
