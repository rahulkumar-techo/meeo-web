export interface ProductColorOption {
  id: string;
  name: string;
  hex: string;
  swatchColor: string;
  inStock: boolean;
  image: string;
}

export interface ProductSizeOption {
  size: string;
  inStock: boolean;
}

export interface GalleryThumbnail {
  id: string;
  label: string;
  type: 'image' | 'video';
  url: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: 'shield' | 'cloud' | 'shoe' | 'sparkle';
}

export interface ProductReviewItem {
  id: string;
  author: string;
  date: string;
  rating: number;
  verified: boolean;
  title: string;
  content: string;
}

export interface FormattedProductVariant {
  id: string;
  sku: string;
  price: number;
  originalPrice: number;
  discount: string;
  status: string;
  inStock: boolean;
  stockCount: number;
  attributes: Record<string, string>;
  images: GalleryThumbnail[];
}

export interface UrbanNestProductDetail {
  id: string;
  slug: string;
  brand: string;
  brandLogoText: string;
  name: string;
  category: string;
  breadcrumbs: { label: string; href: string }[];
  rating: number;
  reviewCount: string;
  inStock: boolean;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  variants?: FormattedProductVariant[];
  selectedVariantId?: string;
  colors: ProductColorOption[];
  sizes: ProductSizeOption[];
  gallery: GalleryThumbnail[];
  overview?: {
    heading: string;
    subheading: string;
    features: ProductFeature[];
    lifestyleImage: string;
    lifestyleBadge: string;
  };
  specifications: Record<string, string>;
  specificationsGrouped?: Record<string, Record<string, string>>;
  highlights?: string[];
  reviewsData?: {
    average: number;
    totalCount: string;
    ratingBreakdown: { stars: number; pct: number }[];
    items: ProductReviewItem[];
  };
  shippingInfo?: {
    freeShippingThreshold: string;
    deliveryTime: string;
    expressDelivery: string;
    returnsWindow: string;
    authenticity: string;
  };
  recommended?: {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviewCount: string;
    image: string;
    category: string;
  }[];
}

/**
 * Returns null - dummy products have been removed. Products are fetched from backend API.
 */
export function getProductDetailById(_id: string): UrbanNestProductDetail | null {
  return null;
}
