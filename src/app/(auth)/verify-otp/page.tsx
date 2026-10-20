'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Mail,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { OtpInputGroup } from '@/features/auth/OtpInputGroup';
import { ResendOtpTimer } from '@/features/auth/ResendOtpTimer';
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useVerifyResetOtpMutation,
  useForgotPasswordMutation,
} from '@/hooks/useAuthMutations';
import { useToast } from '@/context/ToastContext';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') || 'register';
  const initialDest = searchParams.get('dest') || searchParams.get('email') || '';
  const redirectPath = searchParams.get('redirect') || '/account';

  const { showToast } = useToast();

  const verifyOtpMutation = useVerifyOtpMutation();
  const verifyResetOtpMutation = useVerifyResetOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const [destination, setDestination] = useState<string>(initialDest);
  const [isEditingDest, setIsEditingDest] = useState<boolean>(!initialDest);
  const [editedDest, setEditedDest] = useState<string>(initialDest);
  const [otp, setOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isSubmitting =
    verifyOtpMutation.isPending ||
    verifyResetOtpMutation.isPending ||
    resendOtpMutation.isPending ||
    forgotPasswordMutation.isPending;

  const titleByMode: Record<string, string> = {
    login: 'One-Time Login Code',
    register: 'Verify Member Identity',
    forgot_password: 'Password Recovery Code',
  };

  const subtitleByMode: Record<string, string> = {
    login: 'Enter the 4-digit security code sent to your registered email.',
    register: 'Confirm your email to activate your Meeo membership.',
    forgot_password: 'Enter the code to verify your identity and set a new password.',
  };

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || otp;
    setErrorMsg('');

    if (!destination.trim()) {
      setErrorMsg('Please specify your email address.');
      setIsEditingDest(true);
      return;
    }

    if (code.length !== 4) {
      setErrorMsg('Please enter all 4 digits of your verification code');
      return;
    }

    if (mode === 'forgot_password') {
      verifyResetOtpMutation.mutate(
        {
          email: destination.trim(),
          otp: code,
        },
        {
          onSuccess: () => {
            showToast('Identity verified successfully!', 'success');
            router.push(
              `/reset-password?dest=${encodeURIComponent(destination.trim())}&otp=${encodeURIComponent(code)}`
            );
          },
          onError: (err: any) => {
            const apiMsg =
              err.response?.data?.message ||
              err.response?.data?.errors?.otp ||
              err.message ||
              'Invalid verification code. Please check and retry.';
            setErrorMsg(apiMsg);
            showToast(apiMsg, 'error');
          },
        }
      );
    } else {
      verifyOtpMutation.mutate(
        {
          email: destination.trim(),
          otp: code,
        },
        {
          onSuccess: () => {
            showToast('Account verified! Welcome to Meeo.', 'success');
            router.push(redirectPath);
          },
          onError: (err: any) => {
            const apiMsg =
              err.response?.data?.message ||
              err.response?.data?.errors?.otp ||
              err.message ||
              'Invalid verification code. Please check and retry.';
            setErrorMsg(apiMsg);
            showToast(apiMsg, 'error');
          },
        }
      );
    }
  };

  const handleResend = async () => {
    setErrorMsg('');

    if (!destination.trim()) {
      setErrorMsg('Please enter your email address to resend the code.');
      setIsEditingDest(true);
      return Promise.reject(new Error('Email is required'));
    }

    return new Promise<void>((resolve, reject) => {
      if (mode === 'forgot_password') {
        forgotPasswordMutation.mutate(
          { email: destination.trim() },
          {
            onSuccess: (res) => {
              showToast(res.message || 'New verification code dispatched!', 'success');
              resolve();
            },
            onError: (err: any) => {
              const apiMsg = err.response?.data?.message || err.message || 'Failed to resend code.';
              setErrorMsg(apiMsg);
              showToast(apiMsg, 'error');
              reject(err);
            },
          }
        );
      } else {
        resendOtpMutation.mutate(
          { email: destination.trim() },
          {
            onSuccess: (res) => {
              showToast(res.message || 'New verification code dispatched!', 'success');
              resolve();
            },
            onError: (err: any) => {
              const apiMsg = err.response?.data?.message || err.message || 'Failed to resend code.';
              setErrorMsg(apiMsg);
              showToast(apiMsg, 'error');
              reject(err);
            },
          }
        );
      }
    });
  };

  const handleDemoFill = () => {
    setOtp('1234');
    setErrorMsg('');
    showToast('Demo 4-digit code loaded', 'info');
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl">
      <div className="lg:col-span-6 xl:col-span-6 flex">
        <AuthVisualSide
          heading="Secure One-Time Authentication."
          subheading="Enter the 4-digit verification passcode to unlock your session and continue your footwear journey."
          badge="Meeo Security"
        />
      </div>

      <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
        <div className="w-full bg-white rounded-3xl p-6 sm:p-9 border border-[#E8E2DA] shadow-sm">
          <div className="flex flex-col gap-1.5 mb-6">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="font-serif text-2xl font-bold tracking-tight text-[#2D2621]"
              >
                Meeo
              </Link>
              <button
                type="button"
                onClick={handleDemoFill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] hover:bg-[#EAE4DC] text-[#8C5338] text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#C27838]" />
                <span>Demo (1234)</span>
              </button>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621] tracking-tight mt-3">
              {titleByMode[mode] || 'Verify Code'}<span className="text-[#8C5338]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#786C64]">
              {subtitleByMode[mode] || 'Enter the 4-digit code sent to your email.'}
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA] mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EFEAE4] text-[#8C5338] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#786C64]">Dispatched to</p>
                <p className="text-xs font-bold text-[#2D2621]">{destination || 'No email provided'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingDest(!isEditingDest)}
              className="text-xs font-semibold text-[#8C5338] hover:underline"
            >
              {destination ? 'Change' : 'Enter email'}
            </button>
          </div>

          {isEditingDest && (
            <div className="mb-5 flex gap-2">
              <input
                type="email"
                value={editedDest}
                onChange={(e) => setEditedDest(e.target.value)}
                className="flex-1 h-10 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
              />
              <button
                type="button"
                onClick={() => {
                  setDestination(editedDest);
                  setIsEditingDest(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#8C5338] text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* 4-Digit OTP Input */}
          <div className="my-6">
            <OtpInputGroup
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              length={4}
              disabled={isSubmitting}
              error={Boolean(errorMsg)}
            />
          </div>

          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={isSubmitting || otp.length !== 4}
            className="w-full h-11.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Authenticate & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Resend Timer */}
          <div className="mt-5 text-center">
            <ResendOtpTimer
              destination={destination}
              onResend={handleResend}
              isLoading={resendOtpMutation.isPending}
            />
          </div>

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

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
