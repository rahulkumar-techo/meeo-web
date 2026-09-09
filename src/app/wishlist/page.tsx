'use client';

import React from 'react';
import { WishlistHero } from '@/features/wishlist/WishlistHero';
import { WishlistGrid } from '@/features/wishlist/WishlistGrid';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { wishlistProducts, wishlistCount } = useWishlist();

  return (
    <div className="flex flex-col w-full pb-20">
      <WishlistHero count={wishlistCount} />
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <WishlistGrid products={wishlistProducts} />
      </div>
    </div>
  );
}
