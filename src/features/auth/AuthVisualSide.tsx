'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Zap, Package, Award } from 'lucide-react';

interface AuthVisualSideProps {
  heading?: string;
  subheading?: string;
  badge?: string;
}

export const AuthVisualSide: React.FC<AuthVisualSideProps> = ({
  heading = 'Every Step Begins With Exclusive Access.',
  subheading = 'Sign in to unlock curated member drops, private archive pricing, live order tracking, and complimentary priority delivery.',
  badge = 'UrbanNest Member Access',
}) => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1614] via-[#26201B] to-[#2D2621] text-[#FAF8F5] shadow-xl min-h-[580px] w-full border border-[#3E342D]">
      {/* Warm Ambient Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#8C5338]/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#C27838]/15 blur-2xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#EFEAE4] text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C27838]" />
          <span>{badge}</span>
        </div>
      </div>

      {/* Centerpiece Quotation & Value Proposition */}
      <div className="relative z-10 my-auto py-6">
        <h2 className="font-serif text-3xl xl:text-4xl font-normal tracking-tight leading-[1.18] text-[#FAF8F5] mb-4">
          {heading}
        </h2>
        <p className="text-[#E8E2DA]/80 text-sm xl:text-base leading-relaxed max-w-md font-normal">
          {subheading}
        </p>

        {/* Feature Pills Grid */}
        <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-[#C27838]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#FAF8F5]">Member Drops</p>
              <p className="text-[11px] text-[#E8E2DA]/70">Early 24h vault access</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-[#E8A366]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#FAF8F5]">Nest Rewards</p>
              <p className="text-[11px] text-[#E8E2DA]/70">Earn store credit</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#8C5338]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#FAF8F5]">Authentic Kicks</p>
              <p className="text-[11px] text-[#E8E2DA]/70">100% verified serial tags</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-[#C27838]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#FAF8F5]">Priority Dispatch</p>
              <p className="text-[11px] text-[#E8E2DA]/70">White-glove courier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Testimonial / Community Stat Footer */}
      <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full border-2 border-[#2D2621] bg-[#8C5338] text-[10px] font-bold text-white flex items-center justify-center">
              AF
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-[#2D2621] bg-[#C27838] text-[10px] font-bold text-white flex items-center justify-center">
              NB
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-[#2D2621] bg-[#1A1614] text-[10px] font-bold text-white flex items-center justify-center">
              AD
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#FAF8F5]">50,000+ Discerning Walkers</p>
            <p className="text-[10px] text-[#E8E2DA]/70">Joined the UrbanNest Community</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-[#C27838]">4.8 ★ Rating</p>
          <p className="text-[10px] text-[#E8E2DA]/70">Over 5.2k Reviews</p>
        </div>
      </div>
    </div>
  );
};
