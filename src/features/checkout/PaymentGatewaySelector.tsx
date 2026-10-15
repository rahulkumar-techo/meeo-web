'use client';

import React from 'react';
import { QrCode, Landmark, ShieldCheck, LucideIcon, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '@/types/order';

interface PaymentGatewaySelectorProps {
  selectedMethod: PaymentMethod['type'];
  onSelectMethod: (method: PaymentMethod['type']) => void;
  upiId: string;
  onUpiIdChange: (v: string) => void;
  cardNumber?: string;
  onCardNumberChange?: (v: string) => void;
  cardExpiry?: string;
  onCardExpiryChange?: (v: string) => void;
  cardCvv?: string;
  onCardCvvChange?: (v: string) => void;
}

interface PaymentOption {
  id: PaymentMethod['type'];
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
}

export const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  upiId,
  onUpiIdChange,
}) => {
  const paymentMethods: PaymentOption[] = [
    {
      id: 'upi',
      title: 'Instant UPI / QR (Razorpay)',
      subtitle: 'Google Pay, PhonePe, Paytm, CRED & Any UPI App / QR Code',
      icon: QrCode,
      badge: 'Recommended',
    },
    {
      id: 'netbanking',
      title: 'NetBanking (Razorpay)',
      subtitle: 'HDFC, ICICI, SBI, Axis, Kotak & 50+ Indian Banks with instant debit',
      icon: Landmark,
      badge: 'All Banks',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#412ce7] bg-[#eaedff]/40 dark:bg-[#1e273d]/60 shadow-xs ring-1 ring-[#412ce7]/20'
                  : 'border-[#e2e7ff] dark:border-[#28334d] bg-white dark:bg-[#131826] hover:border-[#c7c4d9]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#412ce7] text-white shadow-xs'
                        : 'bg-[#f2f3ff] dark:bg-[#1e273d] text-[#464556] dark:text-[#a6abbf]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#131b2e] dark:text-white">
                        {method.title}
                      </h4>
                      {method.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#464556] dark:text-[#a6abbf] mt-0.5">
                      {method.subtitle}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#412ce7] bg-[#412ce7]' : 'border-[#c7c4d9] dark:border-[#4a5578]'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Dynamic Sub-Inputs for UPI */}
              {isSelected && method.id === 'upi' && (
                <div className="mt-4 pt-4 border-t border-[#e2e7ff] dark:border-[#28334d] flex flex-col gap-2.5 animate-in fade-in duration-200">
                  <label className="text-xs font-bold uppercase text-[#777588] dark:text-[#a6abbf]">
                    UPI ID / VPA (Optional - or scan QR in Razorpay):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => onUpiIdChange(e.target.value)}
                      placeholder="milo.kapoor@okhdfcbank"
                      className="flex-1 h-10 px-3.5 bg-white dark:bg-[#131826] border border-[#c7c4d9] dark:border-[#28334d] rounded-xl text-xs text-[#131b2e] dark:text-white outline-none focus:border-[#412ce7]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpiIdChange('success@razorpay');
                      }}
                      className="px-3.5 bg-[#eaedff] dark:bg-[#1e273d] text-[#412ce7] dark:text-[#685aff] hover:bg-[#dae2fd] rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Fill Test UPI
                    </button>
                  </div>
                  <span className="text-[11px] text-[#777588] dark:text-[#a6abbf]">
                    💡 In Razorpay test mode, use <strong className="text-[#412ce7] dark:text-[#685aff]">success@razorpay</strong> for instant successful verification.
                  </span>
                </div>
              )}

              {/* NetBanking Bank Selection Helper */}
              {isSelected && method.id === 'netbanking' && (
                <div className="mt-4 pt-4 border-t border-[#e2e7ff] dark:border-[#28334d] flex flex-col gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Popular Banks Supported (HDFC, ICICI, SBI, Axis, Kotak)</span>
                  </div>
                  <p className="text-[11px] text-[#777588] dark:text-[#a6abbf]">
                    Razorpay NetBanking test simulator will allow instant one-click approval on checkout.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-[#faf8ff] dark:bg-[#182032] border border-[#e2e7ff] dark:border-[#28334d] flex items-center gap-2.5 text-xs text-[#464556] dark:text-[#a6abbf]">
        <ShieldCheck className="w-4 h-4 text-[#412ce7] dark:text-[#685aff] shrink-0" />
        <span>Secured by Razorpay PCI-DSS Level 1 &amp; RBI Tokenization Vault.</span>
      </div>
    </div>
  );
};
