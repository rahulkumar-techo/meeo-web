import { CartItem } from './cart';

export type OrderStatus =
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderMilestone {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  type: 'upi' | 'card' | 'netbanking' | 'emi' | 'cash_on_delivery';
  label: string;
  details?: string;
  providerIcon?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  estimatedDelivery: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  summary: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  trackingNumber: string;
  courierName: string;
  milestones: OrderMilestone[];
  currentLocationLat?: number;
  currentLocationLng?: number;
}
