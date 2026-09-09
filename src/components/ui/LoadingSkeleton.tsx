'use client';

import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#e2e7ff] p-4 flex flex-col gap-3">
      <Skeleton
        variant="rounded"
        width="100%"
        height={220}
        animation="wave"
        sx={{ borderRadius: '1.25rem', bgcolor: '#eaedff' }}
      />
      <div className="space-y-2 mt-2">
        <Skeleton variant="text" width="40%" height={16} animation="wave" sx={{ bgcolor: '#eaedff' }} />
        <Skeleton variant="text" width="80%" height={24} animation="wave" sx={{ bgcolor: '#eaedff' }} />
        <Skeleton variant="text" width="60%" height={16} animation="wave" sx={{ bgcolor: '#eaedff' }} />
      </div>
      <div className="pt-3 border-t border-[#f2f3ff] flex items-center justify-between">
        <Skeleton variant="text" width="35%" height={28} animation="wave" sx={{ bgcolor: '#eaedff' }} />
        <Skeleton variant="circular" width={36} height={36} animation="wave" sx={{ bgcolor: '#eaedff' }} />
      </div>
    </div>
  );
};

export const CatalogSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
