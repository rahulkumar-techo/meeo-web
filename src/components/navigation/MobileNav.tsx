'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Flame, Heart, User, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();
  const { itemCount, openCartDrawer } = useCart();
  const { isVisible } = useScrollDirection();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/category', icon: Compass },
    { label: 'Drops', href: '/drops', icon: Flame },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#faf8ff]/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-t border-[#e2e7ff] dark:border-[#232d44] pb-safe px-1.5 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="grid grid-cols-6 items-center w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all ${
                isActive
                  ? 'text-[#412ce7] dark:text-[#685aff] font-bold'
                  : 'text-[#464556] dark:text-[#a6abbf] hover:text-[#131b2e] dark:hover:text-[#f1f3fa]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#fd6a49] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}

        {/* Quick Cart Floating Tab */}
        <button
          type="button"
          onClick={openCartDrawer}
          className="relative flex flex-col items-center justify-center py-1 px-0.5 text-[#412ce7] dark:text-[#685aff] font-bold cursor-pointer"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#412ce7] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">Cart</span>
        </button>
      </div>
    </nav>
  );
};
