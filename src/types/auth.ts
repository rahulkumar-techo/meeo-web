/**
 * @file auth.ts
 * @description Centralized re-export of authentication and session types.
 */

export * from '@/types/auth/auth.types';
export * from '@/types/common/api.types';
export type {
  GoogleSignInPayload,
  VerifyResetOtpPayload,
  SetPasswordPayload,
  ChangePasswordPayload,
  LinkGooglePayload,
  AuthProviderType,
  AuthAccount,
  UserSessionDevice,
} from '@/services/auth/auth.type';
export type RegisterPayload = import('@/services/auth/auth.type').RegisterPayload;
