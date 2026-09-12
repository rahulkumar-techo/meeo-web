'use client';

/**
 * @file useAuth.ts
 * @description Authentication and customer session queries & mutations with TanStack Query caching.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth/authService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  AuthUser,
  CsrfResponse,
  LoginPayload,
  SignupPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponseData,
} from '@/types/auth/auth.types';

/**
 * Fetch current authenticated user profile (/auth/me).
 * Stale time: 5 mins, GC time: 30 mins.
 */
export function useCurrentUserQuery() {
  const storeUser = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const setUser = useUserStore((s) => s.setUser);

  return useQuery<AuthUser | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        const res = await authService.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          return res.data;
        }
        return null;
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated,
    initialData: storeUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Fetch or refresh CSRF protection token.
 */
export function useCsrfQuery() {
  return useQuery<CsrfResponse>({
    queryKey: queryKeys.auth.csrf(),
    queryFn: () => authService.getCsrfToken(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Authenticate customer with email and password.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation<ApiResponse<AuthResponseData>, Error, LoginPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (res) => {
      if (res.data?.user && res.data?.accessToken) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        queryClient.setQueryData(queryKeys.auth.me(), res.data.user);
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      }
    },
  });
}

/**
 * Register a new customer account.
 */
export function useSignupMutation() {
  const queryClient = useQueryClient();
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation<ApiResponse<AuthResponseData>, Error, SignupPayload>({
    mutationFn: (payload) => authService.signup(payload),
    onSuccess: (res) => {
      if (res.data?.user && res.data?.accessToken) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        queryClient.setQueryData(queryKeys.auth.me(), res.data.user);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * Verify 6-digit OTP verification passcode.
 */
export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, VerifyOtpPayload>({
    mutationFn: (payload) => authService.verifyOtp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * Resend verification OTP code.
 */
export function useResendOtpMutation() {
  return useMutation<ApiResponse<null>, Error, ResendOtpPayload>({
    mutationFn: (payload) => authService.resendOtp(payload),
  });
}

/**
 * Request password reset email.
 */
export function useForgotPasswordMutation() {
  return useMutation<ApiResponse<null>, Error, ForgotPasswordPayload>({
    mutationFn: (payload) => authService.forgotPassword(payload),
  });
}

/**
 * Reset password with OTP and new password.
 */
export function useResetPasswordMutation() {
  return useMutation<ApiResponse<null>, Error, ResetPasswordPayload>({
    mutationFn: (payload) => authService.resetPassword(payload),
  });
}

/**
 * Invalidate session and clear auth cache.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const logout = useUserStore((s) => s.logout);

  return useMutation<ApiResponse<null>, Error, void>({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}

/**
 * Invalidate all customer sessions across devices.
 */
export function useLogoutAllMutation() {
  const queryClient = useQueryClient();
  const logout = useUserStore((s) => s.logout);

  return useMutation<ApiResponse<null>, Error, void>({
    mutationFn: () => authService.logoutAll(),
    onSettled: () => {
      logout();
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
    },
  });
}
