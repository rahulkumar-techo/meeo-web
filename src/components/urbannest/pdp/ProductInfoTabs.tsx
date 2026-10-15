'use client';

/**
 * @file ProductInfoTabs.tsx
 * @description Flipkart-style tabbed information view presenting specifications,
 * customer reviews with 5-star distribution, and delivery policies.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Truck,
  RotateCcw,
  Award,
} from 'lucide-react';
import { UrbanNestProductDetail } from '@/data/urbanNestProductDetails';

interface ProductInfoTabsProps {
  product: UrbanNestProductDetail;
}

type TabType = 'specifications' | 'reviews' | 'shipping';

export const ProductInfoTabs: React.FC<ProductInfoTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabType>('specifications');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Ratings & Reviews (${product?.reviewCount || '1.2k'})` },
    { id: 'shipping', label: 'Shipping & Warranty' },
  ];

  // Grouped specifications
  const groupedSpecs = product?.specificationsGrouped || {
    General: product?.specifications || {},
  };

  const defaultReviewBreakdown = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 2 },
  ];

  return (
    <div className="w-full mt-10 pt-6 border-t border-[#e0e0e0]">
      {/* Tab Navigation Strip */}
      <div className="flex items-center gap-6 border-b border-[#E8E2DA] overflow-x-auto pb-px mb-8 select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-[#8C5338] font-bold'
                  : 'text-[#786C64] hover:text-[#2D2621]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#8C5338] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {/* 1. SPECIFICATIONS TAB */}
        {activeTab === 'specifications' && (
          <div className="w-full bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-7 shadow-2xs">
            <h3 className="text-lg font-bold text-[#2D2621] mb-5 font-serif">
              Specifications
            </h3>

            <div className="space-y-6">
              {Object.entries(groupedSpecs).map(([groupTitle, specs]) => {
                const specEntries = Object.entries(specs || {});
                if (specEntries.length === 0) return null;

                return (
                  <div key={groupTitle} className="border-b border-[#E8E2DA] pb-5 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-[#8C5338] uppercase tracking-wider mb-3">
                      {groupTitle}
                    </h4>

                    <div className="divide-y divide-[#E8E2DA]/50">
                      {specEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="py-2.5 flex flex-col sm:flex-row sm:items-center text-xs gap-1 sm:gap-6"
                        >
                          <span className="text-[#786C64] w-48 shrink-0 font-medium">
                            {key}
                          </span>
                          <span className="text-[#2D2621] font-semibold flex-1">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. RATINGS & REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Rating Breakdown Summary Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8E2DA] p-6 flex flex-col items-center text-center shadow-2xs">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#2D2621]">
                {product?.rating || 4.3}
              </span>
              <div className="flex items-center text-[#C27838] my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C27838]" />
                ))}
              </div>
              <p className="text-xs text-[#786C64] mb-6">
                {product?.reviewCount || '1,248'} Verified Customer Ratings
              </p>

              {/* Star Rating Breakdown Bars */}
              <div className="w-full flex flex-col gap-2">
                {defaultReviewBreakdown.map((bar) => (
                  <div key={bar.stars} className="flex items-center gap-2 text-xs text-[#786C64]">
                    <span className="w-8 text-right font-medium">{bar.stars} ★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#F3EFEA] overflow-hidden">
                      <div
                        className="h-full bg-[#8C5338] rounded-full"
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-left font-medium">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              {(product?.reviewsData?.items || [
                {
                  id: 'rev-default-1',
                  author: 'Verified Buyer',
                  date: 'September 2026',
                  rating: 5,
                  verified: true,
                  title: 'Worth every penny!',
                  content:
                    'Superb sound quality, very comfortable for extended listening sessions, and battery lasts as promised. Highly recommended!',
                },
                {
                  id: 'rev-default-2',
                  author: 'Vikram S.',
                  date: 'October 2026',
                  rating: 4,
                  verified: true,
                  title: 'Great product and prompt delivery',
                  content:
                    'Solid build quality, pairing is instantaneous. Packaging was secure and delivered within 24 hours.',
                },
              ]).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-[#E8E2DA] p-4 sm:p-5 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#2E6F40] text-white text-[10px] font-bold">
                        <span>{rev.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <h5 className="text-xs font-bold text-[#2D2621]">
                        {rev.title}
                      </h5>
                    </div>
                    <span className="text-[11px] text-[#786C64]">{rev.date}</span>
                  </div>

                  <p className="text-xs text-[#786C64] leading-relaxed mb-2.5">
                    {rev.content}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-[#786C64]">
                    <span className="font-semibold text-[#2D2621]">{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[#2E6F40] bg-[#F5EBE6] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SHIPPING & RETURNS TAB */}
        {activeTab === 'shipping' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E8E2DA] flex flex-col items-start shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#F5EBE6] text-[#8C5338] flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#2D2621] mb-1">
                Fast &amp; Free Shipping
              </h4>
              <p className="text-xs text-[#786C64] leading-relaxed">
                {product?.shippingInfo?.freeShippingThreshold || 'Free standard delivery on orders above ₹499.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E2DA] flex flex-col items-start shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#F5EBE6] text-[#8C5338] flex items-center justify-center mb-3">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#2D2621] mb-1">
                7-Day Easy Returns
              </h4>
              <p className="text-xs text-[#786C64] leading-relaxed">
                {product?.shippingInfo?.returnsWindow || 'Complimentary replacement and pickup from doorstep.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E2DA] flex flex-col items-start shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#F5EBE6] text-[#8C5338] flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#2D2621] mb-1">
                100% Genuine Product
              </h4>
              <p className="text-xs text-[#786C64] leading-relaxed">
                {product?.shippingInfo?.authenticity || 'Direct from authorized brand distributors with valid warranty.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
