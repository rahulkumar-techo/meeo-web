'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '144276962057-4bvnhi2femp4rv8ddh0t8h437rht5e5t.apps.googleusercontent.com';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-[calc(100vh-80px)] w-full flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-10 bg-[#FAF8F5]">
      {/* Top Utility Navigation */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#786C64] hover:text-[#2D2621] transition-colors p-2 rounded-xl hover:bg-[#EFEAE4]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFEAE4] border border-[#E5DFD7] text-[11px] font-semibold text-[#786C64]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C5338]" />
            <span>256-Bit SSL Encrypted Portal</span>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex items-center justify-center">
        {children}
      </div>

      {/* Auth Legal & Micro Footer */}
      <div className="max-w-6xl mx-auto w-full pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#786C64] border-t border-[#E8E2DA] mt-6">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Meeo E-Commerce Inc.</span>
          <span>·</span>
          <span>Member ID Gateway</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:underline hover:text-[#2D2621]">
            About Us
          </Link>
          <Link href="/category?deals=true" className="hover:underline hover:text-[#2D2621]">
            Archive Deals
          </Link>
          <Link href="#" className="hover:underline hover:text-[#2D2621]">
            Privacy & Terms
          </Link>
        </div>
      </div>
    </div>
  </GoogleOAuthProvider>
);
}
