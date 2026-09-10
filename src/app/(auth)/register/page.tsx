'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Gift,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { Button } from '@/components/ui/Button';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { PasswordStrengthMeter } from '@/features/auth/PasswordStrengthMeter';
import { useToast } from '@/context/ToastContext';
import { useRegisterMutation, useSocialLoginMutation } from '@/hooks/useAuthMutations';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const registerMutation = useRegisterMutation();
  const socialLoginMutation = useSocialLoginMutation();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Workspace Tech',
    'Audio & Sound',
  ]);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isSubmitting = registerMutation.isPending || socialLoginMutation.isPending;

  const interestOptions = [
    'Workspace Tech',
    'Footwear & Kicks',
    'Audio & Sound',
    'Living & Objects',
    'Curated Drops',
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
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
      setErrorMsg('Please agree to the Studio Collector Terms to continue');
      return;
    }

    registerMutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        interests: selectedInterests,
      },
      {
        onSuccess: (user) => {
          showToast(`Welcome to the Meeo Collective, ${user.name}!`);
          router.push(
            `/verify-otp?mode=register&dest=${encodeURIComponent(email.trim())}&redirect=/account`
          );
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Registration failed. Please try again.');
          showToast(err.message, 'error');
        },
      }
    );
  };

  const handleSocialAuth = (provider: 'google' | 'apple' | 'passkey') => {
    socialLoginMutation.mutate(provider, {
      onSuccess: (user) => {
        showToast(`Welcome to Meeo, ${user.name}!`);
        router.push('/account');
      },
      onError: (err) => {
        showToast(err.message || 'Social registration failed', 'error');
      },
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Visual Side Banner (Left) */}
      <div className="lg:col-span-6 xl:col-span-7 flex">
        <AuthVisualSide
          heading="Join 18,400+ Curators & Design Collectors."
          subheading="Creating an account grants you early drop notifications, priority dispatch routing, digital vault warranties, and 200 welcome Studio Points."
          badge="Collector Onboarding"
        />
      </div>

      {/* Register Form Card (Right) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
        <div className="w-full bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <MeeoLogo size="md" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] text-[11px] font-bold text-[#412ce7] dark:text-[#685aff]">
                <Gift className="w-3.5 h-3.5 text-[#fd6a49]" />
                <span>+200 Pts Bonus</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] dark:text-white tracking-tight mt-2">
              Create Account<span className="text-[#fd6a49]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#464556] dark:text-[#a6abbf]">
              Join the studio to unlock exclusive drops and tactile objects.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Milo Kapoor"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="milo.kapoor@studio.meeo"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                />
              </div>
            </div>

            {/* Mobile Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                Mobile Phone <span className="text-[11px] font-normal text-[#777588]">(For SMS &amp; Dispatch Tracking)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                />
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                Security Password
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
                  placeholder="Create a strong passphrase"
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

              {/* Live Strength Feedback */}
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Curation Preferences Tags */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                Primary Interests <span className="text-[11px] font-normal text-[#777588]">(For customized drop alerts)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((opt) => {
                  const isSelected = selectedInterests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleInterest(opt)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#412ce7] text-white shadow-2xs'
                          : 'bg-[#f2f3ff] dark:bg-[#182032] text-[#464556] dark:text-[#a6abbf] hover:bg-[#eaedff]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#412ce7] border-[#c7c4d9] focus:ring-[#412ce7] cursor-pointer"
                />
                <span className="text-[11px] text-[#464556] dark:text-[#a6abbf] leading-relaxed">
                  I agree to the{' '}
                  <Link href="#" className="underline font-bold text-[#131b2e] dark:text-white">
                    Collector Terms of Service
                  </Link>{' '}
                  and understand how Meeo protects personal identity data.
                </span>
              </label>
            </div>

            {/* Submit Register Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Create Studio Account
            </Button>
          </form>

          {/* Social Sign up */}
          <div className="mt-6">
            <SocialAuthButtons onSocialAuth={handleSocialAuth} isLoading={isSubmitting} />
          </div>

          {/* Login Navigation Link */}
          <div className="mt-6 pt-5 border-t border-[#e2e7ff] dark:border-[#28334d] text-center">
            <p className="text-xs text-[#464556] dark:text-[#a6abbf]">
              Already have a collector account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#412ce7] dark:text-[#685aff] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
