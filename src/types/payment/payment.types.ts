/**
 * @file payment.types.ts
 * @description Payment intent initialization, gateway providers (Stripe, Razorpay, Mock), retries, and verification types.
 */

export type PaymentProvider = 'MOCK' | 'STRIPE' | 'RAZORPAY' | string;
export type PaymentMethodType = 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' | string;

export interface PaymentGatewayData {
  clientSecret?: string;
  publishableKey?: string;
  razorpayOrderId?: string;
  keyId?: string;
  [key: string]: unknown;
}

export interface InitializePaymentPayload {
  orderId: string;
  provider: PaymentProvider;
  paymentMethod?: PaymentMethodType;
  returnUrl?: string;
}

export interface InitializePaymentResponse {
  paymentId: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: string;
  gatewayData: PaymentGatewayData;
}

export interface PaymentAttempt {
  attemptNumber: number;
  status: string;
  gatewayResponseCode?: string;
  createdAt: string;
}

export interface PaymentRefundRecord {
  id: string;
  amount: number;
  reason?: string;
  status: string;
  createdAt: string;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: 'PENDING' | 'PROCESSING' | 'REQUIRES_ACTION' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | string;
  amount: number;
  currency: string;
  transactionId?: string;
  paymentMethod?: string;
  attemptsCount?: number;
  attempts?: PaymentAttempt[];
  refunds?: PaymentRefundRecord[];
  createdAt: string;
  updatedAt?: string;
}

export interface RetryPaymentPayload {
  paymentId: string;
  paymentMethod?: PaymentMethodType;
}

export interface RetryPaymentResponse {
  paymentId: string;
  attemptNumber: number;
  status: string;
  gatewayData?: PaymentGatewayData;
}
