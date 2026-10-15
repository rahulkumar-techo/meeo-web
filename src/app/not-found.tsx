'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#FAF8F5]">
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E2DA] shadow-2xs">
        {/* Visual Badge */}
        <div className="w-20 h-20 rounded-3xl bg-[#EFEAE4] border border-[#E5DFD7] flex items-center justify-center text-[#8C5338] shadow-2xs">
          <span className="font-serif text-3xl font-bold tracking-tight">404</span>
        </div>

        {/* Headings */}
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621] tracking-tight">
            Silhouette Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#786C64] max-w-md leading-relaxed">
            The page or product you are looking for has been moved, archived to our vault, or does not exist.
          </p>
        </div>

        {/* Action Button Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm mt-2">
          <Link
            href="/"
            className="flex-1 min-w-[140px] h-11 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/category"
            className="flex-1 min-w-[140px] h-11 rounded-full bg-white hover:bg-[#FAF8F5] text-[#2D2621] border border-[#E8E2DA] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>

        <Link
          href="/category?deals=true"
          className="text-xs font-semibold text-[#8C5338] hover:underline flex items-center gap-1 mt-1"
        >
          <span>Explore limited-time deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
