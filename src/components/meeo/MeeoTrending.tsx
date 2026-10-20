'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { MeeoProduct } from '@/data/meeoData';
import { MeeoProductCard } from './MeeoProductCard';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { productService } from '@/services/product/productService';
import { mapApiProductToMeeoProduct } from '@/services/product/productAdapter';

export const MeeoTrending: React.FC = () => {
  const { addToCart, openCartDrawer } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState<MeeoProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeModalProduct, setActiveModalProduct] = useState<MeeoProduct | null>(null);
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveProducts() {
      try {
        setIsLoading(true);
        const res = await productService.getProducts({ limit: 12 });
        if (isMounted && res.success && res.data && res.data.length > 0) {
          const mappedProducts = res.data.map(mapApiProductToMeeoProduct);
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.warn('Could not load trending products:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLiveProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistSet((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removed item from your wishlist');
      } else {
        next.add(productId);
        showToast('Saved item to your wishlist');
      }
      return next;
    });
  };

  const handleAddToCart = async (product: MeeoProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(
        {
          id: product.id,
          slug: product.id,
          name: product.name,
          subtitle: product.category,
          category: 'footwear',
          categoryLabel: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviewCount: parseInt(product.reviewCount) || 500,
          inStock: product.inStock,
          stockCount: 15,
          description: product.description || '',
          images: [product.image],
          specs: { Category: product.category },
          tags: ['trending', 'live-api'],
        },
        1
      );
      showToast(`Added ${product.name} to shopping bag`);
      openCartDrawer();
    } catch {
      showToast('Could not add to bag. Please try again.');
    }
  };

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF8F5] pb-16 sm:pb-24">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5338] bg-[#EFEAE4] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C27838]" />
                Live Store Catalog
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2621] font-normal tracking-tight">
              Trending Now
            </h2>
            <p className="text-sm sm:text-base text-[#786C64] mt-1.5 font-sans">
              Most loved. Most bought. Don&apos;t miss out.
            </p>
          </div>
          <Link
            href="/category?sort=best_sellers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C5338] hover:text-[#6E3F29] group transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-[#E8E2DA] animate-pulse flex flex-col gap-3"
              >
                <div className="aspect-square bg-[#F3EFEA] rounded-xl w-full" />
                <div className="h-4 bg-[#E8E2DA] rounded w-2/3" />
                <div className="h-3 bg-[#E8E2DA] rounded w-1/3" />
                <div className="h-5 bg-[#E8E2DA] rounded w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <MeeoProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistSet.has(product.id)}
                onQuickView={(p) => setActiveModalProduct(p)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={activeModalProduct}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
        isWishlisted={activeModalProduct ? wishlistSet.has(activeModalProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />
    </section>
  );
};
