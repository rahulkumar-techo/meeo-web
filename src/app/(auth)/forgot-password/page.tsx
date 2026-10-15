'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { useForgotPasswordMutation } from '@/hooks/useAuthMutations';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const [destination, setDestination] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccessLinkSent, setIsSuccessLinkSent] = useState<boolean>(false);

  const isSubmitting = forgotPasswordMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!destination.trim()) {
      setErrorMsg('Please provide your registered email address');
      return;
    }

    forgotPasswordMutation.mutate(
      {
        email: destination.trim(),
      },
      {
        onSuccess: (res) => {
          showToast(res.message || 'Password reset verification code dispatched!', 'success');
          router.push(
            `/verify-otp?mode=forgot_password&dest=${encodeURIComponent(destination.trim())}`
          );
        },
        onError: (err: any) => {
          const apiMsg =
            err.response?.data?.message ||
            err.response?.data?.errors?.email ||
            err.message ||
            'Could not process request. Please try again.';
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
          heading="Secure Account Access Recovery."
          subheading="Follow the verified verification steps to reset your UrbanNest account credentials and resume exploring curated drops."
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
              Reset password<span className="text-[#8C5338]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#786C64]">
              Enter the email address registered with your account.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C64]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Sending Code...' : 'Dispatch Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-[#E8E2DA] text-center text-xs text-[#786C64]">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-bold text-[#8C5338] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
