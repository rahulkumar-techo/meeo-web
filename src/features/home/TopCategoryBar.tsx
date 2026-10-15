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
  Smartphone,
  Watch,
} from 'lucide-react';

export const TopCategoryBar: React.FC = () => {
  const categories = [
    {
      id: 'all',
      name: 'All Catalog',
      subtext: '120+ Products',
      href: '/category',
      icon: Sparkles,
      color: 'bg-[#412ce7] text-white',
      badge: 'EXPLORE',
    },
    {
      id: 'workspace',
      name: 'Electronics & PC',
      subtext: 'From ₹1,899',
      href: '/category?cat=workspace',
      icon: Laptop,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-950/40',
      badge: 'TOP DEALS',
    },
    {
      id: 'footwear',
      name: 'Fashion & Shoes',
      subtext: 'Min 35% Off',
      href: '/category?cat=footwear',
      icon: Footprints,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-950/40',
      badge: 'HOT',
    },
    {
      id: 'audio',
      name: 'Audio & Sound',
      subtext: 'Hi-Fi Studio',
      href: '/category?cat=audio',
      icon: Headphones,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/40',
      badge: 'NEW',
    },
    {
      id: 'living',
      name: 'Home & Living',
      subtext: 'Modern Decor',
      href: '/category?cat=living',
      icon: Home,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-950/40',
    },
    {
      id: 'objects',
      name: 'Bags & EDC',
      subtext: 'Under ₹4,999',
      href: '/category?cat=objects',
      icon: Briefcase,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-950/40',
    },
    {
      id: 'smart-gadgets',
      name: 'Mobiles & Tech',
      subtext: 'Qi2 & Docks',
      href: '/category?cat=workspace',
      icon: Smartphone,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-950/40',
    },
    {
      id: 'deals',
      name: 'Top Offers',
      subtext: 'Up to 70% Off',
      href: '/category?cat=footwear',
      icon: Percent,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-950/40',
      badge: 'EXTRA 10%',
    },
    {
      id: 'drops',
      name: 'Flash Drops',
      subtext: 'Ending Soon',
      href: '/drops',
      icon: Flame,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-950/40',
      badge: 'LIVE',
    },
  ];

  return (
    <nav aria-label="Category Navigation" className="w-full bg-white dark:bg-[#111624] border-b border-[#e2e7ff] dark:border-[#20293d] shadow-[0_1px_4px_rgba(0,0,0,0.03)] py-3">
      <div className="max-w-[84rem] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-around gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center text-center min-w-[70px] sm:min-w-[82px] shrink-0 transition-all active:scale-95 cursor-pointer"
              >
                <div className="relative mb-1.5">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${cat.color}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#fd6a49] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-[#131b2e] dark:text-[#f1f3fa] group-hover:text-[#412ce7] dark:group-hover:text-[#685aff] whitespace-nowrap transition-colors">
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
    </nav>
  );
};
