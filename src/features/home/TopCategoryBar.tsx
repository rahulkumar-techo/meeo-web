'use client';

import React from 'react';
import Link from 'next/link';
import {
  Laptop,
  Footprints,
  Headphones,
  Home,
  Briefcase,
  Flame,
  Percent,
  Sparkles,
} from 'lucide-react';

export const TopCategoryBar: React.FC = () => {
  const categories = [
    {
      id: 'all',
      name: 'All Catalog',
      subtext: '120+ Objects',
      href: '/category',
      icon: Sparkles,
      color: 'bg-[#412ce7] text-white',
    },
    {
      id: 'footwear',
      name: 'Footwear',
      subtext: 'Min 30% Off',
      href: '/category?cat=footwear',
      icon: Footprints,
      color: 'bg-[#ff6b4a]/10 text-[#ae3115] dark:text-[#ffb4a3] dark:bg-[#ae3115]/30',
      badge: 'HOT',
    },
    {
      id: 'workspace',
      name: 'Workspace',
      subtext: 'From ₹1,899',
      href: '/category?cat=workspace',
      icon: Laptop,
      color: 'bg-[#412ce7]/10 text-[#412ce7] dark:text-[#c4c0ff] dark:bg-[#412ce7]/30',
    },
    {
      id: 'audio',
      name: 'Audio & Sound',
      subtext: 'Hi-Fi Studio',
      href: '/category?cat=audio',
      icon: Headphones,
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-950/40',
    },
    {
      id: 'living',
      name: 'Home Living',
      subtext: 'Handcrafted',
      href: '/category?cat=living',
      icon: Home,
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 dark:bg-amber-950/40',
    },
    {
      id: 'objects',
      name: 'Bags & EDC',
      subtext: 'Under ₹4,999',
      href: '/category?cat=objects',
      icon: Briefcase,
      color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-950/40',
    },
    {
      id: 'drops',
      name: 'Flash Drops',
      subtext: 'Live Now',
      href: '/drops',
      icon: Flame,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-950/40',
      badge: 'LIVE',
    },
    {
      id: 'deals',
      name: 'Top Deals',
      subtext: 'Up to 35% Off',
      href: '/category?cat=footwear',
      icon: Percent,
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 dark:bg-purple-950/40',
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#131826] border-b border-[#e2e7ff] dark:border-[#28334d] shadow-[0_1px_4px_rgba(0,0,0,0.02)] py-3">
      <div className="max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center text-center min-w-[72px] sm:min-w-[84px] shrink-0 transition-transform active:scale-95"
              >
                <div className="relative mb-1.5">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${cat.color}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#fd6a49] text-white text-[9px] font-black uppercase tracking-wider animate-pulse shadow-2xs">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-[#131b2e] dark:text-[#f1f3fa] group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] whitespace-nowrap transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] font-medium text-[#777588] dark:text-[#a6abbf] whitespace-nowrap">
                  {cat.subtext}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
