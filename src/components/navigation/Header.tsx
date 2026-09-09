'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Bell, ShoppingBag, User, ShieldCheck, Sun, Moon } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import { MeeoLogo } from '../ui/MeeoLogo';
import { SearchInput } from '../ui/SearchInput';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotifications } from '@/context/NotificationContext';
import { useSearchFilter } from '@/context/SearchFilterContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const { openSearchModal, searchQuery, setSearchQuery } = useSearchFilter();
  const { isVisible } = useScrollDirection();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggleTheme = () => {
    toggleTheme();
    showToast(`Switched to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} theme`);
  };

  const navLinks = [
    { label: 'All Categories', href: '/category' },
    { label: 'Footwear', href: '/category?cat=footwear' },
    { label: 'Workspace & Tech', href: '/category?cat=workspace' },
    { label: 'Audio & Sound', href: '/category?cat=audio' },
    { label: 'Home Living', href: '/category?cat=living' },
    { label: 'Objects & Bags', href: '/category?cat=objects' },
    { label: 'Curated Drops', href: '/drops' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-[#e2e7ff]/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top Primary Bar */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <MeeoLogo size="md" />
        </div>

        {/* Global Omni-Search Bar (Triggers ⌘K Modal) */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClick={openSearchModal}
            readOnly
            placeholder="Search products, brands and categories (⌘K)"
          />
        </div>

        {/* Action & Utility Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin Studio Quick Link */}
          <Link
            href="/admin"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#412ce7] text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Studio Admin</span>
          </Link>

          {/* Search Trigger for Mobile/Tablet */}
          <button
            type="button"
            onClick={openSearchModal}
            className="md:hidden w-10 h-10 rounded-xl bg-[#f2f3ff] text-[#464556] flex items-center justify-center hover:bg-[#eaedff] transition-colors cursor-pointer"
            aria-label="Open Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Theme Quick Toggle */}
          <Tooltip title={`Current: ${theme} (${resolvedTheme}) · Click to switch`} arrow>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-[#464556] hover:text-[#412ce7] hover:bg-[#eaedff] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Toggle visual theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#fd6a49]" />
              ) : (
                <Moon className="w-5 h-5 text-[#412ce7]" />
              )}
            </button>
          </Tooltip>

          {/* Wishlist Link (Hidden on mobile where bottom nav provides it) */}
          <Link
            href="/wishlist"
            className="hidden sm:flex relative w-10 h-10 rounded-xl bg-[#f2f3ff] items-center justify-center text-[#464556] hover:text-[#ae3115] hover:bg-[#eaedff] transition-colors shrink-0"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#fd6a49] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Notifications Link (Hidden on mobile where bottom nav / account provides it) */}
          <Link
            href="/notifications"
            className="hidden md:flex relative w-10 h-10 rounded-xl bg-[#f2f3ff] items-center justify-center text-[#464556] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors shrink-0"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#fd6a49] animate-pulse" />
            )}
          </Link>

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={openCartDrawer}
            className="h-10 px-3 sm:px-4 bg-[#412ce7] hover:bg-[#5b4dff] text-white rounded-xl flex items-center gap-2 shadow-[0_2px_8px_rgba(65,44,231,0.2)] transition-all active:scale-95 cursor-pointer shrink-0"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold hidden sm:inline-block">Bag</span>
            <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {itemCount}
            </span>
          </button>

          {/* Account Profile Pill (Hidden on mobile where bottom nav provides it) */}
          <Link
            href="/account"
            className="hidden sm:flex items-center gap-2 pl-1 rounded-full hover:opacity-90 transition-opacity shrink-0"
            aria-label="Account Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] border border-[#dae2fd] flex items-center justify-center text-[#412ce7] relative">
              <User className="w-5 h-5" />
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#fd6a49]" />
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Taxonomy Navigation Sub-Bar */}
      <div className="w-full border-t border-[#e2e7ff]/40 dark:border-[#232d44]/40">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center overflow-x-auto no-scrollbar scroll-smooth">
          <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0 py-1 pr-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#eaedff] dark:bg-[#26314c] text-[#412ce7] dark:text-[#685aff] font-bold shadow-xs'
                      : 'text-[#464556] dark:text-[#a6abbf] hover:text-[#131b2e] dark:hover:text-[#f1f3fa] hover:bg-[#eaedff]/60 dark:hover:bg-[#26314c]/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
