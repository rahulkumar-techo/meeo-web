'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { PasswordStrengthMeter } from '@/features/auth/PasswordStrengthMeter';
import { useResetPasswordMutation } from '@/hooks/useAuthMutations';
import { useToast } from '@/context/ToastContext';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const destination = searchParams.get('dest') || 'rahul.kumar@urbannest.com';
  const otp = searchParams.get('otp') || '1234';

  const { showToast } = useToast();
  const resetPasswordMutation = useResetPasswordMutation();

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    resetPasswordMutation.mutate(
      {
        email: destination,
        otp,
        password,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          showToast('Account password successfully updated!', 'success');
        },
        onError: (err: any) => {
          const apiMsg =
            err.response?.data?.message ||
            err.response?.data?.errors?.password ||
            err.response?.data?.errors?.otp ||
            err.message ||
            'Could not update password. Please retry.';
          setErrorMsg(apiMsg);
          showToast(apiMsg, 'error');
        },
      }
    );
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl">
      <div className="lg:col-span-6 xl:col-span-6 flex">
        <AuthVisualSide
          heading="Secure Password Configuration."
          subheading="Choose a strong security key to safeguard your order history, shipping addresses, and member privileges."
          badge="UrbanNest Security"
        />
      </div>

      <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
        <div className="w-full bg-white rounded-3xl p-6 sm:p-9 border border-[#E8E2DA] shadow-sm">
          <div className="flex flex-col gap-1.5 mb-6">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-[#2D2621]"
            >
              UrbanNest
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621] tracking-tight mt-3">
              Set new password<span className="text-[#8C5338]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#786C64]">
              Configure a new password for account {destination}.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2D2621]">
                Password Successfully Reset
              </h3>
              <p className="text-xs text-[#786C64]">
                Your account is now protected with your new password.
              </p>
              <Link
                href="/login"
                className="w-full h-11 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C64]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786C64] hover:text-[#2D2621] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C64]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full h-11.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>
                  {resetPasswordMutation.isPending
                    ? 'Updating Password...'
                    : 'Save & Update Password'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-6 mt-6 border-t border-[#E8E2DA] text-center text-xs text-[#786C64]">
            <Link
              href="/login"
              className="font-bold text-[#8C5338] hover:underline"
            >
              Cancel and Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
