'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface SocialAuthButtonsProps {
  onGoogleSuccess?: (idToken: string) => void;
  onGoogleError?: () => void;
  onSocialAuth?: (provider: 'google' | 'apple' | 'passkey') => void;
  isLoading?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGoogleSuccess,
  onGoogleError,
  onSocialAuth,
  isLoading = false,
}) => {
  const { showToast } = useToast();
  const [unavailableNotice, setUnavailableNotice] = useState<string | null>(null);

  const handleUnavailableService = (serviceName: string) => {
    const notice = 'This service is not available at this moment. Please sign in with Email or Google.';
    setUnavailableNotice(`${serviceName}: ${notice}`);
    showToast(notice, 'info');

    // Auto-clear banner after 5 seconds
    setTimeout(() => {
      setUnavailableNotice(null);
    }, 5000);
  };

  const handleGoogleSuccessResponse = (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      if (onGoogleSuccess) {
        onGoogleSuccess(credentialResponse.credential);
      } else if (onSocialAuth) {
        onSocialAuth('google');
      }
    } else {
      showToast('Google ID token was not received. Please try again.', 'error');
    }
  };

  const handleGoogleErrorResponse = () => {
    showToast('Google sign-in could not be completed.', 'error');
    if (onGoogleError) {
      onGoogleError();
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-[#E8E2DA] w-full" />
        <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#786C64] absolute">
          Or continue with
        </span>
      </div>

      {/* Unavailable service inline alert if clicked */}
      {unavailableNotice && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] text-[#786C64] text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 text-[#8C5338] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-[#2D2621] block mb-0.5">Service Unavailable</span>
            <span>{unavailableNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setUnavailableNotice(null)}
            className="text-[#786C64] hover:text-[#2D2621] text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Official Google Identity Button */}
      <div className="w-full flex justify-center py-1">
        <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!max-w-none">
          <GoogleLogin
            onSuccess={handleGoogleSuccessResponse}
            onError={handleGoogleErrorResponse}
            theme="outline"
            size="large"
            shape="pill"
            text="continue_with"
            width="100%"
          />
        </div>
      </div>

      {/* Alternative Social Logins: Apple & Passkey (Currently Unavailable) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Apple Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleUnavailableService('Apple Sign-In')}
          className="flex items-center justify-center gap-2 h-11 px-3 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] hover:border-[#8C5338] hover:bg-white transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs group"
          title="Apple Sign-In (Unavailable)"
        >
          <svg className="w-4 h-4 fill-[#2D2621]" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.77-8.91-10.33-19.12-13.68-30.63-3.35-11.51-5.03-22.36-5.03-32.55 0-14.56 3.63-26.65 10.9-36.27 7.27-9.62 16.48-14.53 27.63-14.75 4.9.11 10.15 1.34 15.77 3.69 5.61 2.35 9.4 3.63 11.36 3.84 2.17-.33 6.08-1.74 11.74-4.24 5.65-2.5 10.86-3.64 15.64-3.42 12.39.87 22.38 5.65 29.98 14.34-10.87 6.63-16.2 15.86-16 27.7.22 9.35 3.8 17.16 10.75 23.46 6.95 6.3 15.21 9.99 24.77 11.08-2.07 6.3-4.58 12.6-7.53 18.91zM119.22 31.84c0-7.39 2.61-14.34 7.82-20.86 5.22-6.52 11.73-10.43 19.55-11.74.87 7.06-1.52 14.02-7.17 20.86-5.65 6.85-12.39 10.75-20.2 11.74z" />
          </svg>
          <span className="text-xs font-semibold text-[#2D2621]">Apple</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EFEAE4] text-[#8C5338] font-medium hidden sm:inline">
            Unavailable
          </span>
        </button>

        {/* Passkey Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleUnavailableService('Passkey / Face ID')}
          className="flex items-center justify-center gap-2 h-11 px-3 rounded-full bg-[#FAF8F5] border border-[#E8E2DA] hover:border-[#8C5338] hover:bg-white transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs group"
          title="Passkey Authentication (Unavailable)"
        >
          <Fingerprint className="w-4 h-4 text-[#8C5338]" />
          <span className="text-xs font-semibold text-[#2D2621]">Passkey</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EFEAE4] text-[#8C5338] font-medium hidden sm:inline">
            Unavailable
          </span>
        </button>
      </div>
    </div>
  );
};
