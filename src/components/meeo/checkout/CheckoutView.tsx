'use client';

/**
 * @file CheckoutView.tsx
 * @description Main customer checkout coordination view integrating multi-stage steps,
 * auto-selected default address, order validation, price details timeline, and Razorpay modal.
 */

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Truck } from 'lucide-react';
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
    paymentFailed,
    paymentError,
    isRetryingPayment,
    handleRetryPayment,
    priceDetails,
    freeShippingThreshold,
    handlePlaceOrder,
  } = useCheckout();

  // If cart is empty and not on success step (Flipkart-style restricted checkout)
  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full mx-auto text-center bg-white rounded-3xl border border-[#E8E2DA] p-8 sm:p-12 shadow-sm">
          {/* Flipkart-style empty illustration container */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full bg-[#FAF4F0] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#8C5338] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              0
            </div>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#FAF4F0] text-[#8C5338] text-[11px] font-bold uppercase tracking-wider mb-3">
            Checkout Restricted
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2621] mb-2">
            Missing Cart items?
          </h2>

          <p className="text-sm text-[#786C64] mb-8 max-w-sm mx-auto leading-relaxed">
            Your cart is currently empty. Add items to your cart to proceed with checkout. Checkout and order placement are disabled until items are added.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={AppRoute.CATEGORY}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={AppRoute.WISHLIST}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#EFEAE4] border border-[#E8E2DA] text-[#2D2621] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>View Wishlist</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E2DA] flex items-center justify-center gap-6 text-[11px] text-[#786C64]">
            <span>✓ 100% Genuine Items</span>
            <span>✓ Safe & Secure</span>
            <span>✓ Easy Returns</span>
          </div>
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

        {/* Free Delivery Banner on Checkout */}
        {step !== 4 && priceDetails.subtotal > 0 && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E8E2DA] shadow-xs flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8C5338] shrink-0" />
              {priceDetails.subtotal >= freeShippingThreshold ? (
                <span className="font-bold text-[#2E6F40]">
                  ✓ Free Delivery Unlocked for this order!
                </span>
              ) : (
                <span className="font-semibold text-[#2D2621]">
                  Add <strong className="text-[#8C5338]">₹{(freeShippingThreshold - priceDetails.subtotal).toLocaleString('en-IN')}</strong> more to get FREE Delivery!
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-[#786C64]">
              Threshold: ₹{freeShippingThreshold.toLocaleString('en-IN')}
            </span>
          </div>
        )}

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
                  paymentFailed={paymentFailed}
                  paymentError={paymentError}
                  isRetryingPayment={isRetryingPayment}
                  onRetryPayment={handleRetryPayment}
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
