'use client';

/**
 * @file ProductBreadcrumbs.tsx
 * @description Flipkart-style breadcrumb trail with chevron separators and responsive truncation.
 */

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ProductBreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumbs" className="w-full py-2.5">
      <ol className="flex items-center flex-wrap gap-1 text-[11px] sm:text-xs text-[#786C64]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item?.label || 'crumb'}-${index}`} className="flex items-center gap-1">
              {isLast ? (
                <span className="font-semibold text-[#2D2621] truncate max-w-[240px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href || '/'}
                    className="hover:text-[#8C5338] transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-[#786C64]/60 shrink-0" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
