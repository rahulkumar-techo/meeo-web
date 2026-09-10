'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RotateCw, MessageSquare, Smartphone, Mail, CheckCircle2 } from 'lucide-react';

interface ResendOtpTimerProps {
  initialSeconds?: number;
  destination: string;
  onResend: (channel: 'sms' | 'whatsapp' | 'email') => Promise<void>;
  isLoading?: boolean;
}

export const ResendOtpTimer: React.FC<ResendOtpTimerProps> = ({
  initialSeconds = 45,
  destination,
  onResend,
  isLoading = false,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'whatsapp' | 'email'>(
    destination.includes('@') ? 'email' : 'sms'
  );
  const [justResent, setJustResent] = useState<boolean>(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleTriggerResend = useCallback(
    async (channel: 'sms' | 'whatsapp' | 'email') => {
      if (secondsLeft > 0 || isLoading) return;
      try {
        setSelectedChannel(channel);
        await onResend(channel);
        setJustResent(true);
        setSecondsLeft(initialSeconds);
        setTimeout(() => setJustResent(false), 3000);
      } catch (e) {
        console.error('Failed to resend OTP', e);
      }
    },
    [secondsLeft, isLoading, onResend, initialSeconds]
  );

  const isEmail = destination.includes('@');

  return (
    <div className="flex flex-col items-center gap-3 w-full text-center">
      {justResent && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>New verification code dispatched!</span>
        </div>
      )}

      {secondsLeft > 0 ? (
        <p className="text-xs sm:text-sm text-[#777588] dark:text-[#a6abbf]">
          Didn&apos;t receive code? Resend in{' '}
          <span className="font-mono font-bold text-[#412ce7] dark:text-[#685aff]">
            00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
          </span>
        </p>
      ) : (
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-xs font-medium text-[#464556] dark:text-[#a6abbf]">
            Didn&apos;t receive the code? Select your preferred delivery method:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {!isEmail ? (
              <>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleTriggerResend('sms')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eaedff] dark:bg-[#1e273d] hover:bg-[#dae2fd] text-[#412ce7] dark:text-[#685aff] text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Resend via SMS</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleTriggerResend('whatsapp')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Resend on WhatsApp</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleTriggerResend('email')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#eaedff] dark:bg-[#1e273d] hover:bg-[#dae2fd] text-[#412ce7] dark:text-[#685aff] text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Resend to Email</span>
              </button>
            )}

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleTriggerResend(selectedChannel)}
              className="inline-flex items-center gap-1 p-1.5 rounded-xl text-[#777588] hover:text-[#131b2e] dark:hover:text-white transition-colors"
              title="Refresh / Quick Resend"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
