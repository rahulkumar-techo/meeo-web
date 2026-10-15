'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  ShoppingBag,
  Star,
  Check,
  X,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type { CatalogItem } from '@/data/urbanNestCatalog';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useCategoriesQuery } from '@/hooks/catalog/useCatalog';
import { productService } from '@/services/product/productService';
import { mapApiProductToCatalogItem } from '@/services/product/productAdapter';
import { useUserStore } from '@/store/user.store';
import { AppRoute } from '@/routes';

const PRICE_TIERS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-3k', label: 'Under ₹3,000', min: 0, max: 3000 },
  { id: '3k-6k', label: '₹3,000 – ₹6,000', min: 3000, max: 6000 },
  { id: '6k-9k', label: '₹6,000 – ₹9,000', min: 6000, max: 9000 },
  { id: 'above-9k', label: 'Above ₹9,000', min: 9000, max: Infinity },
];

export const CatalogView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  // Read URL query params
  const initialCategory = searchParams.get('cat') || searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialDeals = searchParams.get('deals') === 'true';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = (searchParams.get('sort') as any) || 'featured';
  const initialView = searchParams.get('view') || 'products';

  // Local Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand !== 'all' ? [initialBrand] : []
  );
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [dealsOnly, setDealsOnly] = useState<boolean>(initialDeals);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [activeView, setActiveView] = useState<'products' | 'categories'>(
    initialView === 'categories' ? 'categories' : 'products'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category state when URL changes
  React.useEffect(() => {
    const cat = searchParams.get('cat') || searchParams.get('category');
    if (cat) setSelectedCategory(cat.toLowerCase());
    const deals = searchParams.get('deals') === 'true';
    if (deals) setDealsOnly(true);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    const view = searchParams.get('view');
    if (view === 'categories') setActiveView('categories');
  }, [searchParams]);

  // Brand toggle handler
  const handleToggleBrand = (brand: string) => {
    if (brand === 'All') {
      setSelectedBrands([]);
      return;
    }
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSelectedPriceTier('all');
    setDealsOnly(false);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Live Categories from Backend API
  const { data: apiCategoriesRes } = useCategoriesQuery(false);
  const apiCategories = useMemo(() => apiCategoriesRes?.data || [], [apiCategoriesRes]);

  // Live visual categories grid data
  const displayCategories = useMemo(() => {
    return apiCategories.map((c) => ({
      id: c.slug || c.id,
      label: c.name,
      slug: c.slug,
      count: c.productCount ? `${c.productCount} Products` : undefined,
      image: c.imageUrl || '/assets/urbannest/cat-lifestyle.jpg',
    }));
  }, [apiCategories]);

  // Sidebar and drawer filter options
  const filterCategoriesList = useMemo(() => {
    const base = [{ key: 'all', label: 'All Products' }];
    return [
      ...base,
      ...apiCategories.map((c) => ({
        key: c.slug || c.id,
        label: c.name,
      })),
    ];
  }, [apiCategories]);

  // Live Products from Backend API
  const [apiProducts, setApiProducts] = useState<CatalogItem[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchCatalogProducts() {
      try {
        setIsLoadingApi(true);
        const res = await productService.getProducts({ limit: 50 });
        if (isMounted && res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map(mapApiProductToCatalogItem);
          setApiProducts(mapped);
        }
      } catch {
        // Log warning
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }
    fetchCatalogProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Use only live API products
  const catalogProducts = useMemo(() => {
    return apiProducts;
  }, [apiProducts]);

  // Dynamically compute available brands including live API brands (boAt, Sonus, Apple, etc.)
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    catalogProducts.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return ['All', ...Array.from(brandsSet)];
  }, [catalogProducts]);

  // Active filters count
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (selectedPriceTier !== 'all' ? 1 : 0) +
    (dealsOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const sel = selectedCategory.toLowerCase();
        const matchesCategory =
          product.categoryKey?.toLowerCase() === sel ||
          product.gender?.toLowerCase() === sel ||
          product.category?.toLowerCase().includes(sel) ||
          (sel === 'sneakers' && product.categoryKey === 'footwear');
        if (!matchesCategory) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const matchesBrand = selectedBrands.some(
          (b) => product.brand.toLowerCase() === b.toLowerCase()
        );
        if (!matchesBrand) return false;
      }

      // Price filter
      if (selectedPriceTier !== 'all') {
        const tier = PRICE_TIERS.find((t) => t.id === selectedPriceTier);
        if (tier) {
          if (product.price < tier.min || product.price > tier.max) return false;
        }
      }

      // Deals filter
      if (dealsOnly && !product.isDeal) return false;

      // In stock filter
      if (inStockOnly && !product.inStock) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          (product.description && product.description.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // 'featured' keeps default curated order
    });
  }, [
    selectedCategory,
    selectedBrands,
    selectedPriceTier,
    dealsOnly,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  // Handle Quick Add to Cart
  const handleQuickAdd = async (product: CatalogItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isAuth = useUserStore.getState().isAuthenticated;
    if (!isAuth) {
      showToast('Please sign in to add items to your shopping bag.', 'info');
      router.push(AppRoute.AUTH.LOGIN_WITH_REDIRECT(window.location.pathname + window.location.search));
      return;
    }

    try {
      const pPayload: any = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
      };
      await addToCart(pPayload, 1, product.colors?.[0], product.sizes?.[0]);
      showToast(`${product.name} added to shopping bag.`, 'success');
      openCartDrawer();
    } catch (err) {
      // fallback
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5]">
      {/* Sleek, Compact Top Navigation Bar */}
      <div className="border-b border-[#E8E2DA] bg-[#FAF8F5] py-2.5 sm:py-3">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb + Title Inline */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <nav className="flex items-center gap-1.5 text-xs text-[#786C64]">
              <Link href="/" className="hover:text-[#2D2621] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#2D2621] font-semibold">
                {dealsOnly ? 'Deals' : 'Shop'}
              </span>
              {selectedCategory !== 'all' && (
                <>
                  <span>/</span>
                  <span className="capitalize text-[#8C5338] font-semibold">
                    {selectedCategory}
                  </span>
                </>
              )}
            </nav>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#E8E2DA]" />
            <h1 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-[#2D2621]">
              {dealsOnly
                ? 'Exclusive Deals'
                : selectedCategory !== 'all'
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                : 'All Products & Silhouettes'}
            </h1>
            <span className="text-xs text-[#786C64] font-medium">
              ({filteredProducts.length} items)
            </span>
          </div>

          {/* View Mode Toggle Pill */}
          <div className="flex items-center gap-1 p-0.5 bg-[#EFEAE4] rounded-xl border border-[#E5DFD7]">
            <button
              type="button"
              onClick={() => setActiveView('products')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'products'
                  ? 'bg-white text-[#2D2621] shadow-2xs'
                  : 'text-[#786C64] hover:text-[#2D2621]'
              }`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setActiveView('categories')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'categories'
                  ? 'bg-white text-[#2D2621] shadow-2xs'
                  : 'text-[#786C64] hover:text-[#2D2621]'
              }`}
            >
              Categories
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area (Compact Spacing) */}
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        {/* If Visual Categories View is Selected */}
        {activeView === 'categories' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {displayCategories.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveView('products');
                  }}
                  className="group relative flex flex-col p-2.5 rounded-2xl bg-white border border-[#E8E2DA] hover:border-[#8C5338]/40 hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF8F5] mb-2">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      loading="eager"
                      priority={idx < 4}
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between px-0.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#2D2621] group-hover:text-[#8C5338] transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-[10px] text-[#786C64]">{cat.count}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#786C64] group-hover:translate-x-0.5 group-hover:text-[#8C5338] transition-all" />
                  </div>
                </button>
              ))}
            </div>

            {/* Also preview products right below on the same screen */}
            <div className="pt-2 border-t border-[#E8E2DA]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#2D2621] uppercase tracking-wider">
                  Featured In Catalog ({filteredProducts.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActiveView('products')}
                  className="text-xs font-semibold text-[#8C5338] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Filter Products</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {filteredProducts.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white rounded-xl border border-[#E8E2DA] p-2.5 flex flex-col justify-between hover:border-[#8C5338]/30 hover:shadow-sm transition-all"
                  >
                    <div className="relative w-full aspect-square bg-[#FAF8F5] rounded-lg p-2 overflow-hidden mb-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="16vw"
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#786C64] uppercase font-semibold truncate">
                        {product.brand}
                      </div>
                      <h4 className="text-xs font-bold text-[#2D2621] truncate group-hover:text-[#8C5338]">
                        {product.name}
                      </h4>
                      <div className="text-xs font-bold text-[#2D2621] mt-0.5">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Products Grid with Sidebar Filters */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white rounded-2xl border border-[#E8E2DA] p-5 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E2DA] pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2D2621]">
                  <SlidersHorizontal className="w-4 h-4 text-[#8C5338]" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#8C5338] text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-xs text-[#8C5338] hover:underline font-semibold cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64] mb-3">
                  Categories
                </h4>
                <div className="flex flex-col gap-1">
                  {filterCategoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                            : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8C5338]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="border-t border-[#E8E2DA] pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64] mb-3">
                  Brands
                </h4>
                <div className="space-y-2">
                  {availableBrands.map((brand) => {
                    const isChecked =
                      brand === 'All'
                        ? selectedBrands.length === 0
                        : selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 text-xs text-[#2D2621] hover:text-[#8C5338] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBrand(brand)}
                          className="w-4 h-4 rounded border-[#E8E2DA] text-[#8C5338] focus:ring-[#8C5338] accent-[#8C5338] cursor-pointer"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-[#E8E2DA] pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64] mb-3">
                  Price Bracket
                </h4>
                <div className="space-y-1.5">
                  {PRICE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedPriceTier(tier.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        selectedPriceTier === tier.id
                          ? 'bg-[#EFEAE4] font-bold text-[#2D2621]'
                          : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
                      }`}
                    >
                      <span>{tier.label}</span>
                      {selectedPriceTier === tier.id && (
                        <Check className="w-3.5 h-3.5 text-[#8C5338]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Toggles */}
              <div className="border-t border-[#E8E2DA] pt-5 space-y-3">
                <label className="flex items-center justify-between text-xs font-medium text-[#2D2621] cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C5338]" />
                    Deals & Discounts Only
                  </span>
                  <input
                    type="checkbox"
                    checked={dealsOnly}
                    onChange={(e) => setDealsOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E2DA] text-[#8C5338] focus:ring-[#8C5338] accent-[#8C5338] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-medium text-[#2D2621] cursor-pointer">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E2DA] text-[#8C5338] focus:ring-[#8C5338] accent-[#8C5338] cursor-pointer"
                  />
                </label>
              </div>
            </aside>

            {/* Products Main Column */}
            <div className="lg:col-span-9 flex flex-col gap-3 sm:gap-3.5">
              
              {/* Sorting & Filter Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#E8E2DA]">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EFEAE4] text-xs font-bold text-[#2D2621] border border-[#E5DFD7] cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-[#8C5338]" />
                  <span>Filters ({activeFiltersCount})</span>
                </button>

                {/* Results Count & Search Query Info */}
                <div className="text-xs text-[#786C64]">
                  Showing{' '}
                  <span className="font-bold text-[#2D2621]">
                    {filteredProducts.length}
                  </span>{' '}
                  products
                  {searchQuery && (
                    <span>
                      {' '}
                      for &ldquo;<strong className="text-[#2D2621]">{searchQuery}</strong>&rdquo;
                    </span>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#786C64] font-medium hidden sm:inline">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg px-3 py-1.5 pr-7 text-xs font-bold text-[#2D2621] focus:outline-none focus:border-[#8C5338] cursor-pointer"
                    >
                      <option value="featured">Featured / Curated</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest Drops</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#786C64]" />
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#786C64]">Active Filters:</span>
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] text-xs font-medium text-[#2D2621]">
                      Category: {selectedCategory}
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className="hover:text-[#8C5338]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedBrands.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] text-xs font-medium text-[#2D2621]"
                    >
                      Brand: {b}
                      <button
                        type="button"
                        onClick={() => handleToggleBrand(b)}
                        className="hover:text-[#8C5338]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedPriceTier !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] text-xs font-medium text-[#2D2621]">
                      Price: {PRICE_TIERS.find((t) => t.id === selectedPriceTier)?.label}
                      <button
                        type="button"
                        onClick={() => setSelectedPriceTier('all')}
                        className="hover:text-[#8C5338]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {dealsOnly && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C5338]/10 text-xs font-semibold text-[#8C5338]">
                      Deals Only
                      <button
                        type="button"
                        onClick={() => setDealsOnly(false)}
                        className="hover:text-[#2D2621]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] text-xs font-medium text-[#2D2621]">
                      In Stock
                      <button
                        type="button"
                        onClick={() => setInStockOnly(false)}
                        className="hover:text-[#8C5338]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] text-xs font-medium text-[#2D2621]">
                      &ldquo;{searchQuery}&rdquo;
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="hover:text-[#8C5338]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-xs text-[#8C5338] hover:underline font-semibold ml-2 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
                  {filteredProducts.map((product) => {
                    const isWishlisted = isInWishlist(product.id);
                    return (
                      <div
                        key={product.id}
                        className="group relative flex flex-col bg-white rounded-2xl border border-[#E8E2DA] hover:border-[#8C5338]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        {/* Image Container with Badges & Wishlist */}
                        <div className="relative w-full aspect-square bg-[#FAF8F5] overflow-hidden p-6">
                          <Link
                            href={
                              product.id === 'nike-af1-07'
                                ? '/product/urban-nike-af1'
                                : `/product/${product.id}`
                            }
                            className="block relative w-full h-full"
                          >
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>

                          {/* Top-Left Badge */}
                          {product.badge && (
                            <div className="absolute top-3.5 left-3.5 z-10">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-2xs ${
                                  product.badge === 'Bestseller'
                                    ? 'bg-[#8C5338] text-white'
                                    : product.badge === 'New'
                                    ? 'bg-[#2D2621] text-white'
                                    : 'bg-[#C27838] text-white'
                                }`}
                              >
                                {product.badge}
                              </span>
                            </div>
                          )}

                          {/* Top-Right Heart Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product.id);
                              showToast(
                                isWishlisted
                                  ? `Removed ${product.name} from wishlist.`
                                  : `Saved ${product.name} to wishlist.`,
                                'info'
                              );
                            }}
                            className={`absolute top-3.5 right-3.5 z-10 w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                              isWishlisted
                                ? 'bg-[#8C5338] text-white'
                                : 'bg-white/90 text-[#786C64] hover:text-[#8C5338] hover:bg-white'
                            }`}
                            aria-label={`Wishlist ${product.name}`}
                          >
                            <Heart
                              className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : ''}`}
                            />
                          </button>
                        </div>

                        {/* Product Info Content */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="text-[11px] font-semibold text-[#786C64] uppercase tracking-wider mb-1">
                              {product.category}
                            </div>
                            <Link
                              href={
                                product.id === 'nike-af1-07'
                                  ? '/product/urban-nike-af1'
                                  : `/product/${product.id}`
                              }
                              className="block"
                            >
                              <h3 className="font-sans text-sm sm:text-base font-bold text-[#2D2621] group-hover:text-[#8C5338] transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#786C64]">
                              <div className="flex items-center text-[#C27838]">
                                <Star className="w-3.5 h-3.5 fill-[#C27838]" />
                              </div>
                              <span className="font-semibold text-[#2D2621]">{product.rating}</span>
                              <span>({product.reviewCount})</span>
                            </div>
                          </div>

                          {/* Price & Action Button */}
                          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#E8E2DA]/80">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-sm sm:text-base text-[#2D2621]">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-[#786C64] line-through">
                                    ₹{product.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              {product.discount && (
                                <span className="text-[10px] font-bold text-[#C27838]">
                                  {product.discount}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleQuickAdd(product, e)}
                              className="w-9 h-9 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-2xs"
                              aria-label={`Add ${product.name} to cart`}
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Filter State */
                <div className="bg-white rounded-2xl border border-[#E8E2DA] p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#786C64] mb-4">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2D2621] mb-2">
                    No matching products found
                  </h3>
                  <p className="text-xs text-[#786C64] max-w-sm mb-6">
                    Try loosening your filters, removing search keywords, or resetting to browse our entire footwear and lifestyle collection.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 rounded-full bg-[#8C5338] text-white text-xs font-semibold hover:bg-[#72422C] transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E8E2DA] pb-4 mb-5">
                <div className="font-bold text-sm text-[#2D2621] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8C5338]" />
                  <span>Filter Products</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-[#786C64] hover:text-[#2D2621]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64] mb-3">
                  Categories
                </h4>
                <div className="flex flex-col gap-1.5">
                  {filterCategoriesList.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`text-left px-3 py-2 rounded-lg text-xs ${
                        selectedCategory === cat.key
                          ? 'bg-[#EFEAE4] font-bold text-[#2D2621]'
                          : 'text-[#786C64]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="mb-6 border-t border-[#E8E2DA] pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64] mb-3">
                  Brands
                </h4>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-xs text-[#2D2621]">
                      <input
                        type="checkbox"
                        checked={
                          brand === 'All'
                            ? selectedBrands.length === 0
                            : selectedBrands.includes(brand)
                        }
                        onChange={() => handleToggleBrand(brand)}
                        className="accent-[#8C5338]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Deals */}
              <div className="border-t border-[#E8E2DA] pt-4">
                <label className="flex items-center justify-between text-xs font-medium text-[#2D2621]">
                  <span>Deals Only</span>
                  <input
                    type="checkbox"
                    checked={dealsOnly}
                    onChange={(e) => setDealsOnly(e.target.checked)}
                    className="accent-[#8C5338]"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E2DA] mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 py-2.5 rounded-xl border border-[#E8E2DA] text-xs font-semibold text-[#786C64]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#8C5338] text-white text-xs font-semibold"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
