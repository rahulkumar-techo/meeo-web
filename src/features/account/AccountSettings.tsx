'use client';

import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  Smartphone,
  Flame,
  Tag,
  Package,
  Sliders,
  Check,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';

export const AccountSettings: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { showToast } = useToast();

  // Notification Preferences State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [dropAlerts, setDropAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(false);

  // Experience Preferences
  const [currency, setCurrency] = useState('INR');
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(true);

  const handleSaveSettings = () => {
    showToast('Preferences updated successfully!');
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('urban_nest_search_history');
      localStorage.removeItem('meeo_search_history');
    } catch {
      // Ignore
    }
    showToast('Local cache & search history cleared');
  };

  return (
    <div className="space-y-8">
      {/* 1. APPEARANCE & THEME */}
      <div className="space-y-4">
        <div className="border-b border-[#E8E2DA] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                Visual Appearance
              </h2>
              <p className="text-xs text-[#786C64] mt-0.5">
                Customize the interface theme to suit your lighting preference.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#8C5338]/10 text-[#8C5338] text-[11px] font-bold uppercase tracking-wider">
              Active: {theme} ({resolvedTheme})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              showToast('Switched to Light Mode');
            }}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-[#8C5338] bg-[#FAF8F5] ring-2 ring-[#8C5338]/30 shadow-xs'
                : 'border-[#E8E2DA] hover:border-[#8C5338]/40 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  theme === 'light'
                    ? 'bg-[#8C5338] text-white'
                    : 'bg-[#FAF8F5] text-[#2D2621]'
                }`}
              >
                <Sun className="w-5 h-5" />
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-[#8C5338] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-[#2D2621] block">Light Mode</span>
              <p className="text-xs text-[#786C64] mt-0.5">
                Clean daylight aesthetic with warm sand surfaces
              </p>
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              showToast('Switched to Dark Mode');
            }}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#8C5338] bg-[#FAF8F5] ring-2 ring-[#8C5338]/30 shadow-xs'
                : 'border-[#E8E2DA] hover:border-[#8C5338]/40 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#8C5338] text-white'
                    : 'bg-[#FAF8F5] text-[#2D2621]'
                }`}
              >
                <Moon className="w-5 h-5" />
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-[#8C5338] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-[#2D2621] block">Dark Mode</span>
              <p className="text-xs text-[#786C64] mt-0.5">
                Deep obsidian palette for comfortable low-light browsing
              </p>
            </div>
          </button>

          {/* System Automatic Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('system');
              showToast('Theme synced with device system settings');
            }}
            className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-[#8C5338] bg-[#FAF8F5] ring-2 ring-[#8C5338]/30 shadow-xs'
                : 'border-[#E8E2DA] hover:border-[#8C5338]/40 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  theme === 'system'
                    ? 'bg-[#8C5338] text-white'
                    : 'bg-[#FAF8F5] text-[#2D2621]'
                }`}
              >
                <Laptop className="w-5 h-5" />
              </div>
              {theme === 'system' && (
                <div className="w-5 h-5 rounded-full bg-[#8C5338] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-[#2D2621] block">System Automatic</span>
              <p className="text-xs text-[#786C64] mt-0.5">
                Adapts seamlessly to your operating system preference
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATIONS & ALERTS */}
      <div className="space-y-4 pt-4 border-t border-[#E8E2DA]">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D2621]">
            Notifications &amp; Alerts
          </h2>
          <p className="text-xs text-[#786C64] mt-0.5">
            Manage real-time alerts for dispatches, order updates, and seasonal drops.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8E2DA] hover:bg-[#FAF8F5]/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <Package className="w-4.5 h-4.5 text-[#8C5338] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#2D2621] block">Order &amp; Courier Milestones</span>
                <span className="text-[11px] text-[#786C64]">Real-time tracking notifications when parcels dispatch</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={orderAlerts}
              onChange={(e) => setOrderAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#8C5338] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8E2DA] hover:bg-[#FAF8F5]/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <Flame className="w-4.5 h-4.5 text-[#8C5338] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#2D2621] block">New Arrivals &amp; Drops</span>
                <span className="text-[11px] text-[#786C64]">Early access alerts for limited edition sneaker releases</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dropAlerts}
              onChange={(e) => setDropAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#8C5338] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8E2DA] hover:bg-[#FAF8F5]/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <Tag className="w-4.5 h-4.5 text-[#8C5338] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#2D2621] block">Wishlist Price Drop Alerts</span>
                <span className="text-[11px] text-[#786C64]">Notifies you immediately when saved items go on discount</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={priceDropAlerts}
              onChange={(e) => setPriceDropAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#8C5338] rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 3. EXPERIENCE PREFERENCES */}
      <div className="space-y-4 pt-4 border-t border-[#E8E2DA]">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D2621]">
            Experience Preferences
          </h2>
          <p className="text-xs text-[#786C64] mt-0.5">
            Configure default currency display and shopping interface behaviors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#786C64] mb-1.5">Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs font-medium text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
            >
              <option value="INR">INR (₹) · Indian Rupee</option>
              <option value="USD">USD ($) · United States Dollar</option>
              <option value="EUR">EUR (€) · Euro</option>
              <option value="GBP">GBP (£) · British Pound</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8E2DA] bg-[#FAF8F5]">
            <div>
              <span className="text-xs font-bold text-[#2D2621] block">Slide Open Cart Drawer</span>
              <span className="text-[11px] text-[#786C64]">Auto open drawer when adding items to cart</span>
            </div>
            <input
              type="checkbox"
              checked={autoOpenDrawer}
              onChange={(e) => setAutoOpenDrawer(e.target.checked)}
              className="w-4 h-4 accent-[#8C5338] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. ACTIONS & STORAGE */}
      <div className="pt-6 border-t border-[#E8E2DA] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleClearCache}
          className="text-xs font-semibold text-[#786C64] hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Local Search &amp; Cache</span>
        </button>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-6 py-2.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
