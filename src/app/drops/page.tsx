'use client';

import React from 'react';
import { DropsHero } from '@/features/drops/DropsHero';
import { DropsGrid } from '@/features/drops/DropsGrid';
import { MOCK_PRODUCTS } from '@/data/products';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/config/seo';

export default function DropsPage() {
  const dropsProducts = MOCK_PRODUCTS.filter(
    (p) => p.isArchivalDrop || (p.originalPrice && p.originalPrice > p.price)
  );

  return (
    <div className="flex flex-col w-full pb-20">
      <JsonLd
        schema={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Limited Drops & Archival Releases', url: '/drops' },
        ])}
      />
      <DropsHero />
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <DropsGrid products={dropsProducts} />
      </div>
    </div>
  );
}
