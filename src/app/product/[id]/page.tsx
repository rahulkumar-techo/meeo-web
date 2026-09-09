'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { ProductGallery } from '@/features/product/ProductGallery';
import { ProductInfo } from '@/features/product/ProductInfo';
import { ProductSpecs } from '@/features/product/ProductSpecs';
import { ProductReviewsSection } from '@/features/product/ProductReviewsSection';
import { MobileStickyBuy } from '@/features/product/MobileStickyBuy';
import { ProductCard } from '@/components/ui/ProductCard';
import { MOCK_PRODUCTS } from '@/data/products';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateProductSchema, generateBreadcrumbSchema } from '@/config/seo';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const product = MOCK_PRODUCTS.find((p) => p.id === productId || p.slug === productId) || MOCK_PRODUCTS[0];

  const companionProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: product.categoryLabel || 'Catalog', url: `/category?cat=${product.category}` },
    { name: product.name, url: `/product/${product.id}` },
  ]);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Search Engine Rich Snippet Structured Data */}
      <JsonLd schema={[productSchema, breadcrumbSchema]} />

      {/* Breadcrumbs Strip */}
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-3.5">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-[#777588]">
            <Link href="/" className="hover:text-[#412ce7] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/category?cat=${product.category}`} className="hover:text-[#412ce7] transition-colors">
              {product.categoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#412ce7] font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          <Link
            href="/category"
            className="text-xs text-[#412ce7] font-bold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </Link>
        </div>
      </section>

      {/* Main PDP Grid: Gallery (Left) + Info/CTAs (Right) */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Showcase (7 cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              badge={product.badge}
              badgeType={product.badgeType}
            />
          </div>

          {/* Pricing, Options & CTAs (5 cols) */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Specifications & Engineering Manifesto */}
        <ProductSpecs product={product} />

        {/* Verified Discerning Reviews */}
        <ProductReviewsSection
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {/* Curated Companion Items */}
        <section className="flex flex-col gap-6 pt-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#412ce7]">
                Architectural Harmony
              </span>
              <h3 className="text-2xl font-extrabold text-[#131b2e] tracking-tight mt-1">
                Complementary Curations
              </h3>
            </div>
            <Link href="/category" className="text-xs font-bold text-[#412ce7] hover:underline">
              View Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
            {companionProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Action Dock */}
      <MobileStickyBuy product={product} />
    </div>
  );
}
