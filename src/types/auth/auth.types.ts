/**
 * @file auth.types.ts
 * @description Customer authentication, tokens, social OAuth, CSRF security, and credentials types.
 */

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role?: 'CUSTOMER' | 'ADMIN' | 'VENDOR' | string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  phoneVerified?: boolean;
  avatarUrl?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface CsrfResponse {
  success: boolean;
  csrfToken: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  deviceName?: string;
  deviceId?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export interface AuthResponseData {
  user: AuthUser;
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

export interface RefreshResponseData {
  accessToken: string;
  expiresIn?: number;
  refreshToken?: string;
}
