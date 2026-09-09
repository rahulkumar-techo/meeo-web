'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';
import { CheckoutSteps } from '@/features/checkout/CheckoutSteps';
import { CheckoutOrderReview } from '@/features/checkout/CheckoutOrderReview';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';
import { useToast } from '@/context/ToastContext';
import { ShippingAddress, PaymentMethod } from '@/types/order';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [deliverySpeed, setDeliverySpeed] = useState<'priority' | 'standard'>('priority');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod['type']>('upi');
  const [upiId, setUpiId] = useState('milo.kapoor@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Milo Kapoor',
    streetAddress: 'Flat 402, Sovereign Residency, 12th Main Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    phone: '+91 98450 12345',
    isDefault: true,
  });

  const handleAddressChange = (field: keyof ShippingAddress, val: string) => {
    setAddress((prev) => ({ ...prev, [field]: val }));
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      addNotification({
        title: 'Order Confirmed: MEEO-89234',
        message: 'Your order has been serialized and dispatched via Air Priority.',
        type: 'order_update',
        link: '/orders/ord-9021',
      });
      showToast('Order MEEO-89234 placed successfully!');
      router.push('/orders/ord-9021');
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[80rem] mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#131b2e]">Your Bag is Empty</h2>
        <p className="text-xs text-[#464556] mt-1 mb-6">Add items to proceed to checkout.</p>
        <button
          onClick={() => router.push('/category')}
          className="px-6 py-2.5 bg-[#412ce7] text-white rounded-xl text-xs font-bold"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Checkout Top Bar */}
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-6">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted Checkout</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Order Fulfillment<span className="text-[#fd6a49]">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main Grid: Steps (7 cols) + Order Summary (5 cols) */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <CheckoutSteps
              currentStep={currentStep}
              onSetStep={setCurrentStep}
              address={address}
              onAddressChange={handleAddressChange}
              deliverySpeed={deliverySpeed}
              onDeliverySpeedChange={setDeliverySpeed}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              upiId={upiId}
              onUpiIdChange={setUpiId}
              cardNumber={cardNumber}
              onCardNumberChange={setCardNumber}
              cardExpiry={cardExpiry}
              onCardExpiryChange={setCardExpiry}
              cardCvv={cardCvv}
              onCardCvvChange={setCardCvv}
            />
          </div>

          <div className="lg:col-span-5">
            <CheckoutOrderReview
              items={items}
              summary={summary}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
