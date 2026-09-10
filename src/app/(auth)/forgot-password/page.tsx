'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft, ArrowRight, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MeeoLogo } from '@/components/ui/MeeoLogo';
import { Button } from '@/components/ui/Button';
import { AuthVisualSide } from '@/features/auth/AuthVisualSide';
import { useSendOtpMutation } from '@/hooks/useAuthMutations';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const sendOtpMutation = useSendOtpMutation();

  const [destination, setDestination] = useState<string>('');
  const [method, setMethod] = useState<'otp' | 'email_link'>('otp');
  const [isMagicLinkPending, setIsMagicLinkPending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccessLinkSent, setIsSuccessLinkSent] = useState<boolean>(false);

  const isSubmitting = sendOtpMutation.isPending || isMagicLinkPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!destination.trim()) {
      setErrorMsg('Please provide your registered email or phone number');
      return;
    }

    if (method === 'otp') {
      sendOtpMutation.mutate(
        {
          destination: destination.trim(),
          type: 'forgot_password',
        },
        {
          onSuccess: (res) => {
            showToast(res.message || 'Password reset verification code dispatched!');
            router.push(
              `/verify-otp?mode=forgot_password&dest=${encodeURIComponent(destination.trim())}`
            );
          },
          onError: (err) => {
            setErrorMsg(err.message || 'Could not process request. Please try again.');
            showToast(err.message, 'error');
          },
        }
      );
    } else {
      setIsMagicLinkPending(true);
      setTimeout(() => {
        setIsMagicLinkPending(false);
        setIsSuccessLinkSent(true);
        showToast('Recovery link sent to your email inbox');
      }, 800);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Visual Side Banner (Left) */}
      <div className="lg:col-span-6 xl:col-span-7 flex">
        <AuthVisualSide
          heading="Secure Account &amp; Vault Recovery Protocol."
          subheading="We prioritize your privacy and asset security. Follow the two-factor authentication recovery steps to securely reset your credentials and restore studio access."
          badge="Security Recovery"
        />
      </div>

      {/* Forgot Password Card (Right) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
        <div className="w-full bg-white dark:bg-[#131826] rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] dark:border-[#28334d] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <MeeoLogo size="md" />
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] dark:bg-[#1e273d] flex items-center justify-center text-[#412ce7] dark:text-[#685aff]">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] dark:text-white tracking-tight mt-2">
              Forgot Password<span className="text-[#fd6a49]">?</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#464556] dark:text-[#a6abbf]">
              No worries. Enter your registered email or phone to reset your access passphrase.
            </p>
          </div>

          {/* Success State for Direct Email Link */}
          {isSuccessLinkSent ? (
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#131b2e] dark:text-white mb-1">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs text-[#464556] dark:text-[#a6abbf] mb-6">
                We have sent an authentication recovery link to{' '}
                <span className="font-bold text-[#131b2e] dark:text-white">{destination}</span>. Check
                your inbox and follow the secure link.
              </p>

              <div className="flex flex-col gap-2 w-full">
                <Button
                  variant="primary"
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Return to Sign In
                </Button>
                <button
                  type="button"
                  onClick={() => setIsSuccessLinkSent(false)}
                  className="text-xs text-[#777588] hover:text-[#412ce7] font-semibold py-1 cursor-pointer"
                >
                  Use a different email / phone
                </button>
              </div>
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
                {/* Method selector */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f2f3ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] mb-1">
                  <button
                    type="button"
                    onClick={() => setMethod('otp')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      method === 'otp'
                        ? 'bg-white dark:bg-[#26314c] text-[#412ce7] dark:text-white shadow-xs'
                        : 'text-[#464556] dark:text-[#a6abbf] hover:text-[#131b2e]'
                    }`}
                  >
                    <span>Receive 6-Digit OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('email_link')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      method === 'email_link'
                        ? 'bg-white dark:bg-[#26314c] text-[#412ce7] dark:text-white shadow-xs'
                        : 'text-[#464556] dark:text-[#a6abbf] hover:text-[#131b2e]'
                    }`}
                  >
                    <span>Email Magic Link</span>
                  </button>
                </div>

                {/* Destination Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#131b2e] dark:text-[#eef0ff]">
                    {method === 'otp' ? 'Registered Email or Mobile Number' : 'Registered Email Address'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777588]">
                      {destination.includes('@') || method === 'email_link' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                    </div>
                    <input
                      type={method === 'email_link' ? 'email' : 'text'}
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder={
                        method === 'email_link'
                          ? 'milo.kapoor@studio.meeo'
                          : 'name@studio.meeo or +91 98450...'
                      }
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#182032] text-[#131b2e] dark:text-white text-sm focus:border-[#412ce7] focus:ring-2 focus:ring-[#412ce7]/20 outline-none transition-all placeholder:text-[#777588]/60"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full mt-2"
                >
                  {method === 'otp' ? 'Send 6-Digit OTP Code' : 'Send Recovery Magic Link'}
                </Button>
              </form>
            </>
          )}

          {/* Return to Login */}
          <div className="mt-6 pt-5 border-t border-[#e2e7ff] dark:border-[#28334d] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#464556] dark:text-[#a6abbf] hover:text-[#412ce7] dark:hover:text-[#685aff] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Remember your password? Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
