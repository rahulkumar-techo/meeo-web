'use client';

import React from 'react';
import { HeroDealsBanner } from '@/features/home/HeroDealsBanner';
import { DealsOfTheDay } from '@/features/home/DealsOfTheDay';
import { CategoryProductRail } from '@/features/home/CategoryProductRail';
import { InfiniteProductGrid } from '@/features/home/InfiniteProductGrid';
import { useProductsQuery } from '@/hooks/catalog/useCatalog';
import { normalizeProducts } from '@/lib/apiHelper';
import type { Product } from '@/types/product';

export default function HomePage() {
  const { data: productsData } = useProductsQuery({ limit: 50 });
  const allProducts: Product[] = normalizeProducts(productsData);

  const workspaceProducts = allProducts.filter((p) => p.category === 'workspace');
  const footwearProducts = allProducts.filter((p) => p.category === 'footwear');
  const budgetProducts = allProducts.filter((p) => (p.price || (p as any).basePrice || 0) <= 5000);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 2. Main Hero Deals & Offer Banner Carousel */}
      <HeroDealsBanner />

      {/* 4. Deals of the Day with Live Countdown Timer */}
      <DealsOfTheDay products={allProducts} />

      {/* 5. Best of Workspace & Tech Product Rail */}
      <CategoryProductRail
        title="Best of Workspace & Precision Tech"
        subtitle="Mechanical keyboards, fast magnetic docks, monitor lights & deskmats"
        viewAllHref="/category?cat=workspace"
        badge="From ₹1,899"
        products={workspaceProducts}
      />

      {/* 6. Trending Footwear & Streetwear Product Rail */}
      <CategoryProductRail
        title="Trending Footwear & Craft Kicks"
        subtitle="Full-grain Italian nappa leather, supercritical runners & Goodyear derbys"
        viewAllHref="/category?cat=footwear"
        badge="Min 30% Off"
        products={footwearProducts}
      />

      {/* 7. Budget Finds Under ₹4,999 */}
      <CategoryProductRail
        title="Top Rated Deals Under ₹4,999"
        subtitle="Everyday essentials, charging hubs, ceramic vessels & titanium EDC"
        viewAllHref="/category"
        badge="Budget Steals"
        products={budgetProducts}
      />

      {/* 8. Full Recommended / Product Discovery Grid with Filters & Sort */}
      <InfiniteProductGrid products={allProducts} />
    </div>
  );
}