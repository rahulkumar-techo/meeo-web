/**
 * @file authService.ts
 * @description Authentication service communicating with Meeo server API endpoints.
 */

import { apiClient, executeSilentRefresh } from '@/config/client';
import { ApiRoute } from '@/routes';
import type {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyResetOtpPayload,
  AuthResponseData,
  AuthUser,
  GoogleSignInPayload,
  SetPasswordPayload,
  ChangePasswordPayload,
  LinkGooglePayload,
  AuthProviderType,
  AuthAccountsResponse,
  UserSessionDevice,
  UserSessionsListResponse,
} from './auth.type';

export const authService = {
  /**
   * Log in user with email and password.
   */
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    // Keep device info within backend limit (max 100 chars)
    const sanitizedPayload: LoginPayload = {
      ...payload,
      deviceName: payload.deviceName ? payload.deviceName.slice(0, 90) : undefined,
      deviceId: payload.deviceId ? payload.deviceId.slice(0, 90) : undefined,
    };
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      ApiRoute.AUTH.LOGIN,
      sanitizedPayload
    );
    return response.data;
  },

  /**
   * Log in user with Google ID token.
   */
  async SignInWithGoogle(payload: GoogleSignInPayload): Promise<ApiResponse<AuthResponseData>> {
    // Keep device info within backend limit (max 100 chars)
    const sanitizedPayload: GoogleSignInPayload = {
      ...payload,
      deviceName: (payload.deviceName || 'Web Browser').slice(0, 90),
      deviceId: (payload.deviceId || 'web-client').slice(0, 90),
    };
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      ApiRoute.AUTH.GOOGLE_AUTH,
      sanitizedPayload
    );
    return response.data;
  },

  /**
   * Register a new user account or refresh unverified details.
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<{ user: AuthUser }>> {
    const response = await apiClient.post<ApiResponse<{ user: AuthUser }>>(
      ApiRoute.AUTH.REGISTER,
      payload
    );
    return response.data;
  },

  /**
   * Verify account activation OTP.
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      ApiRoute.AUTH.OTP_VERIFICATION,
      payload
    );
    return response.data;
  },

  /**
   * Resend registration activation OTP.
   */
  async resendOtp(payload: ResendOtpPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      ApiRoute.AUTH.RESEND_OTP,
      payload
    );
    return response.data;
  },

  /**
   * Request password recovery OTP.
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      ApiRoute.AUTH.FORGOT_PASSWORD,
      payload
    );
    return response.data;
  },

  /**
   * Validate password reset OTP without invalidating it.
   */
  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<ApiResponse<{ verified: boolean }>> {
    const response = await apiClient.post<ApiResponse<{ verified: boolean }>>(
      ApiRoute.AUTH.VERIFY_RESET_OTP,
      payload
    );
    return response.data;
  },

  /**
   * Finalize password reset with OTP and new password.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      ApiRoute.AUTH.RESET_PASSWORD,
      payload
    );
    return response.data;
  },

  /**
   * Fetch current authenticated user profile.
   */
  async getMe(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(ApiRoute.AUTH.ME);
    return response.data;
  },

  /**
   * Refresh authentication session via HttpOnly cookies.
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
   * Terminate current user session.
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(ApiRoute.AUTH.LOGOUT);
      return response.data;
    } catch {
      return { success: true, message: 'Logged out locally' };
    }
  },

  /**
   * Terminate all active user sessions across all devices.
   */
  async logoutAll(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(ApiRoute.AUTH.LOGOUT_ALL);
      return response.data;
    } catch {
      try {
        const fallback = await apiClient.post<ApiResponse<null>>(
          ApiRoute.AUTH.LOGOUT,
          { allDevices: true },
          { params: { all: true } }
        );
        return fallback.data;
      } catch {
        return { success: true, message: 'Logged out from all devices' };
      }
    }
  },

  /**
   * List all linked authentication providers.
   */
  async getAuthAccounts(): Promise<ApiResponse<AuthAccountsResponse>> {
    const response = await apiClient.get<ApiResponse<AuthAccountsResponse>>(ApiRoute.AUTH.ACCOUNTS);
    return response.data;
  },

  /**
   * Set password for users registered via Google OAuth.
   */
  async setPassword(payload: SetPasswordPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(ApiRoute.AUTH.SET_PASSWORD, payload);
    return response.data;
  },

  /**
   * Change current password (revokes other concurrent sessions).
   */
  async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(ApiRoute.AUTH.CHANGE_PASSWORD, payload);
    return response.data;
  },

  /**
   * Link Google account to the logged-in profile.
   */
  async linkGoogle(payload: LinkGooglePayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(ApiRoute.AUTH.LINK_GOOGLE, payload);
    return response.data;
  },

  /**
   * Unlink an authentication provider.
   */
  async unlinkProvider(provider: AuthProviderType): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(ApiRoute.AUTH.UNLINK_ACCOUNT(provider));
    return response.data;
  },

  /**
   * List active sessions for the current logged-in user.
   */
  async getSessions(): Promise<ApiResponse<UserSessionsListResponse | UserSessionDevice[]>> {
    const response = await apiClient.get<ApiResponse<UserSessionsListResponse | UserSessionDevice[]>>(
      ApiRoute.AUTH.SESSIONS
    );
    return response.data;
  },

  /**
   * Revoke a specific active session.
   */
  async revokeSession(sessionId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(ApiRoute.AUTH.SESSION_ID(sessionId));
    return response.data;
  },

  /**
   * Revoke all active sessions across all devices.
   */
  async revokeAllSessions(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(ApiRoute.AUTH.REVOKE_ALL_SESSIONS);
      return response.data;
    } catch {
      return await this.logoutAll();
    }
  },
};
