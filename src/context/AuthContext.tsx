'use client';

import React, { createContext, useContext } from 'react';
import { AuthUser, LoginCredentials, RegisterPayload } from '@/services/auth/authService';
import {
  useCurrentUserQuery,
  useLoginMutation,
  useSocialLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from '@/hooks/useAuthMutations';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_KEYS } from '@/hooks/useAuthMutations';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPassword: (credentials: LoginCredentials) => Promise<AuthUser>;
  loginWithSocial: (provider: 'google' | 'apple' | 'passkey') => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: user = null, isLoading } = useCurrentUserQuery();

  const loginMutation = useLoginMutation();
  const socialLoginMutation = useSocialLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const loginWithPassword = async (credentials: LoginCredentials): Promise<AuthUser> => {
    return await loginMutation.mutateAsync(credentials);
  };

  const loginWithSocial = async (provider: 'google' | 'apple' | 'passkey'): Promise<AuthUser> => {
    return await socialLoginMutation.mutateAsync(provider);
  };

  const register = async (payload: RegisterPayload): Promise<AuthUser> => {
    return await registerMutation.mutateAsync(payload);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const setUser = (newUser: AuthUser | null) => {
    queryClient.setQueryData(AUTH_KEYS.user(), newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: Boolean(user),
        isLoading,
        loginWithPassword,
        loginWithSocial,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
