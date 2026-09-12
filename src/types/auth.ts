/**
 * @file auth.ts
 * @description Centralized re-export of authentication and session types.
 */

export * from '@/types/auth/auth.types';
export * from '@/types/common/api.types';
export type RegisterPayload = import('@/types/auth/auth.types').SignupPayload;
