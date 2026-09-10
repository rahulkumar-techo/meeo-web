'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Mail,
  Edit2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { Button } from '@/components/ui/Button';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { OtpInputGroup } from '@/features/auth/OtpInputGroup';
import { ResendOtpTimer } from '@/features/auth/ResendOtpTimer';
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useSendOtpMutation,
} from '@/hooks/useAuthMutations';
import { useToast } from '@/context/ToastContext';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') || 'login';
  const initialDest = searchParams.get('dest') || '+91 98450 12345';
  const redirectPath = searchParams.get('redirect') || '/account';

  const { showToast } = useToast();

  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  const sendOtpMutation = useSendOtpMutation();

  const [destination, setDestination] = useState<string>(initialDest);
  const [isEditingDest, setIsEditingDest] = useState<boolean>(false);
  const [editedDest, setEditedDest] = useState<string>(initialDest);
  const [otp, setOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isEmail = destination.includes('@');
  const isSubmitting = verifyOtpMutation.isPending || resendOtpMutation.isPending;

  const titleByMode = {
    login: 'One-Time Login Code',
    register: 'Verify Collector Identity',
    forgot_password: 'Password Recovery Code',
    phone_verify: 'Verify Phone Number',
  }[mode] || 'Verify OTP Code';

  const subtitleByMode = {
    login: 'Enter the 6-digit security pass sent to your registered channel.',
    register: 'Confirm your contact details to activate your Studio Membership.',
    forgot_password: 'Enter the code to verify your identity and set a new password.',
    phone_verify: 'Validate your phone to enable express dispatch SMS tracking.',
  }[mode] || 'Enter the 6-digit verification code.';

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    setErrorMsg('');

    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code');
      return;
    }

    verifyOtpMutation.mutate(
      {
        destination,
        otp: code,
        type: mode as 'login' | 'register' | 'forgot_password' | 'phone_verify',
      },
      {
        onSuccess: () => {
          showToast('Identity verified successfully!');
          if (mode === 'forgot_password') {
            router.push(
              `/reset-password?dest=${encodeURIComponent(destination)}&otp=${encodeURIComponent(code)}`
            );
          } else {
            router.push(redirectPath);
          }
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Invalid verification code. Please check and retry.');
          showToast(err.message, 'error');
        },
      }
    );
  };

  const handleResend = async (channel: 'sms' | 'whatsapp' | 'email') => {
    try {
      const res = await resendOtpMutation.mutateAsync({
        destination,
        type: mode as 'login' | 'register' | 'forgot_password' | 'phone_verify',
        channel,
      });
      showToast(res.message);
      setErrorMsg('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code';
      showToast(msg, 'error');
    }
  };

  const handleSaveEditedDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedDest.trim()) return;
    setDestination(editedDest.trim());
    setIsEditingDest(false);

    sendOtpMutation.mutate(
      {
        destination: editedDest.trim(),
        type: mode as 'login' | 'register' | 'forgot_password' | 'phone_verify',
      },
      {
        onSuccess: () => {
          showToast(`Dispatched new OTP to ${editedDest.trim()}`);
        },
      }
    );
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Visual Side Banner (Left) */}
      <div className="lg:col-span-6 xl:col-span-7 flex">
        <AuthVisualSide
          heading="Cryptographic Two-Factor Verification."
          subheading="Every transaction, account recovery, and vault sign-in on Meeo is guarded by time-synced one-time token verification."
          badge="Two-Factor Security Vault"
        />
      </div>

      {/* OTP Verification Card (Right) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
        <div className="w-full bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <MeeoLogo size="md" />
              <button
                type="button"
                onClick={() => {
                  setOtp('123456');
                  handleVerify('123456');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[11px] font-bold hover:bg-[#dae2fd] transition-colors cursor-pointer"
                title="Fill 123456 demo OTP"
              >
                <Sparkles className="w-3 h-3 text-[#fd6a49]" />
                <span>Fill Demo OTP (123456)</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] dark:text-white tracking-tight mt-2">
              {titleByMode}<span className="text-[#fd6a49]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#464556] dark:text-[#a6abbf]">
              {subtitleByMode}
            </p>
          </div>

          {/* Destination Target Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] flex items-center justify-center shrink-0">
                {isEmail ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-[#777588] dark:text-[#a6abbf] uppercase">
                  Code sent to
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-[#131b2e] dark:text-white">
                  {destination}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingDest(!isEditingDest)}
              className="p-1.5 rounded-xl hover:bg-[#eaedff] dark:hover:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Change phone or email"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          {/* Inline Edit Destination Form */}
          {isEditingDest && (
            <form onSubmit={handleSaveEditedDest} className="mb-6 p-4 rounded-2xl bg-[#f2f3ff] dark:bg-[#1e273d] flex flex-col gap-3">
              <label className="text-xs font-bold text-[#131b2e] dark:text-white">
                Update Destination Address:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={editedDest}
                  onChange={(e) => setEditedDest(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#131826] text-xs text-[#131b2e] dark:text-white outline-none"
                />
                <Button type="submit" size="sm" variant="primary">
                  Update &amp; Resend
                </Button>
              </div>
            </form>
          )}

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 6-Digit OTP Group Input */}
          <div className="my-6">
            <OtpInputGroup
              value={otp}
              onChange={(newVal) => {
                setOtp(newVal);
                setErrorMsg('');
              }}
              onComplete={(completedOtp) => {
                handleVerify(completedOtp);
              }}
              disabled={isSubmitting}
              error={Boolean(errorMsg)}
            />
          </div>

          {/* Verify Action Button */}
          <Button
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={otp.length !== 6}
            onClick={() => handleVerify()}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mb-6"
          >
            Verify &amp; Continue
          </Button>

          {/* Dynamic Resend OTP Timer & Channels */}
          <div className="pt-2">
            <ResendOtpTimer
              destination={destination}
              onResend={handleResend}
              isLoading={resendOtpMutation.isPending}
            />
          </div>

          {/* Back Navigation */}
          <div className="mt-8 pt-5 border-t border-[#e2e7ff] dark:border-[#28334d] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff] transition-colors"
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

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#412ce7] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
