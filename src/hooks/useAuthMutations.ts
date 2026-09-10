'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  OtpRequest,
  OtpVerifyPayload,
  ResetPasswordPayload,
} from '@/services/auth/authService';

export const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
  session: () => [...AUTH_KEYS.all, 'session'] as const,
};

/**
 * Query hook for current authenticated user profile
 */
export function useCurrentUserQuery() {
  return useQuery<AuthUser | null>({
    queryKey: AUTH_KEYS.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity,
  });
}

/**
 * Mutation hook for standard email/phone & password login
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.loginWithPassword(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.user(), user);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Mutation hook for Google, Apple, and Passkey logins
 */
export function useSocialLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, 'google' | 'apple' | 'passkey'>({
    mutationFn: (provider) => authService.loginWithSocial(provider),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.user(), user);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Mutation hook for registering a new collector account
 */
export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, RegisterPayload>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEYS.user(), user);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Mutation hook for initiating OTP delivery (Login, Register, Forgot Password)
 */
export function useSendOtpMutation() {
  return useMutation<{ success: boolean; message: string; expirySeconds: number }, Error, OtpRequest>({
    mutationFn: (req) => authService.sendOtp(req),
  });
}

/**
 * Mutation hook for resending OTP with multi-channel options
 */
export function useResendOtpMutation() {
  return useMutation<{ success: boolean; message: string; expirySeconds: number }, Error, OtpRequest>({
    mutationFn: (req) => authService.resendOtp(req),
  });
}

/**
 * Mutation hook for verifying 6-digit OTP passcode
 */
export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthUser | { verified: boolean }, Error, OtpVerifyPayload>({
    mutationFn: (payload) => authService.verifyOtp(payload),
    onSuccess: (result) => {
      if ('id' in result) {
        queryClient.setQueryData(AUTH_KEYS.user(), result);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
      }
    },
  });
}

/**
 * Mutation hook for resetting password
 */
export function useResetPasswordMutation() {
  return useMutation<{ success: boolean; message: string }, Error, ResetPasswordPayload>({
    mutationFn: (payload) => authService.resetPassword(payload),
  });
}

/**
 * Mutation hook for logging out and clearing session
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      authService.clearSession();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.user(), null);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}
