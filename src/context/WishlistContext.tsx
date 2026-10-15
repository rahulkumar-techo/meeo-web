'use client';

import React, { createContext, useContext } from 'react';
import { useWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/hooks/wishlist/useWishlist';
import { useUserStore } from '@/store/user.store';
import { useToast } from '@/context/ToastContext';
import { AppRoute } from '@/routes';
import type { WishlistItem } from '@/types/wishlist/wishlist.types';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: WishlistItem[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const { showToast } = useToast();
  const { data: wishlistData } = useWishlistQuery();
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  const items = isAuthenticated ? wishlistData?.data?.items || [] : [];
  const backendIds = items.map((item) => item.productId || item.id);

  const isInWishlist = (productId: string) => {
    if (!isAuthenticated) return false;
    return backendIds.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      showToast('Please sign in to save items to your wishlist.', 'info');
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        setTimeout(() => {
          window.location.href = AppRoute.AUTH.LOGIN_WITH_REDIRECT(currentPath);
        }, 350);
      }
      return;
    }

    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  const clearWishlist = () => {
    if (!isAuthenticated) return;
    items.forEach((item) => {
      removeMutation.mutate(item.productId || item.id);
    });
  };

  const totalCount = isAuthenticated
    ? (wishlistData?.data?.totalItems || items.length)
    : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: backendIds,
        wishlistProducts: items,
        wishlistCount: totalCount,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
