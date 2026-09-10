'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Flame, Zap, ArrowUpRight } from 'lucide-react';

export const HeroDealsBanner: React.FC = () => {
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const banners = [
    {
      id: 'footwear',
      discount: '30%',
      category: 'FOOTWEAR',
      title: '30% Discount on Italian Kicks',
      subtitle: 'Nappa leather & supercritical foam',
      href: '/category?cat=footwear',
      bgColor: 'bg-[#932014]',
      textColor: 'text-[#ffdcd4]',
      numColor: 'text-[#ffdcd4]/20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFz_4n49d79QvD3zNrk5mffQxXUoGgZ0j934Yh3N3g9QJqHnZ-7a6bE5FvLw_m=s1600',
      tag: 'Min 30% Off',
    },
    {
      id: 'keyboards',
      discount: '25%',
      category: 'TECH & KEYBOARDS',
      title: '25% Off CNC Keyboards',
      subtitle: 'Gasket mount & tactile switches',
      href: '/category?cat=workspace',
      bgColor: 'bg-[#1b6b3e]',
      textColor: 'text-[#bbf7d0]',
      numColor: 'text-[#bbf7d0]/20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqvFJ9Jq4rAD2WZ09ddauyJ96v_Jjo9zZGaUT5-2Q3mE1h4q0LolxR7l72iG0KRQ9hkpDWerA_xsSedGeJC6HwhssAvCW2yh9NAfN547jqMdHDDzjTm_2l4f5fgSkd-6VudOtzbYAoHcI_LIEmXdX2yTZxI_ELZotvRtNSZXx0jiczB5E0b0FVW9bTuSTZQTRhHJiYu07h4U4mgoZEIVax5Wvsp24Iy6TvdcXVCTbE6Uzta8iB_Bpg',
      tag: 'Studio Flagship',
    },
    {
      id: 'audio',
      discount: '35%',
      category: 'ACOUSTICS',
      title: '35% Discount on ANC Audio',
      subtitle: 'Pure beryllium 40mm drivers',
      href: '/category?cat=audio',
      bgColor: 'bg-[#143272]',
      textColor: 'text-[#bfdbfe]',
      numColor: 'text-[#bfdbfe]/20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3-3pUFszAOGHgA_jQzKwl01e8Q3ZQy-mbmwLW1eJMrHW5src2l95G1pB5qtQMnxBzqt03RKdhHoqP1sEOFyJx3V_qH4V-hZ2h2sm0xxxUgJweWVa6Wm1TpfbI11CfM837p4ungawt9W5__vxyZs7ZKcRyZJsilad9Ch8YEdFe4ewDFWXebelExtBtKeUjOWxW_ZlzNWjqrCi_D78M-LXZORKXG2dZvw9bSl-tqUMXTBm7n4aj_m0Y3g',
      tag: 'Hi-Fi Grade',
    },
    {
      id: 'charging',
      discount: '20%',
      category: 'WORKSPACE EDC',
      title: '20% Off Fast MagDocks',
      subtitle: 'Aircraft aluminum dual charging',
      href: '/category?cat=workspace',
      bgColor: 'bg-[#b45309]',
      textColor: 'text-[#fef3c7]',
      numColor: 'text-[#fef3c7]/20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-OqvFJ9Jq4rAD2WZ09ddauyJ96v_Jjo9zZGaUT5-2Q3mE1h4q0LolxR7l72iG0KRQ9hkpDWerA_xsSedGeJC6HwhssAvCW2yh9NAfN547jqMdHDDzjTm_2l4f5fgSkd-6VudOtzbYAoHcI_LIEmXdX2yTZxI_ELZotvRtNSZXx0jiczB5E0b0FVW9bTuSTZQTRhHJiYu07h4U4mgoZEIVax5Wvsp24Iy6TvdcXVCTbE6Uzta8iB_Bpg',
      tag: 'Fast Qi2',
    },
    {
      id: 'bags',
      discount: '15%',
      category: 'OBJECTS & BAGS',
      title: '15% Off Waxed Canvas Packs',
      subtitle: 'Scottish 16oz weatherproof build',
      href: '/category?cat=objects',
      bgColor: 'bg-[#0f766e]',
      textColor: 'text-[#ccfbf1]',
      numColor: 'text-[#ccfbf1]/20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3-3pUFszAOGHgA_jQzKwl01e8Q3ZQy-mbmwLW1eJMrHW5src2l95G1pB5qtQMnxBzqt03RKdhHoqP1sEOFyJx3V_qH4V-hZ2h2sm0xxxUgJweWVa6Wm1TpfbI11CfM837p4ungawt9W5__vxyZs7ZKcRyZJsilad9Ch8YEdFe4ewDFWXebelExtBtKeUjOWxW_ZlzNWjqrCi_D78M-LXZORKXG2dZvw9bSl-tqUMXTBm7n4aj_m0Y3g',
      tag: 'Lifetime Vault',
    },
  ];

  return (
    <section className="w-full max-w-[84rem] mx-auto px-3 sm:px-6 lg:px-8 py-3">
      {/* Desktop / Tablet: Collage Layout */}
      <div className="hidden md:grid grid-cols-12 gap-3 lg:gap-4 h-[340px]">
        {/* Card 1: Tall Red Banner (Left Column - 4 cols) */}
        <Link
          href={banners[0].href}
          onMouseEnter={() => setActiveHover(banners[0].id)}
          onMouseLeave={() => setActiveHover(null)}
          className={`col-span-4 rounded-3xl ${banners[0].bgColor} relative overflow-hidden p-6 flex flex-col justify-between group shadow-sm transition-all duration-300 hover:shadow-xl`}
        >
          {/* Giant Typographic Number in Background */}
          <span className="absolute -left-3 top-2 font-serif font-black text-[130px] lg:text-[150px] leading-none select-none pointer-events-none text-white/15 tracking-tighter">
            {banners[0].discount}
          </span>

          {/* Floating Product Image */}
          <div className="absolute -right-4 top-8 w-44 lg:w-52 aspect-square z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:-translate-y-2">
            <img
              src={banners[0].image}
              alt={banners[0].title}
              className="w-full h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* Top Badge */}
          <div className="relative z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
              <Flame className="w-3 h-3 text-[#fd6a49]" />
              <span>{banners[0].tag}</span>
            </span>
          </div>

          {/* Bottom Title & CTA */}
          <div className="relative z-20 text-white max-w-[200px]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/70">
              {banners[0].category}
            </span>
            <h3 className="text-xl lg:text-2xl font-black tracking-tight leading-tight mt-0.5">
              {banners[0].title}
            </h3>
            <p className="text-xs text-white/80 font-medium mt-1 line-clamp-1">
              {banners[0].subtitle}
            </p>
            <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        {/* Column 2: Stacked Green & Blue Cards (Middle Column - 4 cols) */}
        <div className="col-span-4 grid grid-rows-2 gap-3 lg:gap-4 h-full">
          {/* Card 2: Green Keyboard Tile */}
          <Link
            href={banners[1].href}
            className={`rounded-2xl ${banners[1].bgColor} relative overflow-hidden p-4 lg:p-5 flex items-center justify-between group shadow-sm transition-all duration-300 hover:shadow-xl`}
          >
            <span className="absolute -left-1 -bottom-4 font-serif font-black text-[90px] leading-none select-none pointer-events-none text-white/15">
              {banners[1].discount}
            </span>

            <div className="relative z-20 text-white max-w-[170px]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                {banners[1].category}
              </span>
              <h3 className="text-base lg:text-lg font-black tracking-tight leading-tight mt-0.5">
                {banners[1].title}
              </h3>
              <p className="text-[11px] text-white/80 font-medium mt-0.5 line-clamp-1">
                {banners[1].subtitle}
              </p>
            </div>

            <div className="relative z-10 w-28 lg:w-32 aspect-square shrink-0 transition-transform duration-500 group-hover:scale-115 group-hover:rotate-2">
              <img
                src={banners[1].image}
                alt={banners[1].title}
                className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)]"
              />
            </div>
          </Link>

          {/* Card 3: Blue Audio Tile */}
          <Link
            href={banners[2].href}
            className={`rounded-2xl ${banners[2].bgColor} relative overflow-hidden p-4 lg:p-5 flex items-center justify-between group shadow-sm transition-all duration-300 hover:shadow-xl`}
          >
            <span className="absolute -left-1 -bottom-4 font-serif font-black text-[90px] leading-none select-none pointer-events-none text-white/15">
              {banners[2].discount}
            </span>

            <div className="relative z-20 text-white max-w-[170px]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">
                {banners[2].category}
              </span>
              <h3 className="text-base lg:text-lg font-black tracking-tight leading-tight mt-0.5">
                {banners[2].title}
              </h3>
              <p className="text-[11px] text-white/80 font-medium mt-0.5 line-clamp-1">
                {banners[2].subtitle}
              </p>
            </div>

            <div className="relative z-10 w-28 lg:w-32 aspect-square shrink-0 transition-transform duration-500 group-hover:scale-115 group-hover:-rotate-2">
              <img
                src={banners[2].image}
                alt={banners[2].title}
                className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)]"
              />
            </div>
          </Link>
        </div>

        {/* Column 3: Brand Statement & 2 Mini Squares (Right Column - 4 cols) */}
        <div className="col-span-4 flex flex-col justify-between gap-3 lg:gap-4 h-full">
          {/* Top Brand Statement Block */}
          <div className="bg-[#131826] dark:bg-[#070a12] text-white rounded-2xl p-4 lg:p-5 flex flex-col justify-between flex-1 relative overflow-hidden border border-[#28334d]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fd6a49]">
                LIMITED STUDIO ACCESS
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div>
              <h3 className="text-xl lg:text-2xl font-black tracking-tight leading-none text-white">
                Studio Shopping <span className="text-emerald-400">Festival</span>
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Up to 35% off precision hardware, footwear &amp; acoustics.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/category"
                className="text-xs font-bold text-white hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>Browse All Catalog</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[10px] font-bold text-white/50">256-Bit Vault</span>
            </div>
          </div>

          {/* Bottom 2 Mini Tiles */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 h-[135px]">
            {/* Amber MagDock Tile */}
            <Link
              href={banners[3].href}
              className={`rounded-2xl ${banners[3].bgColor} relative overflow-hidden p-3 flex flex-col justify-between group shadow-sm transition-all duration-300 hover:shadow-xl`}
            >
              <span className="absolute -right-1 -top-3 font-serif font-black text-[60px] leading-none select-none pointer-events-none text-white/20">
                {banners[3].discount}
              </span>
              <div className="w-16 aspect-square z-10 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={banners[3].image}
                  alt={banners[3].title}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="relative z-20 text-white">
                <span className="text-[9px] font-extrabold text-amber-200 uppercase">MagDocks</span>
                <p className="text-xs font-black leading-tight">20% Off</p>
              </div>
            </Link>

            {/* Teal Bags Tile */}
            <Link
              href={banners[4].href}
              className={`rounded-2xl ${banners[4].bgColor} relative overflow-hidden p-3 flex flex-col justify-between group shadow-sm transition-all duration-300 hover:shadow-xl`}
            >
              <span className="absolute -right-1 -top-3 font-serif font-black text-[60px] leading-none select-none pointer-events-none text-white/20">
                {banners[4].discount}
              </span>
              <div className="w-16 aspect-square z-10 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={banners[4].image}
                  alt={banners[4].title}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="relative z-20 text-white">
                <span className="text-[9px] font-extrabold text-teal-200 uppercase">EDC Packs</span>
                <p className="text-xs font-black leading-tight">15% Off</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: Horizontal Swipeable Showcase Cards */}
      <div className="md:hidden flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
        {banners.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`min-w-[220px] max-w-[240px] shrink-0 rounded-2xl ${item.bgColor} relative overflow-hidden p-3.5 flex flex-col justify-between min-h-[140px] text-white shadow-xs active:scale-98 transition-transform`}
          >
            {/* Giant Background Number */}
            <span className="absolute -left-2 -bottom-2 font-serif font-black text-[70px] leading-none select-none pointer-events-none text-white/15">
              {item.discount}
            </span>

            {/* Top Section with Tag and Floating Image */}
            <div className="flex items-start justify-between gap-2 relative z-10">
              <span className="inline-flex px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-md text-[9px] font-black uppercase text-white">
                {item.tag}
              </span>

              <div className="w-16 h-16 shrink-0 aspect-square">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/70">
                {item.category}
              </span>
              <h3 className="text-xs font-black tracking-tight leading-tight line-clamp-1">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
