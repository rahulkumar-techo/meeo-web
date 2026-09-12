/**
 * @file cart.types.ts
 * @description Customer and guest shopping cart, line items, dynamic totals, and session merge types.
 */

export interface CartItemAttribute {
  name: string;
  value: string;
}

export interface CartItemDetail {
  id: string;
  variantId: string;
  productId?: string;
  productTitle: string;
  variantTitle?: string;
  sku?: string;
  thumbnailUrl?: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  lineTotal: number;
  isAvailable?: boolean;
  availableStock?: number;
  attributes?: CartItemAttribute[];
}

export interface CartData {
  id: string;
  userId?: string;
  currency: string;
  itemCount: number;
  subtotal: number;
  discountTotal?: number;
  total: number;
  items: CartItemDetail[];
  expiresAt?: string;
}

export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface AddToCartResponse {
  cartId: string;
  itemCount: number;
  subtotal: number;
  addedItem: {
    id: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  };
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface UpdateCartItemResponse {
  id: string;
  quantity: number;
  lineTotal: number;
  cartSubtotal: number;
}

export interface RemoveCartItemResponse {
  cartId: string;
  itemCount: number;
  subtotal: number;
}

export interface MergeCartPayload {
  sessionId: string;
}

export interface MergeCartResponse {
  cartId: string;
  userId: string;
  itemCount: number;
  subtotal: number;
  items: Array<{
    id: string;
    variantId: string;
    productTitle: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}
