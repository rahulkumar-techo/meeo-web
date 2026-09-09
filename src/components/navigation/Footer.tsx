import React from 'react';
import Link from 'next/link';
import { MeeoLogo } from '../ui/MeeoLogo';
import { ShieldCheck, Truck, RefreshCw, Award, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#faf8ff] border-t border-[#e2e7ff] pt-16 pb-24 md:pb-12 text-[#131b2e]">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#e2e7ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#131b2e]">100% Calibrated</h5>
              <p className="text-[11px] text-[#464556]">Individually verified items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#131b2e]">Air Priority Delivery</h5>
              <p className="text-[11px] text-[#464556]">Zero plastic cushioned packaging</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#131b2e]">2-Year Warranty</h5>
              <p className="text-[11px] text-[#464556]">Direct factory coverage</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#131b2e]">14-Day Discerning Trial</h5>
              <p className="text-[11px] text-[#464556]">Hassle-free studio returns</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Manifesto */}
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <MeeoLogo size="md" />
            <p className="text-xs text-[#464556] leading-relaxed max-w-sm">
              Meeo is an independent tech-commerce ecosystem engineering mindful daily hardware, quiet desk objects, and tactile living pieces for discerning modern spaces.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#fd6a49] animate-pulse" />
              <span className="text-xs font-semibold text-[#131b2e]">Bengaluru · Milano · Kyoto</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <h6 className="text-xs font-bold uppercase tracking-wider text-[#777588] mb-1">
              Curated Catalog
            </h6>
            <Link href="/category?cat=footwear" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Men&apos;s Footwear
            </Link>
            <Link href="/category?cat=workspace" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Workspace & Tech
            </Link>
            <Link href="/category?cat=audio" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Audio & Sound
            </Link>
            <Link href="/category?cat=living" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Home & Living
            </Link>
            <Link href="/category?cat=objects" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Objects & Bags
            </Link>
          </div>

          {/* Ecosystem Links */}
          <div className="flex flex-col gap-2.5">
            <h6 className="text-xs font-bold uppercase tracking-wider text-[#777588] mb-1">
              Meeo Ecosystem
            </h6>
            <Link href="/drops" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Archival Drops № 24
            </Link>
            <Link href="/orders" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Order Real-Time Tracker
            </Link>
            <Link href="/account" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Studio Membership
            </Link>
            <Link href="/wishlist" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors">
              Saved Wishboards
            </Link>
            <Link href="/admin" className="text-xs text-[#464556] hover:text-[#412ce7] transition-colors flex items-center gap-1">
              <span>Admin Studio</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Newsletter Subscribe */}
          <div className="flex flex-col gap-3">
            <h6 className="text-xs font-bold uppercase tracking-wider text-[#777588]">
              Curation Protocol
            </h6>
            <p className="text-xs text-[#464556]">
              Receive private drop invites and serialization notices. Zero spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="collector@domain.com"
                className="w-full h-9 px-3 bg-white border border-[#c7c4d9] rounded-lg text-xs outline-none focus:border-[#412ce7]"
              />
              <button
                type="button"
                className="px-3.5 h-9 bg-[#412ce7] text-white rounded-lg text-xs font-bold hover:bg-[#5b4dff] transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Sub-strip */}
        <div className="pt-8 border-t border-[#e2e7ff] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777588]">
          <p>© 2026 Meeo Labs & Studios Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#131b2e] cursor-pointer">Privacy Protocol</span>
            <span>·</span>
            <span className="hover:text-[#131b2e] cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-[#131b2e] cursor-pointer">Hardware Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
