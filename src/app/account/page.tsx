'use client';

import React from 'react';
import Link from 'next/link';
import { User, Package, Heart, Bell, ArrowRight, Settings } from 'lucide-react';
import { AccountProfileHeader } from '@/features/account/AccountProfileHeader';
import { SavedAddressesCard } from '@/features/account/SavedAddressesCard';
import { SavedPaymentsCard } from '@/features/account/SavedPaymentsCard';
import { OrderHistoryList } from '@/features/orders/OrderHistoryList';
import { useOrdersQuery } from '@/hooks/order/useOrder';
import { extractArray } from '@/lib/apiHelper';

export default function AccountPage() {
  const { data: ordersResponse } = useOrdersQuery({ limit: 1 });
  const recentOrders = extractArray(ordersResponse);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Bar */}
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-6">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[11px] font-bold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Studio Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Personal Shopping Dashboard<span className="text-[#fd6a49]">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="text-xs text-[#464556] hover:text-[#412ce7] font-semibold flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline-block">Wishlist</span>
            </Link>
            <Link
              href="/notifications"
              className="text-xs text-[#464556] hover:text-[#412ce7] font-semibold flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline-block">Notifications</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#e2e7ff]">
          <Link
            href="/account"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#412ce7] text-white shadow-xs flex items-center gap-1.5"
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
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#464556] hover:bg-[#eaedff] transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences &amp; Dark Mode</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex flex-col gap-8">
        <AccountProfileHeader />

        {/* Saved Addresses & Payments in 2-col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SavedAddressesCard />
          <SavedPaymentsCard />
        </div>

        {/* Recent Orders Overview */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#412ce7]" />
              <h3 className="text-lg font-bold text-[#131b2e]">Recent Dispatches &amp; Orders</h3>
            </div>
            <Link href="/orders" className="text-xs font-bold text-[#412ce7] hover:underline flex items-center gap-1">
              <span>View All Dispatches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <OrderHistoryList orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
