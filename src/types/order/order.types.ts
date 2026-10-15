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
  totalUnits?: number;
  subtotal: number;
  discountTotal: number;
  shippingFee?: number;
  shippingTotal?: number;
  taxTotal: number;
  grandTotal: number;
  currency?: string;
}

export interface ValidateCheckoutPayload {
  cartId?: string;
  shippingAddress?: Partial<SavedAddress>;
  shippingAddressId?: string;
  billingAddressId?: string;
  couponCode?: string;
  currency?: string;
}

export interface ValidateCheckoutResponse {
  isValid: boolean;
  currency?: string;
  summary: CheckoutSummary;
  coupon?: {
    code: string;
    type?: string;
    applied?: boolean;
    discountAmount: number;
    freeShippingApplied?: boolean;
  };
  shippingAddress?: Partial<SavedAddress>;
  items: Array<{
    variantId: string;
    productName?: string;
    productTitle?: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
    lineTotal?: number;
    isAvailable?: boolean;
    currentStock?: number;
  }>;
  stockIssues?: StockIssue[];
}

export interface PlaceOrderPayload {
  cartId?: string;
  shippingAddressId?: string;
  shippingAddress?: Partial<SavedAddress>;
  billingAddressId?: string;
  billingAddress?: Partial<SavedAddress>;
  paymentMethod?: 'UPI' | 'COD' | 'CARD' | 'NETBANKING' | string;
  couponCode?: string;
  notes?: string;
  currency?: string;
}

export interface OrderAddress {
  recipientName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItemSnapshot {
  id: string;
  variantId?: string;
  productName?: string;
  title?: string;
  variantTitle?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailUrl?: string;
}

export interface OrderStatusHistoryItem {
  previousStatus?: OrderStatus;
  newStatus?: OrderStatus;
  status?: OrderStatus;
  reason?: string;
  note?: string;
  createdAt?: string;
  timestamp?: string;
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
  userId?: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  currency: string;
  subtotal: number;
  discountTotal?: number;
  discountAmount?: number;
  shippingTotal?: number;
  shippingFee?: number;
  taxTotal?: number;
  taxAmount?: number;
  grandTotal: number;
  totalAmount?: number;
  createdAt: string;
  expiresAt?: string;
  address?: OrderAddress;
  shippingAddress?: OrderAddress | SavedAddress;
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
  order?: OrderDetails;
  nextStep?: OrderNextStep;
  id?: string;
  orderNumber?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  financials?: {
    subtotal?: number;
    discountTotal?: number;
    taxTotal?: number;
    shippingTotal?: number;
    grandTotal?: number;
    currency?: string;
  };
  items?: any[];
  createdAt?: string;
}

export interface OrderListParams extends PaginationParams {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderItemPreview {
  title?: string;
  productName?: string;
  name?: string;
  quantity?: number;
  qty?: number;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
  thumbnailUrl?: string;
  image?: string;
  imageUrl?: string;
  sku?: string;
  variantTitle?: string;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  grandTotal?: number;
  totalAmount?: number;
  total?: number;
  subtotal?: number;
  discountTotal?: number;
  discountAmount?: number;
  shippingTotal?: number;
  shippingFee?: number;
  taxTotal?: number;
  taxAmount?: number;
  currency?: string;
  itemCount?: number;
  totalUnits?: number;
  createdAt: string;
  itemsPreview?: OrderItemPreview[];
  items?: OrderItemSnapshot[];
  shippingAddress?: OrderAddress | Partial<SavedAddress>;
  address?: OrderAddress;
  tracking?: OrderTrackingInfo;
}

export interface OrderListResponseData {
  items: OrderListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CancelOrderPayload {
  reason: string;
}

export interface CancelOrderResponse {
  id?: string;
  orderId?: string;
  orderNumber?: string;
  status: OrderStatus;
  refundInitiated?: boolean;
}
