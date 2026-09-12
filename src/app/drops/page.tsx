'use client';

import React from 'react';
import { DropsHero } from '@/features/drops/DropsHero';
import { DropsGrid } from '@/features/drops/DropsGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/config/seo';
import { useProductsQuery } from '@/hooks/catalog/useCatalog';
import { normalizeProducts } from '@/lib/apiHelper';
import type { Product } from '@/types/product';

export default function DropsPage() {
  const { data: productsData, isLoading } = useProductsQuery({ limit: 50 });
  const allProducts = normalizeProducts(productsData);

  const dropsProducts = allProducts.filter(
    (p) => p.isArchivalDrop || ((p.originalPrice || (p as any).basePrice) && (p.originalPrice || (p as any).basePrice) > p.price)
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
        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#777588]">Loading exclusive drops...</div>
        ) : (
          <DropsGrid products={dropsProducts.length > 0 ? dropsProducts : allProducts} />
        )}
      </div>
    </div>
  );
}
