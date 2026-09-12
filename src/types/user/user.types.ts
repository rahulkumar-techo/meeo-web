/**
 * @file user.types.ts
 * @description Customer profile, phone OTP verification, and address book types.
 */

import { AuthUser } from '../auth/auth.types';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface RequestPhoneOtpPayload {
  phoneNumber: string;
}

export interface RequestPhoneOtpResponse {
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
}

export interface VerifyPhonePayload {
  phoneNumber: string;
  otp: string;
}

export interface VerifyPhoneResponse {
  phone: string;
  phoneVerified: boolean;
  verifiedAt: string;
}

export type AddressType = 'SHIPPING' | 'BILLING' | 'BOTH';

export interface SavedAddress {
  id: string;
  userId?: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  addressType?: AddressType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressPayload {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
  addressType?: AddressType;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;
