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
} from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { Button } from '@/components/ui/Button';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { useToast } from '@/context/ToastContext';
import { useLoginMutation, useResendOtpMutation } from '@/hooks/useAuthMutations';

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
  const isSubmitting = loginMutation.isPending || resendOtpMutation.isPending;

  const handleSocialLogin = (provider: 'google' | 'apple' | 'passkey') => {
    showToast(`${provider.toUpperCase()} single sign-on redirecting...`);
    if (typeof window !== 'undefined') {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://meeo-server.onrender.com/api/v1'}/auth/${provider}`;
    }
  };

  const handleAutoFillDemo = () => {
    setIdentifier('milo.kapoor@studio.meeo');
    setPassword('meeoCollector2026!');
    setErrorMsg('');
    showToast('Demo collector credentials populated');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    loginMutation.mutate(
      { email: identifier.trim(), password },
      {
        onSuccess: (res) => {
          showToast(`Welcome back, ${res.data?.user?.firstName || 'Collector'}!`);
          router.push(redirectPath);
        },
        onError: (err: any) => {
          const apiMsg = err.response?.data?.message || err.message || 'Invalid credentials.';
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
          router.push(`/verify-otp?mode=login&dest=${encodeURIComponent(identifier.trim())}&redirect=${encodeURIComponent(redirectPath)}`);
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <div className="lg:col-span-6 xl:col-span-7 flex">
        <AuthVisualSide
          heading="Access the Curated Tactile Hardware Vault."
          subheading="Authenticate with your studio credentials to access member-only drops, order tracking, and private dispatches."
          badge="Meeo Collector Gateway"
        />
      </div>

      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
        <div className="w-full bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <MeeoLogo size="md" />
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] text-[11px] font-bold"
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

          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f2f3ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setErrorMsg(''); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'password' ? 'bg-white dark:bg-[#26314c] text-[#412ce7] dark:text-white shadow-xs' : 'text-[#464556]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setErrorMsg(''); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'otp' ? 'bg-white dark:bg-[#26314c] text-[#412ce7] dark:text-white shadow-xs' : 'text-[#464556]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>One-Time OTP</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#777588]" />
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@studio.meeo"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] text-sm outline-none focus:border-[#412ce7]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#412ce7] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#777588]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#c7c4d9] text-sm outline-none focus:border-[#412ce7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#777588]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#412ce7]"
                />
                <span className="text-xs text-[#464556] font-medium">Keep me signed in</span>
              </label>

              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full mt-2">
                Sign In to Studio
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpLoginRequest} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">Email</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#777588]" />
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="user@meeo.studio"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] text-sm outline-none focus:border-[#412ce7]"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full mt-2">
                Dispatch One-Time Code
              </Button>
            </form>
          )}

          <div className="mt-6">
            <SocialAuthButtons onSocialAuth={handleSocialLogin} isLoading={isSubmitting} />
          </div>

          <div className="mt-6 pt-5 border-t border-[#e2e7ff] dark:border-[#28334d] text-center">
            <p className="text-xs text-[#464556] dark:text-[#a6abbf]">
              New to Meeo Studio?{' '}
              <Link href="/register" className="font-bold text-[#412ce7] hover:underline">
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
    <Suspense fallback={<div className="w-full h-96 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#412ce7] border-t-transparent animate-spin" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
