'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import type { CatalogItem } from '@/data/meeoCatalog';
import { productService } from '@/services/product/productService';
import { mapApiProductToCatalogItem } from '@/services/product/productAdapter';
import { useUserStore } from '@/store/user.store';
import { AppRoute } from '@/routes';

export default function WishlistPage() {
  const { isAuthenticated } = useUserStore();
  const { wishlistIds, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart, openCartDrawer } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        setIsLoading(true);
        const res = await productService.getProducts({ limit: 50 });
        if (isMounted && res.success && res.data) {
          setProducts(res.data.map(mapApiProductToCatalogItem));
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Find all wishlisted items from catalog
  const wishlistedItems = products.filter((product) =>
    wishlistIds.includes(product.id)
  );

  // Recommended products for empty state
  const recommendedItems = products.slice(0, 4);

  const handleMoveToCart = async (product: CatalogItem) => {
    try {
      const payload: any = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
      };
      await addToCart(payload, 1, product.colors?.[0], product.sizes?.[0]);
      showToast(`${product.name} is now in your shopping bag.`, 'success');
      openCartDrawer();
    } catch (e) {
      // ignore
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAF8F5] py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#EFEAE4] border border-[#E8E2DA] flex items-center justify-center mx-auto mb-6 text-[#8C5338]">
            <Heart className="w-9 h-9" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2D2621] mb-3">Sign In to View Wishlist</h1>
          <p className="text-xs text-[#786C64] mb-6 leading-relaxed">
            Your saved items and personal vault require an active account. Please sign in or register to view and save products.
          </p>
          <Link
            href={AppRoute.AUTH.LOGIN_WITH_REDIRECT(AppRoute.WISHLIST)}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#786C64] mb-4">
          <Link href="/" className="hover:text-[#2D2621] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#2D2621] font-semibold">Wishlist</span>
        </nav>

        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2DA] pb-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C5338]">
              Personal Vault
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2D2621] mt-1.5 tracking-tight">
              Saved Items ({wishlistedItems.length})
            </h1>
            <p className="text-sm text-[#786C64] mt-2">
              Review your saved items and curated collection before they sell out.
            </p>
          </div>

          {wishlistedItems.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs font-semibold text-[#8C5338] hover:underline self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Entire Wishlist</span>
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlistedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistedItems.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-[#E8E2DA] hover:border-[#8C5338]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image Stage */}
                <div className="relative w-full aspect-square bg-[#FAF8F5] p-6 overflow-hidden">
                  <Link href={`/product/${product.id}`} className="block relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 text-[#786C64] hover:text-red-600 hover:bg-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#786C64] uppercase tracking-wider mb-1">
                      {product.brand}
                    </div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-sans text-sm font-bold text-[#2D2621] group-hover:text-[#8C5338] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#786C64]">
                      <Star className="w-3.5 h-3.5 fill-[#C27838] text-[#C27838]" />
                      <span className="font-semibold text-[#2D2621]">{product.rating}</span>
                      <span>({product.reviewCount})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-bold text-base text-[#2D2621]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#786C64] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {product.discount && (
                        <span className="text-[10px] font-bold text-[#C27838]">
                          {product.discount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Move to Cart Action Button */}
                  <div className="pt-4 mt-3 border-t border-[#E8E2DA]/80">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(product)}
                      className="w-full py-2.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="space-y-12">
            <div className="bg-white rounded-3xl border border-[#E8E2DA] p-10 sm:p-14 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338] mb-5">
                <Heart className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2D2621] mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-xs sm:text-sm text-[#786C64] max-w-sm mb-6 leading-relaxed">
                Save pairs and silhouettes you like by clicking the heart icon while exploring our catalog.
              </p>
              <Link
                href="/category"
                className="px-6 py-3 rounded-full bg-[#8C5338] text-white text-xs font-semibold hover:bg-[#72422C] transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Popular Curated Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2D2621]">
                    Popular Silhouettes
                  </h3>
                  <p className="text-xs text-[#786C64] mt-1">
                    Discover our most popular kicks and terrace classics.
                  </p>
                </div>
                <Link
                  href="/category"
                  className="text-xs font-semibold text-[#8C5338] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedItems.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#E8E2DA] overflow-hidden p-4 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div className="relative w-full aspect-square bg-[#FAF8F5] rounded-xl p-4 overflow-hidden mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="20vw"
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#786C64] uppercase font-semibold">
                        {product.brand}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2D2621] truncate">
                        {product.name}
                      </h4>
                      <div className="text-xs font-bold text-[#2D2621] mt-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="mt-3 w-full py-2 rounded-full border border-[#E8E2DA] text-[11px] font-semibold text-[#2D2621] hover:bg-[#EFEAE4] transition-colors cursor-pointer"
                    >
                      Add to Wishlist
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
