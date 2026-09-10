'use client';

import React from 'react';
import { TopCategoryBar } from '@/features/home/TopCategoryBar';
import { HeroDealsBanner } from '@/features/home/HeroDealsBanner';
import { BankOfferStrip } from '@/features/home/BankOfferStrip';
import { DealsOfTheDay } from '@/features/home/DealsOfTheDay';
import { CategoryProductRail } from '@/features/home/CategoryProductRail';
import { InfiniteProductGrid } from '@/features/home/InfiniteProductGrid';
import { MOCK_PRODUCTS } from '@/data/products';

export default function HomePage() {
  const workspaceProducts = MOCK_PRODUCTS.filter((p) => p.category === 'workspace');
  const footwearProducts = MOCK_PRODUCTS.filter((p) => p.category === 'footwear');
  const budgetProducts = MOCK_PRODUCTS.filter((p) => p.price <= 5000);

  return (
    <div className="flex flex-col w-full pb-16">
   
     {/* 2. Main Hero Deals & Offer Banner Carousel */}
      <HeroDealsBanner />

      {/* 3. Bank Offer & Trust Guarantee Strip */}
      {/* <BankOfferStrip /> */}

      {/* 4. Deals of the Day with Live Countdown Timer */}
      <DealsOfTheDay products={MOCK_PRODUCTS} />

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
      <InfiniteProductGrid products={MOCK_PRODUCTS} />
    </div>
  );
}