'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles, Sun, Moon } from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import Tooltip from '@mui/material/Tooltip';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggleTheme = () => {
    toggleTheme();
    showToast(`Switched to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} theme`);
  };

  return (
    <div className="min-h-[calc(100vh-108px)] w-full flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Utility Nav in Auth Container */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between mb-6 sm:mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff] transition-colors p-2 rounded-xl hover:bg-[#eaedff]/60 dark:hover:bg-[#1e273d]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studio Store</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] text-[11px] font-bold text-[#464556] dark:text-[#a6abbf]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit TLS Vault Encryption</span>
          </div>

          <Tooltip title={`Current: ${theme} (${resolvedTheme}) · Switch`} arrow>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="w-9 h-9 rounded-xl bg-[#f2f3ff] dark:bg-[#182032] text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff] hover:bg-[#eaedff] dark:hover:bg-[#1e273d] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#fd6a49]" />
              ) : (
                <Moon className="w-4 h-4 text-[#412ce7]" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex items-center justify-center">
        {children}
      </div>

      {/* Auth Legal & Copyright Micro Footer */}
      <div className="max-w-6xl mx-auto w-full pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#777588] dark:text-[#a6abbf] border-t border-[#e2e7ff]/60 dark:border-[#28334d]/60 mt-8">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Meeo Tactile Objects Inc.</span>
          <span>·</span>
          <span>Studio ID Protocol</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="#" className="hover:underline hover:text-[#412ce7] dark:hover:text-[#685aff]">
            Privacy Shield
          </Link>
          <Link href="#" className="hover:underline hover:text-[#412ce7] dark:hover:text-[#685aff]">
            Collector Agreement
          </Link>
          <Link href="#" className="hover:underline hover:text-[#412ce7] dark:hover:text-[#685aff]">
            Security Vault
          </Link>
        </div>
      </div>
    </div>
  );
}
