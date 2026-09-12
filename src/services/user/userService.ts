/**
 * @file userService.ts
 * @description Customer profile management, SMS phone OTP requests, and phone verification.
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type { AuthUser } from '@/types/auth/auth.types';
import type {
  UpdateProfilePayload,
  RequestPhoneOtpPayload,
  RequestPhoneOtpResponse,
  VerifyPhonePayload,
  VerifyPhoneResponse,
} from '@/types/user/user.types';

export const userService = {
  /**
   * Update customer first name, last name, or avatar URL.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.patch<ApiResponse<AuthUser>>('/user/profile', payload);
    return response.data;
  },

  /**
   * Request 6-digit SMS verification code to mobile number.
   */
  async requestPhoneOtp(
    payload: RequestPhoneOtpPayload
  ): Promise<ApiResponse<RequestPhoneOtpResponse>> {
    const response = await apiClient.post<ApiResponse<RequestPhoneOtpResponse>>(
      '/user/phone/request-otp',
      payload
    );
    return response.data;
  },

  /**
   * Verify SMS OTP and mark phone number verified.
   */
  async verifyPhoneOtp(payload: VerifyPhonePayload): Promise<ApiResponse<VerifyPhoneResponse>> {
    const response = await apiClient.put<ApiResponse<VerifyPhoneResponse>>(
      '/user/phone',
      payload
    );
    return response.data;
  },
};
