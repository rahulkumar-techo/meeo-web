'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, User, Package, Heart } from 'lucide-react';
import { AccountSettings } from '@/features/account/AccountSettings';

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Bar */}
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-6">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Studio Configuration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Settings &amp; Preferences<span className="text-[#fd6a49]">.</span>
            </h1>
          </div>

          <Link
            href="/account"
            className="text-xs text-[#412ce7] font-bold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#e2e7ff]">
          <Link
            href="/account"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464556] hover:bg-[#eaedff] transition-colors flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Addresses</span>
          </Link>
          <Link
            href="/orders"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464556] hover:bg-[#eaedff] transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Orders &amp; Tracking</span>
          </Link>
          <Link
            href="/account/settings"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#412ce7] text-white shadow-xs flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences &amp; Dark Mode</span>
          </Link>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <AccountSettings />
      </div>
    </div>
  );
}
