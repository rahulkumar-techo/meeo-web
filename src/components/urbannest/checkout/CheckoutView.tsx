'use client';

/**
 * @file CheckoutView.tsx
 * @description Main customer checkout coordination view integrating multi-stage steps,
 * auto-selected default address, order validation, price details timeline, and Razorpay modal.
 */

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { AppRoute } from '@/routes';
import { useCheckout } from '@/hooks/checkout/useCheckout';
import { CheckoutStepHeader } from './CheckoutStepHeader';
import { CheckoutAddressStep } from './CheckoutAddressStep';
import { CheckoutReviewStep } from './CheckoutReviewStep';
import { CheckoutPaymentStep } from './CheckoutPaymentStep';
import { CheckoutPriceTimeline } from './CheckoutPriceTimeline';
import { CheckoutSuccessView } from './CheckoutSuccessView';

export const CheckoutView: React.FC = () => {
  const {
    step,
    setStep,
    addresses,
    isLoadingAddresses,
    selectedAddressId,
    selectedAddress,
    isAddressAutoSelected,
    isAddingNewAddress,
    setIsAddingNewAddress,
    newAddress,
    setNewAddress,
    handleSelectAddress,
    handleCreateAddress,
    couponCode,
    setCouponCode,
    appliedCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    cartItems,
    validationData,
    isValidating,
    isProcessing,
    createdOrder,
    priceDetails,
    handlePlaceOrder,
  } = useCheckout();

  // If cart is empty and not on success step
  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-[#E8E2DA] p-8 sm:p-10 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#F5EBE6] text-[#8C5338] mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#2D2621] mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-[#786C64] mb-6">
            Looks like you haven&apos;t added any products to your shopping bag yet.
          </p>
          <Link
            href={AppRoute.CATEGORY}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Step Progress Timeline Header */}
        <CheckoutStepHeader
          currentStep={step}
          onSelectStep={(targetStep) => setStep(targetStep)}
        />

        {/* Step 4: Celebratory Confirmation View */}
        {step === 4 ? (
          <CheckoutSuccessView
            order={createdOrder}
            selectedAddress={selectedAddress}
          />
        ) : (
          /* Multi-Step Flow Layout: 2-Column Desktop Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Active Step Form */}
            <div className="lg:col-span-8 w-full">
              {/* STEP 1: Delivery Address */}
              {step === 1 && (
                <CheckoutAddressStep
                  addresses={addresses}
                  isLoading={isLoadingAddresses}
                  selectedAddressId={selectedAddressId}
                  isAddressAutoSelected={isAddressAutoSelected}
                  onSelectAddress={handleSelectAddress}
                  onProceed={() => setStep(2)}
                  isAddingNewAddress={isAddingNewAddress}
                  setIsAddingNewAddress={setIsAddingNewAddress}
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  onCreateAddress={handleCreateAddress}
                  isProcessing={isProcessing}
                />
              )}

              {/* STEP 2: Order Summary & Review */}
              {step === 2 && (
                <CheckoutReviewStep
                  items={cartItems}
                  selectedAddress={selectedAddress}
                  onBackToAddress={() => setStep(1)}
                  onProceedToPayment={() => setStep(3)}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  isValidatingCoupon={isValidating}
                  validationData={validationData}
                />
              )}

              {/* STEP 3: Payment Options (Razorpay vs COD) */}
              {step === 3 && (
                <CheckoutPaymentStep
                  paymentMethod={paymentMethod}
                  onSelectPaymentMethod={setPaymentMethod}
                  orderNotes={orderNotes}
                  onOrderNotesChange={setOrderNotes}
                  onBackToReview={() => setStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                  isProcessing={isProcessing}
                  grandTotal={priceDetails.grandTotal}
                />
              )}
            </div>

            {/* Right Column: Sticky Price Details Timeline */}
            <div className="lg:col-span-4 w-full">
              <CheckoutPriceTimeline
                itemCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
                subtotal={priceDetails.subtotal}
                discountTotal={priceDetails.discountTotal}
                couponDiscount={validationData?.coupon?.discountAmount || 0}
                couponCode={appliedCoupon}
                shippingFee={priceDetails.shippingFee}
                taxTotal={priceDetails.taxTotal}
                grandTotal={priceDetails.grandTotal}
                isValidating={isValidating}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
