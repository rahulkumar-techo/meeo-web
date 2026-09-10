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
  length = 6,
  disabled = false,
  error = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of characters
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    // Auto focus first input on mount if empty
    if (!value && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      // Empty / cleared
      const updated = digits.slice();
      updated[index] = '';
      const newOtp = updated.join('');
      onChange(newOtp);
      return;
    }

    // Single digit input
    const char = rawVal[rawVal.length - 1];
    const updated = [...digits];
    updated[index] = char;
    const newOtp = updated.join('');
    onChange(newOtp);

    // Auto advance focus to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all digits filled, fire onComplete
    if (newOtp.length === length) {
      onComplete?.(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move backward and clear
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
    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full max-w-sm mx-auto">
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
            disabled={disabled}
            value={digit}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border transition-all duration-200 outline-none
              ${
                error
                  ? 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-950/20 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900/40'
                  : isFilled
                  ? 'border-[#412ce7] bg-[#eaedff]/30 dark:bg-[#1e273d] text-[#131b2e] dark:text-white shadow-xs font-mono'
                  : 'border-[#c7c4d9] dark:border-[#28334d] bg-white dark:bg-[#131826] text-[#131b2e] dark:text-white hover:border-[#777588]'
              }
              focus:border-[#412ce7] focus:ring-4 focus:ring-[#412ce7]/20 focus:bg-white dark:focus:bg-[#182032]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label={`Digit ${idx + 1}`}
          />
        );
      })}
    </div>
  );
};
