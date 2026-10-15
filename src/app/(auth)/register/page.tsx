'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { PasswordStrengthMeter } from '@/features/auth/PasswordStrengthMeter';
import { useToast } from '@/context/ToastContext';
import { useRegisterMutation, useSignInWithGoogle } from '@/hooks/useAuthMutations';
import { getDeviceInfo, formatApiErrorMessage } from '@/lib/device';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';
  const { showToast } = useToast();

  const registerMutation = useRegisterMutation();
  const signInWithGoogleMutation = useSignInWithGoogle();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isSubmitting = registerMutation.isPending || signInWithGoogleMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName.trim()) {
      setErrorMsg('Please enter your first name');
      return;
    }

    if (!lastName.trim()) {
      setErrorMsg('Please enter your last name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the UrbanNest Member Terms to continue');
      return;
    }

    registerMutation.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          showToast(`Account created! Verification code dispatched to ${email.trim()}`, 'success');
          router.push(
            `/verify-otp?mode=register&dest=${encodeURIComponent(
              email.trim()
            )}&redirect=${encodeURIComponent(redirectPath)}`
          );
        },
        onError: (err: any) => {
          const apiMsg =
            err.response?.data?.message ||
            err.response?.data?.errors?.email ||
            err.response?.data?.errors?.password ||
            err.message ||
            'Registration failed. Please try again.';
          setErrorMsg(apiMsg);
          showToast(apiMsg, 'error');
        },
      }
    );
  };

  const handleGoogleSuccess = (idToken: string) => {
    setErrorMsg('');
    const { deviceName, deviceId } = getDeviceInfo();

    signInWithGoogleMutation.mutate(
      { idToken, deviceName, deviceId },
      {
        onSuccess: (res) => {
          showToast(`Welcome to UrbanNest, ${res.data?.user?.firstName || 'Member'}!`, 'success');
          router.push(redirectPath);
        },
        onError: (err: any) => {
          const apiMsg = formatApiErrorMessage(err, 'Google registration could not be completed.');
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
          heading="Join the UrbanNest Footwear Collective."
          subheading="Become an exclusive member to unlock member-only archival drops, complimentary sizing exchanges, and personal tier rewards."
          badge="UrbanNest Membership"
        />
      </div>

      {/* Register Form Card on Right */}
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
              Create an account<span className="text-[#8C5338]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#786C64]">
              Join thousands of discerning sneaker and lifestyle enthusiasts.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786C64]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Rahul"
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kumar"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] focus:bg-white text-xs text-[#2D2621] placeholder:text-[#786C64] focus:outline-none focus:border-[#8C5338] focus:ring-1 focus:ring-[#8C5338]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2621] mb-1.5">
                Password
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
                  placeholder="Create a strong password"
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

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-[#786C64] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#E8E2DA] accent-[#8C5338] cursor-pointer shrink-0"
                />
                <span>
                  I agree to the{' '}
                  <Link href="#" className="font-semibold text-[#8C5338] hover:underline">
                    Member Terms
                  </Link>{' '}
                  and Privacy Policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create UrbanNest Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6">
            <SocialAuthButtons onGoogleSuccess={handleGoogleSuccess} isLoading={isSubmitting} />
          </div>

          <div className="pt-6 mt-6 border-t border-[#E8E2DA] text-center text-xs text-[#786C64]">
            <span>Already have an account? </span>
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-bold text-[#8C5338] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
