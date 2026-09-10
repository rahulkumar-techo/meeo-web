'use client';

import React from 'react';
import { Fingerprint } from 'lucide-react';

interface SocialAuthButtonsProps {
  onSocialAuth: (provider: 'google' | 'apple' | 'passkey') => void;
  isLoading?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSocialAuth,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-[#e2e7ff] dark:border-[#28334d] w-full" />
        <span className="bg-white dark:bg-[#131826] px-3 text-[11px] font-bold uppercase tracking-wider text-[#777588] dark:text-[#a6abbf] absolute">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-2">
        {/* Google */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSocialAuth('google')}
          className="flex items-center justify-center gap-2 h-11 px-3 rounded-2xl bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] hover:border-[#412ce7] hover:bg-white dark:hover:bg-[#1e273d] transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
          title="Sign in with Google"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-xs font-bold text-[#131b2e] dark:text-white hidden sm:inline">Google</span>
        </button>

        {/* Apple */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSocialAuth('apple')}
          className="flex items-center justify-center gap-2 h-11 px-3 rounded-2xl bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] hover:border-[#412ce7] hover:bg-white dark:hover:bg-[#1e273d] transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
          title="Sign in with Apple"
        >
          <svg className="w-4 h-4 fill-current text-black dark:text-white" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.97-12.04-14.67-6.19-9.54-10.9-20.2-14.13-31.99-3.23-11.79-4.85-22.95-4.85-33.49 0-14.77 3.75-26.68 11.24-35.73 7.49-9.05 16.71-13.68 27.67-13.88 4.12 0 8.86 1.05 14.23 3.17 5.37 2.12 9.05 3.29 11.05 3.49 1.58-.2 5.46-1.42 11.64-3.67 6.18-2.24 11.17-3.24 14.97-3 13.9.79 24.58 6.08 32.06 15.86-12.28 7.4-18.31 17.5-18.1 30.3.21 9.99 4.09 18.25 11.64 24.78 4.12 3.6 8.86 6.18 14.23 7.73-2.64 7.64-5.69 15.02-9.15 22.14zM119.22 33.64c0-7.35 2.65-14.3 7.94-20.85 5.29-6.55 11.83-10.84 19.61-12.79.42 1.48.63 2.96.63 4.44 0 7.4-2.8 14.45-8.41 21.16-5.6 6.72-12.23 10.9-19.88 12.54-.11-1.48-.17-2.96-.17-4.5z" />
          </svg>
          <span className="text-xs font-bold text-[#131b2e] dark:text-white hidden sm:inline">Apple</span>
        </button>

        {/* Passkey */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSocialAuth('passkey')}
          className="flex items-center justify-center gap-1.5 h-11 px-3 rounded-2xl bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] hover:border-[#412ce7] hover:bg-white dark:hover:bg-[#1e273d] transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
          title="Sign in with Passkey / Biometrics"
        >
          <Fingerprint className="w-4 h-4 text-[#412ce7] dark:text-[#685aff]" />
          <span className="text-xs font-bold text-[#131b2e] dark:text-white hidden sm:inline">Passkey</span>
        </button>
      </div>
    </div>
  );
};
