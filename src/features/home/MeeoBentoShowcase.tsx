'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';

interface BentoSection {
  id: string;
  title: string;
  badge: string;
  href: string;
  items: {
    name: string;
    deal: string;
    image: string;
    href: string;
  }[];
}

const bentoSections: BentoSection[] = [
  {
    id: 'electronics',
    title: 'Best of Electronics & Tech',
    badge: 'Up to 60% Off',
    href: '/category?cat=workspace',
    items: [
      {
        name: 'Mechanical Keyboards',
        deal: 'From ₹3,499',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=workspace',
      },
      {
        name: 'Qi2 Fast MagDocks',
        deal: 'Min 30% Off',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=workspace',
      },
      {
        name: 'Monitor Light Bars',
        deal: 'Special ₹2,199',
        image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=workspace',
      },
      {
        name: 'Precision Desk Mats',
        deal: 'Under ₹999',
        image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=workspace',
      },
    ],
  },
  {
    id: 'footwear',
    title: 'Trending Footwear & Shoes',
    badge: 'Min 35% Off',
    href: '/category?cat=footwear',
    items: [
      {
        name: 'Craft Derby Shoes',
        deal: 'Flat 40% Off',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=footwear',
      },
      {
        name: 'Supercritical Runners',
        deal: 'From ₹3,999',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=footwear',
      },
      {
        name: 'Minimal Leather Lows',
        deal: 'Top Rated',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=footwear',
      },
      {
        name: 'Slip-on Urban Mules',
        deal: 'Under ₹2,999',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=footwear',
      },
    ],
  },
  {
    id: 'audio',
    title: 'Audio, Sound & ANC',
    badge: 'From ₹2,499',
    href: '/category?cat=audio',
    items: [
      {
        name: 'Studio ANC Headphones',
        deal: 'Up to 50% Off',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=audio',
      },
      {
        name: 'Lossless Earbuds',
        deal: 'From ₹1,899',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=audio',
      },
      {
        name: 'Desktop Hi-Fi DACs',
        deal: 'Flat 25% Off',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=audio',
      },
      {
        name: 'Portable Acoustic Pods',
        deal: 'Special Deal',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=audio',
      },
    ],
  },
  {
    id: 'budget',
    title: 'Deals Under ₹4,999',
    badge: 'Top Rated',
    href: '/category',
    items: [
      {
        name: 'Titanium EDC Hubs',
        deal: 'Special ₹1,499',
        image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=400&auto=format&fit=crop',
        href: '/category',
      },
      {
        name: 'Waxed Canvas Slings',
        deal: 'From ₹2,299',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=objects',
      },
      {
        name: 'Ceramic Pour Vessels',
        deal: 'Under ₹1,299',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop',
        href: '/category?cat=living',
      },
      {
        name: 'Braided Fast Cables',
        deal: 'Pack from ₹799',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop',
        href: '/category',
      },
    ],
  },
];

export const MeeoBentoShowcase: React.FC = () => {
  return (
    <section className="w-full max-w-[84rem] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bentoSections.map((section) => (
          <div
            key={section.id}
            className="rounded-2xl bg-white dark:bg-[#131826] border border-[#e2e7ff] dark:border-[#28334d] p-4 flex flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#131b2e] dark:text-white tracking-tight leading-snug">
                  {section.title}
                </h3>
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  {section.badge}
                </span>
              </div>
              <Link
                href={section.href}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] flex items-center justify-center hover:bg-[#412ce7] hover:text-white transition-colors shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2x2 Image Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {section.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group flex flex-col p-2 rounded-xl bg-[#f8f9fc] dark:bg-[#182032] hover:bg-[#eaedff]/50 dark:hover:bg-[#202b44] transition-colors"
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-1.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-[11px] font-bold text-[#131b2e] dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-extrabold text-[#412ce7] dark:text-[#685aff] truncate">
                    {item.deal}
                  </p>
                </Link>
              ))}
            </div>

            {/* Bottom View All Link */}
            <Link
              href={section.href}
              className="text-xs font-bold text-[#412ce7] dark:text-[#685aff] hover:underline flex items-center gap-1 pt-1 border-t border-[#f2f3ff] dark:border-[#20293d]"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

// Backward compatibility alias
export const FlipkartBentoShowcase = MeeoBentoShowcase;
