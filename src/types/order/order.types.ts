/**
 * @file order.types.ts
 * @description Pre-checkout breakdown, atomic order placement, order status history, and self-service cancellation types.
 */

import { PaginationParams } from '../common/api.types';
import { SavedAddress } from '../user/user.types';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXPIRED'
  | string;

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | string;

export interface StockIssue {
  variantId: string;
  productTitle: string;
  requestedQuantity: number;
  availableStock: number;
}

export interface CheckoutSummary {
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxTotal: number;
  grandTotal: number;
}

export interface ValidateCheckoutPayload {
  cartId?: string;
  shippingAddress?: Partial<SavedAddress>;
  shippingAddressId?: string;
  couponCode?: string;
  currency?: string;
}

export interface ValidateCheckoutResponse {
  isValid: boolean;
  currency: string;
  summary: CheckoutSummary;
  coupon?: {
    code: string;
    applied: boolean;
    discountAmount: number;
    freeShippingApplied: boolean;
  };
  items: Array<{
    variantId: string;
    productTitle: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    isAvailable: boolean;
    currentStock: number;
  }>;
  stockIssues: StockIssue[];
}

export interface PlaceOrderPayload {
  cartId?: string;
  shippingAddressId?: string;
  shippingAddress?: Partial<SavedAddress>;
  couponCode?: string;
  notes?: string;
  currency?: string;
}

export interface OrderItemSnapshot {
  id: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  thumbnailUrl?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderTrackingInfo {
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  estimatedDelivery?: string | null;
  shippedAt?: string | null;
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  subtotal: number;
  discountAmount?: number;
  shippingFee?: number;
  taxAmount?: number;
  totalAmount: number;
  createdAt: string;
  expiresAt?: string;
  shippingAddress?: SavedAddress;
  items: OrderItemSnapshot[];
  statusHistory?: OrderStatusHistoryItem[];
  tracking?: OrderTrackingInfo;
}

export interface OrderNextStep {
  action: string;
  endpoint: string;
  orderId: string;
}

export interface PlaceOrderResponse {
  order: OrderDetails;
  nextStep?: OrderNextStep;
}

export interface OrderListParams extends PaginationParams {
  status?: OrderStatus;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  itemsPreview?: Array<{
    title: string;
    quantity: number;
    thumbnailUrl?: string;
  }>;
}

export interface CancelOrderPayload {
  reason: string;
}

export interface CancelOrderResponse {
  orderId: string;
  status: OrderStatus;
  refundInitiated?: boolean;
}
