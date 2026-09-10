'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let label = 'Very Weak';
  let color = 'bg-red-500';
  let textColor = 'text-red-500';

  if (score <= 1) {
    label = 'Weak';
    color = 'bg-red-500';
    textColor = 'text-red-500';
  } else if (score === 2 || score === 3) {
    label = 'Moderate';
    color = 'bg-amber-500';
    textColor = 'text-amber-500';
  } else if (score === 4) {
    label = 'Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-500';
  } else if (score === 5) {
    label = 'Studio-Grade Security';
    color = 'bg-[#412ce7]';
    textColor = 'text-[#412ce7] dark:text-[#685aff]';
  }

  return (
    <div className="flex flex-col gap-1.5 w-full mt-1.5">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-[#777588] dark:text-[#a6abbf]">Password Strength</span>
        <span className={textColor}>{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-[#eaedff] dark:bg-[#1e273d] rounded-full overflow-hidden p-0.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= (step === 4 ? 4 : step) ? color : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-[#777588] dark:text-[#a6abbf]">
        <span className={`inline-flex items-center gap-1 ${hasLength ? 'text-emerald-600 font-semibold' : ''}`}>
          <Check className="w-3 h-3" /> 8+ chars
        </span>
        <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-semibold' : ''}`}>
          <Check className="w-3 h-3" /> number
        </span>
        <span className={`inline-flex items-center gap-1 ${hasUpper ? 'text-emerald-600 font-semibold' : ''}`}>
          <Check className="w-3 h-3" /> uppercase
        </span>
        <span className={`inline-flex items-center gap-1 ${hasSpecial ? 'text-emerald-600 font-semibold' : ''}`}>
          <Check className="w-3 h-3" /> symbol
        </span>
      </div>
    </div>
  );
};
