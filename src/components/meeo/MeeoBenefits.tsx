'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { MEEO_BENEFITS } from '@/data/meeoData';

const ICONS = {
  truck: Truck,
  'rotate-ccw': RotateCcw,
  'shield-check': ShieldCheck,
  headphones: Headphones,
};

export const MeeoBenefits: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF8F5] pb-12 sm:pb-16">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 sm:py-7 sm:px-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2DA]">
            {MEEO_BENEFITS.map((benefit, idx) => {
              const IconComponent = ICONS[benefit.iconName];
              return (
                <div
                  key={benefit.id}
                  className={`flex items-center gap-4 ${
                    idx > 0 ? 'pt-5 sm:pt-0 sm:pl-6 lg:pl-8' : ''
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#F3EFEA] flex items-center justify-center text-[#8C5338] shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#2D2621]">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-[#786C64] mt-0.5">
                      {benefit.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
