/**
 * @file auth.type.ts
 * @description Backward compatibility re-export bridging legacy auth types to modular src/types/auth/auth.types.
 */

export * from '@/types/auth/auth.types';
export * from '@/types/common/api.types';
export type RegisterPayload = import('@/types/auth/auth.types').SignupPayload;
