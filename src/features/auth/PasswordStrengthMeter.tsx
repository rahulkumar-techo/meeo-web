'use client';

import React from 'react';

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
    textColor = 'text-amber-600';
  } else if (score === 4) {
    label = 'Strong';
    color = 'bg-emerald-600';
    textColor = 'text-emerald-700';
  } else if (score === 5) {
    label = 'Optimal Security';
    color = 'bg-[#8C5338]';
    textColor = 'text-[#8C5338]';
  }

  return (
    <div className="flex flex-col gap-1.5 w-full mt-1.5">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-[#786C64]">Password Strength</span>
        <span className={textColor}>{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-[#EFEAE4] rounded-full overflow-hidden p-0.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= (step === 4 ? 4 : step) ? color : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
