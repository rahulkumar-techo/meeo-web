'use client';

import React, { createContext, useContext } from 'react';
import { useWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/hooks/wishlist/useWishlist';
import { useUserStore } from '@/store/user.store';
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
  const { data: wishlistData } = useWishlistQuery();
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  const [guestWishlistIds, setGuestWishlistIds] = React.useState<string[]>([]);

  // Load guest wishlist on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('urbannest_guest_wishlist');
        if (saved) setGuestWishlistIds(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const items = wishlistData?.data?.items || [];
  const backendIds = items.map((item) => item.productId || item.id);
  const activeWishlistIds = isAuthenticated ? backendIds : guestWishlistIds;

  const isInWishlist = (productId: string) => {
    return activeWishlistIds.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      setGuestWishlistIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('urbannest_guest_wishlist', JSON.stringify(next));
          } catch (e) {}
        }
        return next;
      });
      return;
    }

    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  const clearWishlist = () => {
    if (!isAuthenticated) {
      setGuestWishlistIds([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('urbannest_guest_wishlist');
      }
      return;
    }
    items.forEach((item) => {
      removeMutation.mutate(item.productId || item.id);
    });
  };

  const totalCount = isAuthenticated
    ? (wishlistData?.data?.totalItems || items.length)
    : guestWishlistIds.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: activeWishlistIds,
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
