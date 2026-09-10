'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowUpRight, Box, Compass } from 'lucide-react';

interface AuthVisualSideProps {
  heading?: string;
  subheading?: string;
  badge?: string;
}

export const AuthVisualSide: React.FC<AuthVisualSideProps> = ({
  heading = 'Tactile Commerce for Discerning Collectors.',
  subheading = 'Unlock member-exclusive drops, archival hardware pre-orders, express studio dispatches, and private showroom events.',
  badge = 'Studio Identity Access',
}) => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b1062] via-[#2f1cb8] to-[#412ce7] text-white shadow-2xl min-h-[620px]">
      {/* Dynamic Background Geometry & Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#fd6a49]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#c4c0ff]/20 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#fd6a49]" />
          <span>{badge}</span>
        </div>
      </div>

      {/* Centerpiece Quotation / Value Proposition */}
      <div className="relative z-10 my-auto py-8">
        <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
          {heading}
        </h2>
        <p className="text-white/80 text-sm xl:text-base leading-relaxed max-w-md font-medium">
          {subheading}
        </p>

        {/* Tactile Highlights Pill List */}
        <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Box className="w-4 h-4 text-[#ffb4a3]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Curated Drops</p>
              <p className="text-[11px] text-white/70">Early 24h Vault Access</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-[#ffdbcc]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Priority Dispatch</p>
              <p className="text-[11px] text-white/70">Express fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#c4c0ff]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Hardware Vault</p>
              <p className="text-[11px] text-white/70">Extended warranty pass</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-[#ffb595]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Studio Credit</p>
              <p className="text-[11px] text-white/70">5% back on all orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Testimonial / Community Stat Footer */}
      <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white/50 bg-[#fd6a49] text-[10px] font-extrabold flex items-center justify-center">
              MK
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white/50 bg-[#412ce7] text-[10px] font-extrabold flex items-center justify-center">
              EL
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-white/50 bg-[#5b4dff] text-[10px] font-extrabold flex items-center justify-center">
              AR
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-white">18,400+ Active Collectors</p>
            <p className="text-[11px] text-white/70">Across Bengaluru, Tokyo &amp; NYC</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-white/80">
          <span>Explore Vault</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
