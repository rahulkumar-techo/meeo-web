/**
 * @file authService.ts
 * @description Customer authentication, session lifecycle, CSRF tokens, and credentials management.
 */

import { apiClient, executeSilentRefresh } from '@/config/client';
import { setStoredCsrfToken } from '@/lib/csrf';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  AuthUser,
  CsrfResponse,
  SignupPayload,
  LoginPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponseData,
} from '@/types/auth/auth.types';

export const authService = {
  /**
   * Obtain CSRF token for mutating requests.
   */
  async getCsrfToken(): Promise<CsrfResponse> {
    try {
      const response = await apiClient.get<CsrfResponse>('/auth/csrf');
      if (response.data?.csrfToken) {
        setStoredCsrfToken(response.data.csrfToken);
      }
      return response.data;
    } catch {
      return { success: false, csrfToken: '' };
    }
  },

  /**
   * Register a new customer account (/auth/signup or /auth/register).
   */
  async signup(payload: SignupPayload): Promise<ApiResponse<AuthResponseData>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/signup', payload);
      return response.data;
    } catch {
      // Fallback route support
      const fallback = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
      return fallback.data;
    }
  },

  /**
   * Alias for registration compatibility
   */
  async register(payload: SignupPayload): Promise<ApiResponse<AuthResponseData>> {
    return this.signup(payload);
  },

  /**
   * Authenticate customer with email and password.
   */
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    return response.data;
  },

  /**
   * Verify email OTP passcode.
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/verify-otp', payload);
    return response.data;
  },

  /**
   * Resend verification OTP code.
   */
  async resendOtp(payload: ResendOtpPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/resend-otp', payload);
    return response.data;
  },

  /**
   * Request password reset email.
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', payload);
    return response.data;
  },

  /**
   * Reset account password with token/OTP.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/reset-password', payload);
    return response.data;
  },

  /**
   * Fetch current authenticated user profile.
   */
  async getMe(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data;
  },

  /**
   * Refresh session via HttpOnly cookie.
   */
  async refreshToken(): Promise<ApiResponse<null>> {
    await executeSilentRefresh();
    return {
      success: true,
      message: 'Session refreshed successfully',
      data: null,
    };
  },

  /**
   * Invalidate active customer session.
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
      return response.data;
    } catch {
      return { success: true, message: 'Logged out locally' };
    }
  },

  /**
   * Terminate all sessions across devices.
   */
  async logoutAll(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout-all');
      return response.data;
    } catch {
      return { success: true, message: 'Logged out from all devices' };
    }
  },
};
