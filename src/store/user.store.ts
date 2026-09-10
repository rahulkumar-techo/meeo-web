/**
 * @file user.store.ts
 * @description Zustand User & Authentication Store for Meeo Web.
 * Handles user identity, access tokens, hydration state, and session persistence.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/services/auth/auth.type';
import { authService } from '@/services/auth/authService';

export interface UserState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken?: string) => void;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<AuthUser | null>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setAuth: (user: AuthUser, accessToken: string, refreshToken?: string) => {
        set({
          user,
          accessToken,
          refreshToken: refreshToken || get().refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (user: AuthUser | null) => {
        set({
          user,
          isAuthenticated: Boolean(user),
        });
      },

      setAccessToken: (accessToken: string | null) => {
        set({
          accessToken,
          isAuthenticated: Boolean(accessToken && get().user),
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setHydrated: (isHydrated: boolean) => {
        set({ isHydrated });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true });
          const res = await authService.getMe();
          if (res.success && res.data) {
            set({
              user: res.data,
              isAuthenticated: true,
              isLoading: false,
            });
            return res.data;
          } else {
            get().logout();
            return null;
          }
        } catch {
          get().logout();
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'meeo_user_auth_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

/**
 * Convenient selector hook compatible with existing useAuth usage
 */
export const useAuth = () => {
  const user = useUserStore((s) => s.user);
  const accessToken = useUserStore((s) => s.accessToken);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const isLoading = useUserStore((s) => s.isLoading);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const logout = useUserStore((s) => s.logout);
  const setUser = useUserStore((s) => s.setUser);
  const setAuth = useUserStore((s) => s.setAuth);
  const fetchCurrentUser = useUserStore((s) => s.fetchCurrentUser);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isHydrated,
    logout,
    setUser,
    setAuth,
    fetchCurrentUser,
  };
};
