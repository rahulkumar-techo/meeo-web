'use client';

import React, { useState, useMemo } from 'react';
import { HeroSection } from '@/features/home/HeroSection';
import { DiscoveryDock } from '@/features/home/DiscoveryDock';
import { BentoCollections } from '@/features/home/BentoCollections';
import { CuratorSpotlight } from '@/features/home/CuratorSpotlight';
import { DropsTeaser } from '@/features/home/DropsTeaser';
import { ProductCard } from '@/components/ui/ProductCard';
import { MOCK_PRODUCTS } from '@/data/products';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('trending');

  const displayedProducts = useMemo(() => {
    if (activeTab === 'trending') {
      return MOCK_PRODUCTS.filter((p) => p.badgeType === 'trending' || p.badgeType === 'drop' || p.rating >= 4.9);
    }
    if (activeTab === 'new') {
      return [...MOCK_PRODUCTS].reverse();
    }
    if (activeTab === 'best_sellers') {
      return [...MOCK_PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    if (activeTab === 'curated_deals') {
      return MOCK_PRODUCTS.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }
    if (activeTab === 'archival') {
      return MOCK_PRODUCTS.filter((p) => p.isArchivalDrop);
    }
    return MOCK_PRODUCTS;
  }, [activeTab]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Editorial Hero Discovery Experience */}
      <HeroSection />

      {/* 2. Quick Discovery Filter Bar (Sticky Pill Dock) */}
      <DiscoveryDock activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Featured Dynamic Product Grid from Active Tab */}
      <section className="w-full max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {displayedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Editorial Asymmetric Bento Grid Collections */}
      <BentoCollections products={MOCK_PRODUCTS} />

      {/* 5. Limited Edition Archival Drops Countdown */}
      <DropsTeaser />

      {/* 6. Curator Spotlight & Brand Philosophy */}
      <CuratorSpotlight />
    </div>
  );
}