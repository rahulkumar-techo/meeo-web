'use client';

import React from 'react';
import { MapPin, Truck, CreditCard, Check } from 'lucide-react';
import { ShippingAddress, PaymentMethod } from '@/types/order';
import { PaymentGatewaySelector } from './PaymentGatewaySelector';

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3;
  onSetStep: (step: 1 | 2 | 3) => void;
  address: ShippingAddress;
  onAddressChange: (field: keyof ShippingAddress, val: string) => void;
  deliverySpeed: 'priority' | 'standard';
  onDeliverySpeedChange: (speed: 'priority' | 'standard') => void;
  paymentMethod: PaymentMethod['type'];
  onPaymentMethodChange: (pm: PaymentMethod['type']) => void;
  upiId: string;
  onUpiIdChange: (v: string) => void;
  cardNumber: string;
  onCardNumberChange: (v: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (v: string) => void;
  cardCvv: string;
  onCardCvvChange: (v: string) => void;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep,
  onSetStep,
  address,
  onAddressChange,
  deliverySpeed,
  onDeliverySpeedChange,
  paymentMethod,
  onPaymentMethodChange,
  upiId,
  onUpiIdChange,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvv,
  onCardCvvChange,
}) => {
  const steps = [
    { num: 1, label: 'Delivery Address', icon: MapPin },
    { num: 2, label: 'Logistics Speed', icon: Truck },
    { num: 3, label: 'Payment Gateway', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Progress Tabs */}
      <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-4">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const Icon = step.icon;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => onSetStep(step.num as 1 | 2 | 3)}
              className={`flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all ${
                isCurrent
                  ? 'text-[#412ce7]'
                  : isDone
                  ? 'text-[#131b2e]'
                  : 'text-[#777588]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'bg-[#412ce7] text-white shadow-xs'
                    : isDone
                    ? 'bg-green-600 text-white'
                    : 'bg-[#eaedff] text-[#777588]'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span className="hidden sm:inline-block">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Shipping Address */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
            <h3 className="text-base font-bold text-[#131b2e]">Shipping Destination</h3>
            <span className="text-xs text-[#412ce7] font-semibold">Saved Indiranagar Studio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-[#777588] block mb-1">Full Recipient Name</label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => onAddressChange('fullName', e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm outline-none focus:border-[#412ce7]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-[#777588] block mb-1">Street Address / Suite</label>
              <input
                type="text"
                value={address.streetAddress}
                onChange={(e) => onAddressChange('streetAddress', e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm outline-none focus:border-[#412ce7]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#777588] block mb-1">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => onAddressChange('city', e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm outline-none focus:border-[#412ce7]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#777588] block mb-1">Postal Code (PIN)</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => onAddressChange('postalCode', e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm outline-none focus:border-[#412ce7]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#777588] block mb-1">State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => onAddressChange('state', e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm outline-none focus:border-[#412ce7]"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#777588] block mb-1">Phone Number for Courier</label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => onAddressChange('phone', e.target.value)}
                className="w-full h-11 px-3.5 bg-[#faf8ff] border border-[#c7c4d9] rounded-xl text-sm outline-none focus:border-[#412ce7]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSetStep(2)}
            className="w-full sm:w-auto self-end px-6 py-3 bg-[#412ce7] hover:bg-[#5b4dff] text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            Continue to Logistics →
          </button>
        </div>
      )}

      {/* Step 2: Logistics Speed */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-[#131b2e] pb-3 border-b border-[#e2e7ff]">
            Select Delivery Method
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => onDeliverySpeedChange('priority')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                deliverySpeed === 'priority'
                  ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs'
                  : 'border-[#e2e7ff] hover:border-[#c7c4d9]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#412ce7]">Recommended</span>
                  <span className="text-xs font-bold text-green-600">FREE</span>
                </div>
                <h4 className="text-sm font-bold text-[#131b2e]">BlueDart Air Priority Express</h4>
                <p className="text-xs text-[#464556] mt-1">Delivers today by 6:00 PM with zero-plastic packaging.</p>
              </div>
            </div>

            <div
              onClick={() => onDeliverySpeedChange('standard')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                deliverySpeed === 'standard'
                  ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs'
                  : 'border-[#e2e7ff] hover:border-[#c7c4d9]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-[#777588]">Ground</span>
                  <span className="text-xs font-bold text-green-600">FREE</span>
                </div>
                <h4 className="text-sm font-bold text-[#131b2e]">Delhivery Surface Standard</h4>
                <p className="text-xs text-[#464556] mt-1">Estimated delivery in 2-3 business days.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => onSetStep(1)}
              className="text-xs text-[#464556] font-bold hover:underline"
            >
              ← Back to Address
            </button>
            <button
              type="button"
              onClick={() => onSetStep(3)}
              className="px-6 py-3 bg-[#412ce7] hover:bg-[#5b4dff] text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Continue to Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Gateway Selector */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-[#131b2e] pb-3 border-b border-[#e2e7ff]">
            Payment Authorization
          </h3>

          <PaymentGatewaySelector
            selectedMethod={paymentMethod}
            onSelectMethod={onPaymentMethodChange}
            upiId={upiId}
            onUpiIdChange={onUpiIdChange}
            cardNumber={cardNumber}
            onCardNumberChange={onCardNumberChange}
            cardExpiry={cardExpiry}
            onCardExpiryChange={onCardExpiryChange}
            cardCvv={cardCvv}
            onCardCvvChange={onCardCvvChange}
          />

          <div className="flex justify-start pt-2">
            <button
              type="button"
              onClick={() => onSetStep(2)}
              className="text-xs text-[#464556] font-bold hover:underline"
            >
              ← Back to Logistics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
