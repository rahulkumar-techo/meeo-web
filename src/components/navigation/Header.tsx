'use client';

import React, { Suspense } from 'react';
import { MeeoHeader } from '../meeo/MeeoHeader';

export const Header: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-18 sm:h-20 w-full bg-[#FAF8F5] border-b border-[#E8E2DA]" />}>
      <MeeoHeader />
    </Suspense>
  );
};
