/**
 * @file wishlist.types.ts
 * @description Customer wishlist, bookmarked items, and direct cart transfer types.
 */

export interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  basePrice: number;
  salePrice?: number;
  inStock: boolean;
  categoryName?: string;
  brandName?: string;
  createdAt?: string;
}

export interface WishlistData {
  totalItems: number;
  items: WishlistItem[];
}

export interface AddToWishlistPayload {
  productId?: string;
}

export interface AddToWishlistResponse {
  productId: string;
  totalWishlistCount: number;
}

export interface MoveWishlistToCartPayload {
  variantId: string;
  quantity?: number;
}

export interface MoveWishlistToCartResponse {
  cartItemCount: number;
  cartSubtotal: number;
}
