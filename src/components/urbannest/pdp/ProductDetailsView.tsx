'use client';

/**
 * @file ProductDetailsView.tsx
 * @description Flipkart-style product details page coordinating 3D gallery viewer,
 * dynamic variant selection, pricing updates, cart mutations, and specifications.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UrbanNestProductDetail,
  ProductColorOption,
  FormattedProductVariant,
} from '@/data/urbanNestProductDetails';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { AppRoute } from '@/routes';
import { ProductBreadcrumbs } from './ProductBreadcrumbs';
import { ProductGalleryViewer } from './ProductGalleryViewer';
import { ProductPurchasePanel } from './ProductPurchasePanel';
import { ProductInfoTabs } from './ProductInfoTabs';
import { ProductRecommendations } from './ProductRecommendations';
import { VideoModal } from '../VideoModal';

interface ProductDetailsViewProps {
  initialProduct: UrbanNestProductDetail;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  initialProduct,
}) => {
  const router = useRouter();
  const product = initialProduct;

  const { addToCart, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product?.variants?.[0]?.id || product?.selectedVariantId || ''
  );

  const [selectedColor, setSelectedColor] = useState<ProductColorOption | undefined>(
    product?.colors?.[0]
  );

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Derive current variant
  const variants = product?.variants || [];
  const currentVariant: FormattedProductVariant | undefined =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const isFavorited = isInWishlist(product?.id || '');

  // Calculate gallery images for selected variant
  const activeGallery =
    currentVariant?.images && currentVariant.images.length > 0
      ? currentVariant.images
      : product?.gallery || [];

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const newVariant = variants.find((v) => v.id === variantId);
    if (newVariant) {
      // Find matching color option if available
      const matchingColor = product?.colors?.find((c) => c.id === variantId);
      if (matchingColor) {
        setSelectedColor(matchingColor);
      }
    }
  };

  const handleColorChange = (color: ProductColorOption) => {
    setSelectedColor(color);
    if (color?.id) {
      setSelectedVariantId(color.id);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      const activePrice = currentVariant?.price ?? product.price ?? 0;
      const activeOriginalPrice = currentVariant?.originalPrice ?? product.originalPrice ?? 0;
      const variantTitle = currentVariant?.sku || selectedColor?.name || 'Standard';

      await addToCart(
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          subtitle: product.category,
          category: (product.category?.toLowerCase().includes('audio')
            ? 'audio'
            : product.category?.toLowerCase().includes('footwear')
            ? 'footwear'
            : 'living') as 'footwear' | 'audio' | 'workspace' | 'living' | 'objects' | 'deals',
          categoryLabel: product.category,
          price: activePrice,
          originalPrice: activeOriginalPrice,
          rating: product.rating || 4.3,
          reviewCount: 1248,
          inStock: currentVariant?.inStock ?? product.inStock ?? true,
          stockCount: currentVariant?.stockCount ?? 10,
          description: product.description || '',
          images: [activeGallery[0]?.url || product.gallery?.[0]?.url || ''],
          specs: {
            Variant: variantTitle,
            ...(currentVariant?.attributes || {}),
          },
          tags: ['product'],
        },
        1,
        variantTitle
      );

      showToast(`Added ${product.name} to your bag`);
      openCartDrawer();
    } catch {
      showToast('Could not add to bag. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push(AppRoute.CHECKOUT);
  };

  const handleToggleWishlist = () => {
    if (!product?.id) return;
    toggleWishlist(product.id);
    showToast(isFavorited ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen py-4 sm:py-6">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb Navigation Bar */}
        <div className="mb-3">
          <ProductBreadcrumbs items={product?.breadcrumbs || []} />
        </div>

        {/* Main Product Card Container */}
        <div className="bg-white rounded-2xl border border-[#E8E2DA] shadow-xs p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Gallery Stage + Dual Action CTAs */}
            <div className="lg:col-span-5 w-full sticky lg:top-20">
              <ProductGalleryViewer
                gallery={activeGallery}
                productName={product?.name || 'Product'}
                activeColorImage={selectedColor?.image}
                onOpenVideo={() => setIsVideoModalOpen(true)}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isAdding={isAdding}
                inStock={currentVariant?.inStock ?? product?.inStock ?? true}
                isWishlisted={isFavorited}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>

            {/* Right Column: Pricing, Variant Selector & Product Details */}
            <div className="lg:col-span-7 w-full">
              <ProductPurchasePanel
                product={product}
                selectedVariantId={selectedVariantId}
                onVariantChange={handleVariantChange}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
              />
            </div>
          </div>

          {/* Specifications, Ratings & Reviews */}
          <ProductInfoTabs product={product} />
        </div>

        {/* Recommendations */}
        {product?.recommended && product.recommended.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-[#E8E2DA] shadow-xs p-5 sm:p-8">
            <ProductRecommendations recommended={product.recommended} />
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={`${product?.name || 'Product'} · Showcase`}
      />
    </div>
  );
};
