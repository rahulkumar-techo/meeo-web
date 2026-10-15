'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useUserStore } from '@/store/user.store';
import { OrdersTab } from '@/features/account/OrdersTab';
import { AppRoute } from '@/routes';

const SAVED_ADDRESSES = [
  {
    id: 'addr-1',
    tag: 'Home (Default)',
    isDefault: true,
    recipient: 'Rahul Kumar',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, Highline Residency, 14th Main Rd, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin: '560038',
  },
  {
    id: 'addr-2',
    tag: 'Studio / Work',
    isDefault: false,
    recipient: 'Rahul Kumar',
    phone: '+91 98765 43210',
    addressLine: 'Floor 3, Urban Creators Hub, Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin: '560103',
  },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'payments' | 'profile'>('orders');
  const { user, isAuthenticated } = useUserStore();

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
    : 'Guest Explorer';
  const displayEmail = user?.email || 'Sign in to access orders and saved addresses';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'UN';

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#786C64] mb-4">
          <Link href="/" className="hover:text-[#2D2621] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#2D2621] font-semibold">Account</span>
        </nav>

        {/* User Hero Banner */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 mb-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#EFEAE4] border border-[#E5DFD7] flex items-center justify-center text-[#8C5338] font-serif text-2xl font-bold">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621]">
                    {displayName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8C5338]/10 text-[#8C5338] text-[10px] font-bold uppercase tracking-wider">
                    {isAuthenticated ? 'Nest Member' : 'Guest'}
                  </span>
                </div>
                <p className="text-xs text-[#786C64] mt-0.5">
                  {displayEmail}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 bg-[#FAF8F5] px-4 py-3 rounded-2xl border border-[#E8E2DA]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#786C64]">Reward Points</div>
                  <div className="text-lg font-bold text-[#2D2621]">1,450 pts</div>
                </div>
                <div className="h-8 w-px bg-[#E8E2DA]" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#786C64]">Tier Status</div>
                  <div className="text-xs font-bold text-[#8C5338]">Gold Access</div>
                </div>
              </div>
            ) : (
              <Link
                href={AppRoute.AUTH.LOGIN_WITH_REDIRECT(AppRoute.ACCOUNT)}
                className="px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>

        {/* Account Layout (Sidebar Tabs + Tab Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#E8E2DA] p-3 shadow-2xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#8C5338]" />
                <span>Orders</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#8C5338]" />
                <span>Saved Addresses</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#8C5338]" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#8C5338]" />
                <span>Account Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>
          </aside>

          {/* Tab Content Area */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && <OrdersTab />}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E2DA] pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                      Delivery Addresses
                    </h2>
                    <p className="text-xs text-[#786C64] mt-0.5">
                      Manage your saved doorstep delivery destinations.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-[#8C5338] text-white text-xs font-semibold hover:bg-[#72422C] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAVED_ADDRESSES.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-[#8C5338] bg-[#FAF8F5]'
                          : 'border-[#E8E2DA] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#8C5338] uppercase tracking-wider">
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8C5338] text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#2D2621]">{addr.recipient}</h3>
                      <p className="text-xs text-[#786C64] mt-1 leading-relaxed">
                        {addr.addressLine}, {addr.city}, {addr.state} – {addr.pin}
                      </p>
                      <p className="text-xs text-[#2D2621] font-medium mt-2">
                        Phone: {addr.phone}
                      </p>
                      <div className="flex items-center gap-3 pt-3 mt-3 border-t border-[#E8E2DA] text-xs">
                        <button type="button" className="text-[#8C5338] hover:underline font-semibold cursor-pointer">
                          Edit
                        </button>
                        {!addr.isDefault && (
                          <button type="button" className="text-[#786C64] hover:text-[#2D2621] cursor-pointer">
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="border-b border-[#E8E2DA] pb-4">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                    Payment Methods
                  </h2>
                  <p className="text-xs text-[#786C64] mt-0.5">
                    Saved credit/debit cards and authenticated UPI handles.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded bg-[#2D2621] text-white text-[10px] font-bold flex items-center justify-center">
                        VISA
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2D2621]">•••• •••• •••• 4092</div>
                        <div className="text-[11px] text-[#786C64]">Expires 08/29 · Primary Card</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#8C5338]">Default</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#E8E2DA] bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded bg-[#8C5338] text-white text-[10px] font-bold flex items-center justify-center">
                        UPI
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2D2621]">rahulkumar@okaxis</div>
                        <div className="text-[11px] text-[#786C64]">Instant QR / Mandate Verified</div>
                      </div>
                    </div>
                    <button type="button" className="text-xs text-[#786C64] hover:text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="border-b border-[#E8E2DA] pb-4">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                    Account Information
                  </h2>
                  <p className="text-xs text-[#786C64] mt-0.5">
                    Update personal profile details and preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Rahul Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      defaultValue="rahul.kumar@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">Preferred Shoe Size</label>
                    <select
                      defaultValue="UK 9"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    >
                      <option value="UK 7">UK 7</option>
                      <option value="UK 8">UK 8</option>
                      <option value="UK 9">UK 9</option>
                      <option value="UK 10">UK 10</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E2DA]">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
