'use client';

import React from 'react';
import { QrCode, CreditCard, Landmark, Clock, Banknote, ShieldCheck, LucideIcon } from 'lucide-react';
import { PaymentMethod } from '@/types/order';

interface PaymentGatewaySelectorProps {
  selectedMethod: PaymentMethod['type'];
  onSelectMethod: (method: PaymentMethod['type']) => void;
  upiId: string;
  onUpiIdChange: (v: string) => void;
  cardNumber: string;
  onCardNumberChange: (v: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (v: string) => void;
  cardCvv: string;
  onCardCvvChange: (v: string) => void;
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
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvv,
  onCardCvvChange,
}) => {
  const paymentMethods: PaymentOption[] = [
    {
      id: 'upi',
      title: 'Instant UPI / QR',
      subtitle: 'Google Pay, PhonePe, Paytm, CRED & Any UPI App',
      icon: QrCode,
      badge: 'Fastest',
    },
    {
      id: 'card',
      title: 'Credit or Debit Card',
      subtitle: 'Visa, Mastercard, RuPay, Amex & International Cards',
      icon: CreditCard,
    },
    {
      id: 'netbanking',
      title: 'NetBanking',
      subtitle: 'HDFC, ICICI, SBI, Axis, Kotak & 50+ Indian Banks',
      icon: Landmark,
    },
    {
      id: 'emi',
      title: 'Cardless EMI / PayLater',
      subtitle: 'Split into 3 or 6 monthly installments with 0% interest',
      icon: Clock,
    },
    {
      id: 'cash_on_delivery',
      title: 'Cash on Air Delivery',
      subtitle: 'Pay cash or scan QR at your doorstep',
      icon: Banknote,
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
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs'
                  : 'border-[#e2e7ff] bg-white hover:border-[#c7c4d9]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#412ce7] text-white'
                        : 'bg-[#f2f3ff] text-[#464556]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#131b2e]">{method.title}</h4>
                      {method.badge && (
                        <span className="px-2 py-0.5 rounded bg-[#dcfce7] text-[#15803d] text-[10px] font-bold uppercase">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#464556] mt-0.5">{method.subtitle}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#412ce7]' : 'border-[#c7c4d9]'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#412ce7]" />}
                </div>
              </div>

              {/* Dynamic Nested Inputs based on Selection */}
              {isSelected && method.id === 'upi' && (
                <div className="mt-4 pt-4 border-t border-[#e2e7ff] flex flex-col gap-3 animate-in fade-in duration-200">
                  <label className="text-xs font-bold uppercase text-[#777588]">
                    Enter your UPI ID (VPA)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => onUpiIdChange(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="flex-1 h-10 px-3 bg-white border border-[#c7c4d9] rounded-xl text-xs outline-none focus:border-[#412ce7]"
                    />
                    <button
                      type="button"
                      className="px-4 bg-[#412ce7] text-white rounded-xl text-xs font-bold"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {isSelected && method.id === 'card' && (
                <div className="mt-4 pt-4 border-t border-[#e2e7ff] flex flex-col gap-3 animate-in fade-in duration-200">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#777588] block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => onCardNumberChange(e.target.value)}
                      placeholder="4532 •••• •••• 4018"
                      className="w-full h-10 px-3 bg-white border border-[#c7c4d9] rounded-xl text-xs outline-none focus:border-[#412ce7]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-[#777588] block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => onCardExpiryChange(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full h-10 px-3 bg-white border border-[#c7c4d9] rounded-xl text-xs outline-none focus:border-[#412ce7]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-[#777588] block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => onCardCvvChange(e.target.value)}
                        placeholder="•••"
                        className="w-full h-10 px-3 bg-white border border-[#c7c4d9] rounded-xl text-xs outline-none focus:border-[#412ce7]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] flex items-center gap-2.5 text-xs text-[#464556]">
        <ShieldCheck className="w-4 h-4 text-[#412ce7] shrink-0" />
        <span>End-to-end RBI-compliant tokenization &amp; instant refund protection.</span>
      </div>
    </div>
  );
};
