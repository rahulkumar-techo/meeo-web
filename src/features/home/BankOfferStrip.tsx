'use client';

import React from 'react';
import { CreditCard, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export const BankOfferStrip: React.FC = () => {
  const perks = [
    {
      icon: CreditCard,
      title: 'Instant 10% Bank Discount',
      desc: 'On HDFC, ICICI & Axis Credit/Debit Cards',
      color: 'text-[#412ce7] dark:text-[#685aff]',
    },
    {
      icon: Truck,
      title: 'Free Express Delivery',
      desc: 'Dispatched within 24 hours nationwide',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: RefreshCw,
      title: '7-Day Easy Replacement',
      desc: 'No questions asked size & defect swap',
      color: 'text-[#fd6a49]',
    },
    {
      icon: ShieldCheck,
      title: '1-Year Hardware Vault Warranty',
      desc: '100% Genuine Certified Hardware',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <section className="w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-white dark:bg-[#131826] border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        {perks.map((perk, idx) => {
          const Icon = perk.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#faf8ff] dark:hover:bg-[#182032] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] dark:bg-[#1e273d] flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${perk.color}`} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-[#131b2e] dark:text-white truncate">
                  {perk.title}
                </p>
                <p className="text-[11px] text-[#777588] dark:text-[#a6abbf] truncate">
                  {perk.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
