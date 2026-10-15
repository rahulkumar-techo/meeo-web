'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { UrbanNestProduct } from '@/data/urbanNestData';
import { productService } from '@/services/product/productService';
import { mapApiProductToUrbanNestProduct } from '@/services/product/productAdapter';
import { AppRoute } from '@/routes';

const NAV_LINKS = [
  { label: 'Home', href: AppRoute.HOME },
  { label: 'Shop', href: AppRoute.CATEGORY },
  { label: 'Categories', href: `${AppRoute.CATEGORY}?view=categories` },
  { label: 'Deals', href: `${AppRoute.CATEGORY}?deals=true` },
  { label: 'About', href: AppRoute.ABOUT },
];

export const UrbanNestHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchCatalog, setSearchCatalog] = useState<UrbanNestProduct[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadSearchProducts() {
      try {
        const res = await productService.getProducts({ limit: 20 });
        if (isMounted && res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(mapApiProductToUrbanNestProduct);
          setSearchCatalog(mapped);
        }
      } catch {}
    }
    loadSearchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedCartCount = itemCount;

  // Filter products for instant dropdown suggestions
  const searchResults = searchQuery.trim()
    ? searchCatalog.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(AppRoute.CATEGORY_WITH_QUERY(searchQuery));
    }
  };

  const handleSelectResult = (productId: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setMobileSearchOpen(false);
    router.push(AppRoute.PRODUCT(productId));
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2DA] transition-all">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 h-18 sm:h-20 flex items-center justify-between gap-6">
        
        {/* Left Cluster: Wordmark + Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-10 shrink-0">
          <Link
            href="/"
            className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2621] hover:opacity-90 transition-opacity"
            aria-label="UrbanNest Home"
          >
            UrbanNest
          </Link>

          {/* Desktop Navigation Links (Directly following brand) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isDeals = searchParams?.get('deals') === 'true';
              const isCategoriesView = searchParams?.get('view') === 'categories';
              let isActive = false;

              if (link.label === 'Home') {
                isActive = pathname === '/';
              } else if (link.label === 'Deals') {
                isActive = pathname.startsWith('/category') && isDeals;
              } else if (link.label === 'Categories') {
                isActive = pathname.startsWith('/category') && isCategoriesView;
              } else if (link.label === 'Shop') {
                isActive =
                  pathname.startsWith('/category') && !isDeals && !isCategoriesView;
              } else if (link.label === 'About') {
                isActive = pathname.startsWith('/about');
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1 transition-colors ${
                    isActive
                      ? 'text-[#2D2621] font-semibold'
                      : 'text-[#786C64] hover:text-[#2D2621]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2D2621] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Cluster: Search Input + Utility Icons (Grouped Together matching reference) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Desktop Search Input (Pill, Warm Sand Background, Exact Reference Proportions) */}
          <div
            ref={searchContainerRef}
            className="relative hidden md:block"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-[#786C64]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for products, brands..."
                className="w-64 lg:w-72 xl:w-80 h-9.5 pl-9 pr-8 py-1.5 rounded-full bg-[#EFEAE4] hover:bg-[#EAE4DC] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] border border-[#E5DFD7] focus:border-[#8C5338]/40 focus:ring-1 focus:ring-[#8C5338]/20 transition-all focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786C64] hover:text-[#2D2621] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Instant Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#E8E2DA] p-3 z-50 animate-urban-fadeInUp">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="text-[10px] uppercase font-bold text-[#786C64] tracking-wider px-2 py-1">
                        Products ({searchResults.length})
                      </div>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleSelectResult(product.id)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F3EFEA] transition-colors text-left w-full cursor-pointer group"
                        >
                          <div className="relative w-10 h-10 rounded-lg bg-[#F3EFEA] border border-[#E8E2DA] overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#2D2621] group-hover:text-[#8C5338] truncate transition-colors">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-[#786C64]">
                              {product.category} • ₹{product.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#786C64] group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-semibold text-[#8C5338] hover:underline pt-2 px-2 text-left cursor-pointer"
                      >
                        View all results for &quot;{searchQuery}&quot; →
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#786C64]">
                      No results for &quot;{searchQuery}&quot;. Try searching for Nike, Samba, or Sneakers.
                    </div>
                  )
                ) : (
                  <div className="p-2">
                    <div className="text-[10px] uppercase font-bold text-[#786C64] tracking-wider mb-2">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Nike Air Force 1', 'Samba OG', 'New Balance 574', 'Puma Suede'].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            setIsSearchFocused(true);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#F3EFEA] hover:bg-[#EAE4DC] text-xs text-[#2D2621] transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#2D2621] hover:bg-[#F3EFEA] transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Account Profile Link */}
          <Link
            href="/account"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2D2621] hover:bg-[#F3EFEA] transition-colors"
            aria-label="Account"
          >
            <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </Link>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2D2621] hover:bg-[#F3EFEA] transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#C27838] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag with Badge */}
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2D2621] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
            aria-label={`Shopping Bag with ${displayedCartCount} items`}
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#8C5338] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-2xs">
              {displayedCartCount}
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#2D2621] hover:bg-[#F3EFEA] transition-colors ml-0.5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#E8E2DA]/60 bg-[#FAF8F5]">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C64]" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands..."
              className="w-full h-10 pl-10 pr-8 py-2 rounded-full bg-[#EFEAE4] text-xs text-[#2D2621] placeholder:text-[#786C64] border border-[#E5DFD7] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786C64]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2DA] bg-[#FAF8F5] px-6 py-5 shadow-lg">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium py-1 transition-colors ${
                    isActive ? 'text-[#8C5338] font-semibold' : 'text-[#2D2621] hover:text-[#8C5338]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
