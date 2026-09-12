/**
 * @file useAuthMutations.ts
 * @description Backward-compatibility re-export bridging legacy imports to the modular hooks/auth/useAuth.
 */

export * from './auth/useAuth';
export { useSignupMutation as useRegisterMutation } from './auth/useAuth';
export { queryKeys as AUTH_KEYS } from './queryKeys';
