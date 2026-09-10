'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth/authService';
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiResponse,
  AuthResponseData,
} from '@/services/auth/auth.type';
import { useUserStore } from '@/store/user.store';

export const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
  me: () => [...AUTH_KEYS.all, 'me'] as const,
};

/**
 * Query hook for current authenticated user profile (/auth/me)
 */
export function useCurrentUserQuery() {
  const storeUser = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const setUser = useUserStore((s) => s.setUser);

  return useQuery<AuthUser | null>({
    queryKey: AUTH_KEYS.me(),
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
  });
}

/**
 * Mutation hook for email & password login
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation<ApiResponse<AuthResponseData>, Error, LoginPayload>({
    mutationFn: async (payload) => {
      return await authService.login(payload);
    },
    onSuccess: (res) => {
      if (res.data?.user && res.data?.accessToken) {
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        queryClient.setQueryData(AUTH_KEYS.me(), res.data.user);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
      }
    },
  });
}

/**
 * Mutation hook for registering a new account
 */
export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<{ user: AuthUser }>, Error, RegisterPayload>({
    mutationFn: async (payload) => {
      return await authService.register(payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Mutation hook for verifying 6-digit OTP passcode
 */
export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, VerifyOtpPayload>({
    mutationFn: async (payload) => {
      return await authService.verifyOtp(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Mutation hook for resending OTP
 */
export function useResendOtpMutation() {
  return useMutation<ApiResponse<null>, Error, ResendOtpPayload>({
    mutationFn: async (payload) => {
      return await authService.resendOtp(payload);
    },
  });
}

/**
 * Mutation hook for initiating forgot password OTP
 */
export function useForgotPasswordMutation() {
  return useMutation<ApiResponse<null>, Error, ForgotPasswordPayload>({
    mutationFn: async (payload) => {
      return await authService.forgotPassword(payload);
    },
  });
}

/**
 * Mutation hook for resetting password with OTP
 */
export function useResetPasswordMutation() {
  return useMutation<ApiResponse<null>, Error, ResetPasswordPayload>({
    mutationFn: async (payload) => {
      return await authService.resetPassword(payload);
    },
  });
}

/**
 * Mutation hook for logging out and clearing session
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const logout = useUserStore((s) => s.logout);

  return useMutation<ApiResponse<null>, Error, void>({
    mutationFn: async () => {
      return await authService.logout();
    },
    onSettled: () => {
      logout();
      queryClient.setQueryData(AUTH_KEYS.me(), null);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

