'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, Sparkles, Shield, Gift, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const AccountProfileHeader: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Signed out of Meeo Studio');
    router.push('/login');
  };

  const displayName = user?.name || 'Milo Kapoor';
  const displayEmail = user?.email || 'milo.kapoor@studio.meeo';
  const displayPhone = user?.phone || '+91 98450 12345';
  const displayPoints = user?.memberPoints ?? 1200;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] flex items-center justify-center font-extrabold text-2xl border border-[#dae2fd] dark:border-[#28334d]">
          {initials}
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e2e7ff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-[#fd6a49]" />
            <span>Studio Tier · {user?.memberTier || 'Founding Member'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#131b2e] dark:text-white">
            {displayName}
          </h2>
          <p className="text-xs text-[#464556] dark:text-[#a6abbf]">
            {displayEmail} · {displayPhone}
          </p>
        </div>
      </div>

      {/* Rewards, Studio Points Card & Settings CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] flex-1 sm:flex-initial">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#fd6a49]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#777588] dark:text-[#a6abbf]">Studio Credit</span>
              <p className="text-base sm:text-lg font-extrabold text-[#131b2e] dark:text-white">
                {displayPoints.toLocaleString()} Pts (₹{displayPoints.toLocaleString()})
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#e2e7ff] dark:bg-[#28334d]" />

          <div>
            <span className="text-[10px] font-bold uppercase text-[#777588] dark:text-[#a6abbf]">Warranty Vault</span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">3 Active Products</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/account/settings"
            className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-[#182032] hover:bg-[#eaedff] dark:hover:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] border border-[#dae2fd] dark:border-[#28334d] flex items-center justify-center gap-2 text-xs font-bold transition-colors"
            title="Account Settings & Preferences"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="p-3.5 rounded-2xl bg-[#412ce7] hover:bg-[#5b4dff] text-white flex items-center justify-center gap-1.5 text-xs font-bold transition-colors shadow-xs"
              title="Sign In"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
