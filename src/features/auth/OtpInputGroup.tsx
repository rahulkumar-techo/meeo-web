'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputGroupProps {
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
}

export const OtpInputGroup: React.FC<OtpInputGroupProps> = ({
  value,
  onChange,
  onComplete,
  length = 4,
  disabled = false,
  error = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (!value && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      const updated = digits.slice();
      updated[index] = '';
      const newOtp = updated.join('');
      onChange(newOtp);
      return;
    }

    const char = rawVal[rawVal.length - 1];
    const updated = [...digits];
    updated[index] = char;
    const newOtp = updated.join('');
    onChange(newOtp);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.length === length) {
      onComplete?.(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const updated = [...digits];
        updated[index - 1] = '';
        onChange(updated.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    onChange(pasteData);
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasteData.length === length) {
      onComplete?.(pasteData);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-xs mx-auto">
      {digits.map((digit, idx) => {
        const isFilled = Boolean(digit);
        return (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border transition-all outline-none ${
              error
                ? 'border-red-500 bg-red-50/50 text-red-600 ring-2 ring-red-500/20'
                : isFilled
                ? 'border-[#8C5338] bg-[#EFEAE4] text-[#2D2621] shadow-2xs'
                : 'border-[#E8E2DA] bg-[#FAF8F5] text-[#2D2621] focus:border-[#8C5338] focus:ring-2 focus:ring-[#8C5338]/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={`Digit ${idx + 1}`}
          />
        );
      })}
    </div>
  );
};
