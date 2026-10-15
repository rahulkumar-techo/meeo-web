import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogView } from '@/components/urbannest/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Shop All Categories & Collections · UrbanNest',
  description:
    'Explore the complete UrbanNest catalog: iconic sneakers, curated men & women footwear, tactile lifestyle objects, and limited-time archive deals.',
};

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#FAF8F5]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#786C64]">Loading UrbanNest Catalog...</span>
          </div>
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
