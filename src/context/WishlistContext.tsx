'use client';

import React, { createContext, useContext } from 'react';
import { useWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/hooks/wishlist/useWishlist';
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
  const { data: wishlistData } = useWishlistQuery();
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  const items = wishlistData?.data?.items || [];
  const wishlistIds = items.map((item) => item.productId || item.id);

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  const clearWishlist = () => {
    items.forEach((item) => {
      removeMutation.mutate(item.productId || item.id);
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts: items,
        wishlistCount: wishlistData?.data?.totalItems || items.length,
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
