'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { useToast } from '@/context/ToastContext';
import { useLoginMutation, useResendOtpMutation, useSignInWithGoogle } from '@/hooks/useAuthMutations';

import { getDeviceInfo, formatApiErrorMessage } from '@/lib/device';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';
  const { showToast } = useToast();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loginMutation = useLoginMutation();
  const resendOtpMutation = useResendOtpMutation();
  const signInWithGoogleMutation = useSignInWithGoogle();
  const isSubmitting =
    loginMutation.isPending ||
    resendOtpMutation.isPending ||
    signInWithGoogleMutation.isPending;

  const handleGoogleSuccess = (idToken: string) => {
    setErrorMsg('');
    const { deviceName, deviceId } = getDeviceInfo();

    signInWithGoogleMutation.mutate(
      { idToken, deviceName, deviceId },
      {
        onSuccess: (res) => {
          showToast(`Welcome back, ${res.data?.user?.firstName || 'Member'}!`, 'success');
          router.push(redirectPath);
        },
        onError: (err: any) => {
          const apiMsg = formatApiErrorMessage(err, 'Google sign-in could not be completed.');
          setErrorMsg(apiMsg);
          showToast(apiMsg, 'error');
        },
      }
    );
  };

  const handleAutoFillDemo = () => {
    setIdentifier('rahul.kumar@meeo.com');
    setPassword('Meeo2026!');
    setErrorMsg('');
    showToast('Demo member credentials populated');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    const { deviceName, deviceId } = getDeviceInfo();

    loginMutation.mutate(
      {
        email: identifier.trim(),
        password,
        deviceName,
        deviceId,
      },
      {
        onSuccess: (res) => {
          showToast(`Welcome back, ${res.data?.user?.firstName || 'Member'}!`, 'success');
          router.push(redirectPath);
        },
        onError: (err: any) => {
          const apiMsg = formatApiErrorMessage(err, 'Invalid email or password.');
          setErrorMsg(apiMsg);
          showToast(apiMsg, 'error');
        },
      }
    );
  };

  const handleOtpLoginRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email to receive an OTP');
      return;
    }

    resendOtpMutation.mutate(
      { email: identifier.trim() },
      {
        onSuccess: (res) => {
          showToast(res.message || 'One-time verification code dispatched!');
          router.push(
            `/verify-otp?mode=login&dest=${encodeURIComponent(
              identifier.trim()
            )}&redirect=${encodeURIComponent(redirectPath)}`
          );
        },
        onError: (err: any) => {
          const apiMsg = err.response?.data?.message || err.message || 'Could not dispatch OTP.';
          setErrorMsg(apiMsg);
          showToast(apiMsg, 'error');
        },
      }
    );
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl">
      {/* Editorial Visual Showcase on Left */}
      <div className="lg:col-span-6 xl:col-span-6 flex">
        <AuthVisualSide
          heading="Every Step Begins With Exclusive Access."
          subheading="Sign in to unlock curated footwear drops, private archive pricing, order tracking, and priority white-glove delivery."
          badge="Meeo Member Access"
        />
      </div>

      {/* Auth Form Card on Right */}
      <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
        <div className="w-full bg-white rounded-3xl p-6 sm:p-9 border border-[#E8E2DA] shadow-sm">
          {/* Header Brand & Autofill */}
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
                onClick={handleAutoFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE4] hover:bg-[#EAE4DC] text-[#8C5338] text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#C27838]" />
                <span>Demo Autofill</span>
              </button>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621] tracking-tight mt-3">
              Welcome back<span className="text-[#8C5338]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#786C64]">
              Enter your registered credentials to access your account.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#EFEAE4] border border-[#E5DFD7] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white text-[#2D2621] shadow-2xs font-bold'
                  : 'text-[#786C64] hover:text-[#2D2621]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'otp'
                  ? 'bg-white text-[#2D2621] shadow-2xs font-bold'
                  : 'text-[#786C64] hover:text-[#2D2621]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>One-Time OTP</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form Content */}
          {authMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C64]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#2D2621]">Password</label>
                  <Link
                    href={`/forgot-password?dest=${encodeURIComponent(identifier)}`}
                    className="text-xs text-[#8C5338] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#786C64] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E2DA] accent-[#8C5338] cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Meeo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpLoginRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                  Email for One-Time Code
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C64]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#786C64] mt-1.5">
                  We will send a 4-digit verification code to your inbox.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'Sending Code...' : 'Dispatch Login Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Social Auth Providers */}
          <div className="mt-6">
            <SocialAuthButtons onGoogleSuccess={handleGoogleSuccess} isLoading={isSubmitting} />
          </div>

          {/* Bottom Switch to Register */}
          <div className="pt-6 mt-6 border-t border-[#E8E2DA] text-center text-xs text-[#786C64]">
            <span>New to Meeo? </span>
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-bold text-[#8C5338] hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
