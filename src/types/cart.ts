import { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  estimatedTax: number;
  total: number;
  couponCode?: string;
  isFreeShippingUnlocked: boolean;
  amountNeededForFreeShipping: number;
}
