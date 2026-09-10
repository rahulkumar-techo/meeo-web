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
  Smartphone,
  KeyRound,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { Button } from '@/components/ui/Button';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { useToast } from '@/context/ToastContext';
import {
  useLoginMutation,
  useSocialLoginMutation,
  useSendOtpMutation,
} from '@/hooks/useAuthMutations';

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

  // TanStack Query Mutations
  const loginMutation = useLoginMutation();
  const socialLoginMutation = useSocialLoginMutation();
  const sendOtpMutation = useSendOtpMutation();

  const isSubmitting =
    loginMutation.isPending || socialLoginMutation.isPending || sendOtpMutation.isPending;

  // Quick Demo Auto-fill Helper
  const handleAutoFillDemo = () => {
    setIdentifier('milo.kapoor@studio.meeo');
    setPassword('meeoCollector2026!');
    setErrorMsg('');
    showToast('Demo collector credentials populated');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or phone number');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    loginMutation.mutate(
      {
        identifier: identifier.trim(),
        password,
        rememberMe,
      },
      {
        onSuccess: (user) => {
          showToast(`Welcome back, ${user.name}!`);
          router.push(redirectPath);
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Invalid credentials. Please try again.');
          showToast(err.message, 'error');
        },
      }
    );
  };

  const handleOtpLoginRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or phone number to receive a one-time passcode');
      return;
    }

    sendOtpMutation.mutate(
      {
        destination: identifier.trim(),
        type: 'login',
      },
      {
        onSuccess: (res) => {
          showToast(res.message || 'One-time verification code dispatched!');
          router.push(
            `/verify-otp?mode=login&dest=${encodeURIComponent(identifier.trim())}&redirect=${encodeURIComponent(
              redirectPath
            )}`
          );
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Could not dispatch OTP code. Try again.');
          showToast(err.message, 'error');
        },
      }
    );
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'passkey') => {
    socialLoginMutation.mutate(provider, {
      onSuccess: (user) => {
        showToast(`Signed in with ${provider.toUpperCase()}`);
        router.push(redirectPath);
      },
      onError: (err) => {
        showToast(err.message || 'Social sign-in failed', 'error');
      },
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Editorial Visual Showcase (Left) */}
      <div className="lg:col-span-6 xl:col-span-7 flex">
        <AuthVisualSide
          heading="Access the Curated Tactile Hardware Vault."
          subheading="Authenticate with your studio credentials to access member-only drops, order tracking, hardware warranties, and private dispatches."
          badge="Meeo Collector Gateway"
        />
      </div>

      {/* Interactive Auth Card (Right) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
        <div className="w-full bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          {/* Brand Header & Toggle */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <MeeoLogo size="md" />
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[11px] font-bold hover:bg-[#dae2fd] transition-colors cursor-pointer"
                title="Autofill mock demo account"
              >
                <Sparkles className="w-3 h-3 text-[#fd6a49]" />
                <span>Demo Autofill</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] dark:text-white tracking-tight mt-2">
              Welcome back<span className="text-[#fd6a49]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#464556] dark:text-[#a6abbf]">
              Enter your registered studio credentials to access your portal.
            </p>
          </div>

          {/* Auth Method Mode Tabs (Password vs OTP Magic Login) */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f2f3ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'password'
                  ? 'bg-white dark:bg-[#26314c] text-[#412ce7] dark:text-white shadow-xs'
                  : 'text-[#464556] dark:text-[#a6abbf] hover:text-[#131b2e] dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'otp'
                  ? 'bg-white dark:bg-[#26314c] text-[#412ce7] dark:text-white shadow-xs'
                  : 'text-[#464556] dark:text-[#a6abbf] hover:text-[#131b2e] dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>One-Time OTP</span>
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Content */}
          {authMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              {/* Identifier Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@studio.meeo or +91 98450..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#412ce7] dark:text-[#685aff] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security password"
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
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#412ce7] border-[#c7c4d9] focus:ring-[#412ce7] cursor-pointer"
                  />
                  <span className="text-xs text-[#464556] dark:text-[#a6abbf] font-medium">
                    Keep me signed in on this device
                  </span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Sign In to Studio
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpLoginRequest} className="flex flex-col gap-4">
              {/* Identifier Input for OTP */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                  Registered Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98450 12345 or user@meeo.studio"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                  />
                </div>
                <p className="text-[11px] text-[#777588] dark:text-[#a6abbf]">
                  We will transmit an instant 6-digit security code via SMS or Email.
                </p>
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Dispatch One-Time Code
              </Button>
            </form>
          )}

          {/* Social Sign-in Buttons */}
          <div className="mt-6">
            <SocialAuthButtons onSocialAuth={handleSocialLogin} isLoading={isSubmitting} />
          </div>

          {/* Registration Navigation Link */}
          <div className="mt-6 pt-5 border-t border-[#e2e7ff] dark:border-[#28334d] text-center">
            <p className="text-xs text-[#464556] dark:text-[#a6abbf]">
              New to Meeo Studio?{' '}
              <Link
                href="/register"
                className="font-bold text-[#412ce7] dark:text-[#685aff] hover:underline"
              >
                Create Collector Account
              </Link>
            </p>
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
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#412ce7] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
