/**
 * Meeo Authentication & Identity Service
 * Handles user sign in, registration, OTP delivery & validation, and password recovery.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberTier: 'Standard' | 'Studio Member' | 'Archival Club' | 'Founding Collector';
  memberPoints: number;
  avatarUrl?: string;
  token: string;
}

export interface LoginCredentials {
  identifier: string; // Email or Phone
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  interests?: string[];
}

export interface OtpRequest {
  destination: string; // Email or Phone number
  type: 'login' | 'register' | 'forgot_password' | 'phone_verify';
  channel?: 'sms' | 'whatsapp' | 'email';
}

export interface OtpVerifyPayload {
  destination: string;
  otp: string;
  type: 'login' | 'register' | 'forgot_password' | 'phone_verify';
}

export interface ResetPasswordPayload {
  destination: string;
  otp: string;
  newPassword: string;
}

const STORAGE_KEY = 'meeo_auth_user';

export const authService = {
  /**
   * Returns currently stored user from localStorage
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save session to storage
   */
  saveSession(user: AuthUser, remember = true): void {
    if (typeof window === 'undefined') return;
    try {
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to persist auth session', e);
    }
  },

  /**
   * Clear session from storage
   */
  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  },

  /**
   * Sign in with Email / Phone + Password
   */
  async loginWithPassword(credentials: LoginCredentials): Promise<AuthUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Basic mock validation: accept test logins
    const isMockMatch =
      credentials.identifier.includes('@') ||
      credentials.identifier.replace(/\D/g, '').length >= 10;

    if (!isMockMatch) {
      throw new Error('Please enter a valid email address or 10-digit mobile number');
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const mockUser: AuthUser = {
      id: 'usr_meeo_' + Date.now().toString(36),
      name: credentials.identifier.includes('@')
        ? credentials.identifier.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
        : 'Milo Kapoor',
      email: credentials.identifier.includes('@')
        ? credentials.identifier.toLowerCase()
        : 'milo.kapoor@studio.meeo',
      phone: !credentials.identifier.includes('@')
        ? credentials.identifier
        : '+91 98450 12345',
      memberTier: 'Studio Member',
      memberPoints: 1200,
      avatarUrl: undefined,
      token: 'jwt_mock_token_' + Math.random().toString(36).substring(2),
    };

    this.saveSession(mockUser, credentials.rememberMe ?? true);
    return mockUser;
  },

  /**
   * Sign in via Social Identity Provider (Google, Apple, Passkey)
   */
  async loginWithSocial(provider: 'google' | 'apple' | 'passkey'): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const providerNames: Record<string, string> = {
      google: 'Google Account User',
      apple: 'Apple ID User',
      passkey: 'Passkey Verified User',
    };

    const mockUser: AuthUser = {
      id: `usr_${provider}_` + Date.now().toString(36),
      name: providerNames[provider] || 'Studio Member',
      email: `collector.${provider}@studio.meeo`,
      phone: '+91 98450 12345',
      memberTier: 'Founding Collector',
      memberPoints: 1500,
      token: `jwt_${provider}_token_` + Math.random().toString(36).substring(2),
    };

    this.saveSession(mockUser, true);
    return mockUser;
  },

  /**
   * Register a new collector profile
   */
  async register(payload: RegisterPayload): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!payload.name || payload.name.trim().length < 2) {
      throw new Error('Please enter your full name');
    }

    if (!payload.email || !payload.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (!payload.password || payload.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const newUser: AuthUser = {
      id: 'usr_' + Date.now().toString(36),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone || '+91 98450 00000',
      memberTier: 'Standard',
      memberPoints: 200, // Welcome bonus points
      token: 'jwt_reg_token_' + Math.random().toString(36).substring(2),
    };

    this.saveSession(newUser, true);
    return newUser;
  },

  /**
   * Send an OTP code to email or mobile phone
   */
  async sendOtp(req: OtpRequest): Promise<{ success: boolean; message: string; expirySeconds: number }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!req.destination || req.destination.trim().length < 3) {
      throw new Error('Invalid destination address or phone number');
    }

    const channel = req.channel || (req.destination.includes('@') ? 'email' : 'sms');
    const channelName = channel === 'email' ? 'email' : channel === 'whatsapp' ? 'WhatsApp' : 'SMS';

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched via ${channelName} to ${req.destination}.`,
      expirySeconds: 60,
    };
  },

  /**
   * Resend an OTP code with channel selection
   */
  async resendOtp(req: OtpRequest): Promise<{ success: boolean; message: string; expirySeconds: number }> {
    return this.sendOtp(req);
  },

  /**
   * Verify entered 6-digit OTP
   */
  async verifyOtp(payload: OtpVerifyPayload): Promise<AuthUser | { verified: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 750));

    // Simulated test OTP: accept '123456' or any 6-digit number in mock demo mode
    if (payload.otp.length !== 6) {
      throw new Error('Please enter a complete 6-digit verification code');
    }

    // Demo check: if someone enters 000000, reject as mock error demonstration
    if (payload.otp === '000000') {
      throw new Error('Invalid verification code. Please check and try again.');
    }

    if (payload.type === 'login' || payload.type === 'register') {
      const isEmail = payload.destination.includes('@');
      const user: AuthUser = {
        id: 'usr_otp_' + Date.now().toString(36),
        name: isEmail ? payload.destination.split('@')[0] : 'Tactile Collector',
        email: isEmail ? payload.destination : 'collector@studio.meeo',
        phone: !isEmail ? payload.destination : '+91 98450 12345',
        memberTier: 'Studio Member',
        memberPoints: 1200,
        token: 'jwt_otp_token_' + Math.random().toString(36).substring(2),
      };
      this.saveSession(user, true);
      return user;
    }

    return { verified: true };
  },

  /**
   * Reset Password with token or OTP
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!payload.newPassword || payload.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    return {
      success: true,
      message: 'Your password has been successfully updated. Please sign in with your new password.',
    };
  },
};
