'use client';

/**
 * @file useUser.ts
 * @description Customer profile modifications, phone SMS OTP requests, and phone verification hooks.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user/userService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse } from '@/types/common/api.types';
import type { AuthUser } from '@/types/auth/auth.types';
import type {
  UpdateProfilePayload,
  RequestPhoneOtpPayload,
  RequestPhoneOtpResponse,
  VerifyPhonePayload,
  VerifyPhoneResponse,
} from '@/types/user/user.types';

/**
 * Update personal profile details (first name, last name, avatar).
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation<ApiResponse<AuthUser>, Error, UpdateProfilePayload>({
    mutationFn: (payload) => userService.updateProfile(payload),
    onSuccess: (res) => {
      if (res.data) {
        setUser(res.data);
        queryClient.setQueryData(queryKeys.auth.me(), res.data);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}

/**
 * Request SMS OTP code for phone verification.
 */
export function useRequestPhoneOtpMutation() {
  return useMutation<ApiResponse<RequestPhoneOtpResponse>, Error, RequestPhoneOtpPayload>({
    mutationFn: (payload) => userService.requestPhoneOtp(payload),
  });
}

/**
 * Verify phone OTP and attach phone number to customer profile.
 */
export function useVerifyPhoneOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<VerifyPhoneResponse>, Error, VerifyPhonePayload>({
    mutationFn: (payload) => userService.verifyPhoneOtp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}
