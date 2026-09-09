'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

interface DropsGridProps {
  products: Product[];
}

export const DropsGrid: React.FC<DropsGridProps> = ({ products }) => {
  return (
    <div className="py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-[#131b2e]">Active Drop Catalog</h3>
          <p className="text-xs text-[#464556]">Serialized pieces ready for immediate express priority dispatch.</p>
        </div>
        <span className="text-xs font-bold text-[#412ce7] bg-[#eaedff] px-3 py-1 rounded-full">
          {products.length} Drops Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
