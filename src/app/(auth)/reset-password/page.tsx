'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { Button } from '@/components/ui/Button';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { PasswordStrengthMeter } from '@/features/auth/PasswordStrengthMeter';
import { useResetPasswordMutation } from '@/hooks/useAuthMutations';
import { useToast } from '@/context/ToastContext';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const destination = searchParams.get('dest') || 'collector@studio.meeo';
  const otp = searchParams.get('otp') || '123456';

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
        destination,
        otp,
        newPassword: password,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          showToast('Security password successfully updated!');
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Failed to update password. Please try again.');
          showToast(err.message, 'error');
        },
      }
    );
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Visual Side Banner (Left) */}
      <div className="lg:col-span-6 xl:col-span-7 flex">
        <AuthVisualSide
          heading="Restore Account Security."
          subheading="Choose a strong, unique passphrase to safeguard your orders, studio points balance, and hardware warranty certificates."
          badge="Vault Key Reset"
        />
      </div>

      {/* Reset Password Card (Right) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
        <div className="w-full bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <MeeoLogo size="md" />
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] dark:bg-[#1e273d] flex items-center justify-center text-[#412ce7] dark:text-[#685aff]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] dark:text-white tracking-tight mt-2">
              Set New Password<span className="text-[#fd6a49]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#464556] dark:text-[#a6abbf]">
              Enter and confirm your new studio account access passphrase.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#131b2e] dark:text-white mb-1">
                Password Reset Complete!
              </h3>
              <p className="text-xs text-[#464556] dark:text-[#a6abbf] mb-6">
                Your new security password is now active. You can now sign in to your studio dashboard.
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Sign In Now
              </Button>
            </div>
          ) : (
            <>
              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#777588] hover:text-[#131b2e] dark:hover:text-white cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <PasswordStrengthMeter password={password} />
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={resetPasswordMutation.isPending}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full mt-2"
                >
                  Save &amp; Activate Password
                </Button>
              </form>
            </>
          )}

          {/* Return link */}
          <div className="mt-6 pt-5 border-t border-[#e2e7ff] dark:border-[#28334d] text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff]"
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
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#412ce7] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
