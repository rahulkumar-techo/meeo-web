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
  ShieldCheck,
  Package,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

export const AccountSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  // Notification Preferences State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [dropAlerts, setDropAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);

  // Shopping & Experience Preferences
  const [currency, setCurrency] = useState('INR');
  const [packaging, setPackaging] = useState<'eco' | 'gift'>('eco');
  const [autoOpenDrawer, setAutoOpenDrawer] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const handleSaveSettings = () => {
    showToast('Preferences updated successfully!');
  };

  const handleClearCache = () => {
    localStorage.removeItem('meeo_search_history');
    showToast('Browsing and search cache cleared');
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="flex flex-col gap-8">
        {/* 1. Appearance & Dark Mode */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#412ce7]" />
              <h3 className="text-base font-bold text-[#131b2e]">Visual Appearance &amp; Theme</h3>
            </div>
            <span className="text-xs font-semibold text-[#412ce7] uppercase">
              Active: {theme}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Tooltip title="Light mode with ambient lilac studio surface" arrow>
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  showToast('Switched to Light Studio Theme');
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  theme === 'light'
                    ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs ring-2 ring-[#412ce7]/20 scale-[1.02]'
                    : 'border-[#e2e7ff] hover:border-[#c7c4d9] bg-[#faf8ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#412ce7] shadow-xs">
                    <Sun className="w-5 h-5" />
                  </div>
                  {theme === 'light' && <Check className="w-4 h-4 text-[#412ce7]" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#131b2e] block">Light Canvas</span>
                  <p className="text-xs text-[#464556] mt-0.5">Airy lilac tinted studio surface</p>
                </div>
              </button>
            </Tooltip>

            <Tooltip title="Dark obsidian theme with reduced glare" arrow>
              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  showToast('Switched to Dark Monolith Theme');
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  theme === 'dark'
                    ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs ring-2 ring-[#412ce7]/20 scale-[1.02]'
                    : 'border-[#e2e7ff] hover:border-[#c7c4d9] bg-[#faf8ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-white shadow-xs">
                    <Moon className="w-5 h-5" />
                  </div>
                  {theme === 'dark' && <Check className="w-4 h-4 text-[#412ce7]" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#131b2e] block">Dark Obsidian</span>
                  <p className="text-xs text-[#464556] mt-0.5">Low-light tactile contrast</p>
                </div>
              </button>
            </Tooltip>

            <Tooltip title="Synchronize automatically with operating system schedule" arrow>
              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  showToast('Syncing theme with system preferences');
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  theme === 'system'
                    ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs ring-2 ring-[#412ce7]/20 scale-[1.02]'
                    : 'border-[#e2e7ff] hover:border-[#c7c4d9] bg-[#faf8ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#464556] shadow-xs">
                    <Laptop className="w-5 h-5" />
                  </div>
                  {theme === 'system' && <Check className="w-4 h-4 text-[#412ce7]" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#131b2e] block">System Automatic</span>
                  <p className="text-xs text-[#464556] mt-0.5">Matches your OS schedule</p>
                </div>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* 2. Notification Preferences using MUI Switches */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#412ce7]" />
              <h3 className="text-base font-bold text-[#131b2e]">Telemetry &amp; Notification Channels</h3>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[#f2f3ff]">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#412ce7] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#131b2e] block">Browser Push Notifications</span>
                  <p className="text-xs text-[#464556]">Receive real-time alerts when drops open or packages depart.</p>
                </div>
              </div>
              <Switch checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#412ce7] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#131b2e] block">Courier GPS Milestones</span>
                  <p className="text-xs text-[#464556]">SMS &amp; In-app updates for Air Priority dispatches.</p>
                </div>
              </div>
              <Switch checked={orderAlerts} onChange={(e) => setOrderAlerts(e.target.checked)} />
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Flame className="w-5 h-5 text-[#fd6a49] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#131b2e] block">Archival Drop Invites</span>
                  <p className="text-xs text-[#464556]">15-minute early access window before public serialization.</p>
                </div>
              </div>
              <Switch checked={dropAlerts} onChange={(e) => setDropAlerts(e.target.checked)} />
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-[#ae3115] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#131b2e] block">Wishlist Price Drop Alerts</span>
                  <p className="text-xs text-[#464556]">Immediate alert when saved objects enter seasonal curation.</p>
                </div>
              </div>
              <Switch checked={priceDropAlerts} onChange={(e) => setPriceDropAlerts(e.target.checked)} />
            </div>
          </div>
        </div>

        {/* 3. Shopping Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#412ce7]" />
              <h3 className="text-base font-bold text-[#131b2e]">Discerning Shopping Preferences</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase text-[#777588] block mb-2">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm font-semibold text-[#131b2e] outline-none cursor-pointer focus:border-[#412ce7]"
              >
                <option value="INR">INR (₹) · Indian Rupee</option>
                <option value="USD">USD ($) · US Dollar</option>
                <option value="EUR">EUR (€) · Euro</option>
                <option value="GBP">GBP (£) · British Pound</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#777588] block mb-2">Default Packaging Mode</label>
              <select
                value={packaging}
                onChange={(e) => setPackaging(e.target.value as 'eco' | 'gift')}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm font-semibold text-[#131b2e] outline-none cursor-pointer focus:border-[#412ce7]"
              >
                <option value="eco">Zero-Plastic Unbleached Pulp Tray (Standard)</option>
                <option value="gift">Studio Collector Velvet Gift Box (+₹250)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e2e7ff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#131b2e]">Automatically slide-open bag drawer on item addition</span>
              <Switch checked={autoOpenDrawer} onChange={(e) => setAutoOpenDrawer(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#131b2e]">Enforce 2-Factor Biometric authentication on checkout</span>
              <Switch checked={twoFactorAuth} onChange={(e) => setTwoFactorAuth(e.target.checked)} />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#e2e7ff] shadow-sm">
          <button
            type="button"
            onClick={handleClearCache}
            className="text-xs text-[#777588] hover:text-[#ba1a1a] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Local Search &amp; Cache</span>
          </button>

          <Button variant="primary" size="md" onClick={handleSaveSettings}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Fade>
  );
};
