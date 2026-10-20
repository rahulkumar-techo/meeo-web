'use client';

/**
 * @file CheckoutStepHeader.tsx
 * @description Multi-step progress timeline for checkout adhering to Meeo theme.
 */

import React from 'react';
import { MapPin, ShoppingBag, CreditCard, Check } from 'lucide-react';
import type { CheckoutStep } from '@/hooks/checkout/useCheckout';

interface CheckoutStepHeaderProps {
  currentStep: CheckoutStep;
  onSelectStep: (step: CheckoutStep) => void;
}

export const CheckoutStepHeader: React.FC<CheckoutStepHeaderProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const steps = [
    { num: 1 as CheckoutStep, label: 'Delivery Address', icon: MapPin },
    { num: 2 as CheckoutStep, label: 'Order Summary', icon: ShoppingBag },
    { num: 3 as CheckoutStep, label: 'Payment Method', icon: CreditCard },
  ];

  if (currentStep === 4) return null; // Hide in success state

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E8E2DA] p-4 sm:p-5 shadow-2xs mb-6 sm:mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const isClickable = currentStep > step.num;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.num}>
              {/* Step Pill */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelectStep(step.num)}
                className={`flex items-center gap-2.5 sm:gap-3 transition-all ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                    isDone
                      ? 'bg-[#2E6F40] text-white'
                      : isCurrent
                      ? 'bg-[#8C5338] text-white ring-4 ring-[#8C5338]/15'
                      : 'bg-[#F3EFEA] text-[#786C64]'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>

                <div className="flex flex-col text-left">
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'text-[#8C5338]'
                        : isDone
                        ? 'text-[#2D2621]'
                        : 'text-[#786C64]'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[#786C64] hidden sm:block">
                    {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </span>
                </div>
              </button>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 sm:mx-4 transition-colors ${
                    currentStep > step.num ? 'bg-[#2E6F40]' : 'bg-[#E8E2DA]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
