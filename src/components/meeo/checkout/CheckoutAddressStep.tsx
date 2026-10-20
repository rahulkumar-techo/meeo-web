'use client';

/**
 * @file CheckoutAddressStep.tsx
 * @description Step 1 of Checkout: Selects or adds shipping address.
 * Automatically selects default shipping address and supports 1-click proceed/skip.
 */

import React from 'react';
import {
  MapPin,
  Plus,
  CheckCircle2,
  Building,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { SavedAddress, CreateAddressPayload } from '@/types/user/user.types';

interface CheckoutAddressStepProps {
  addresses: SavedAddress[];
  isLoading: boolean;
  selectedAddressId: string;
  isAddressAutoSelected: boolean;
  onSelectAddress: (id: string) => void;
  onProceed: () => void;
  isAddingNewAddress: boolean;
  setIsAddingNewAddress: (val: boolean) => void;
  newAddress: CreateAddressPayload;
  setNewAddress: React.Dispatch<React.SetStateAction<CreateAddressPayload>>;
  onCreateAddress: (e: React.FormEvent) => Promise<void>;
  isProcessing: boolean;
}

export const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
  addresses,
  isLoading,
  selectedAddressId,
  isAddressAutoSelected,
  onSelectAddress,
  onProceed,
  isAddingNewAddress,
  setIsAddingNewAddress,
  newAddress,
  setNewAddress,
  onCreateAddress,
  isProcessing,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Auto-Select Banner (If default address was automatically selected) */}
      {isAddressAutoSelected && selectedAddressId && (
        <div className="p-4 rounded-2xl bg-[#F5EBE6] border border-[#8C5338]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#8C5338] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2D2621]">
                Default address automatically selected
              </h4>
              <p className="text-[11px] text-[#786C64]">
                Proceed to order review or choose a different address below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onProceed}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
          >
            <span>Skip to Order Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Saved Addresses List */}
      <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-7 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2DA] mb-5">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#8C5338]" />
            <h3 className="text-base font-bold text-[#2D2621]">
              Select Delivery Address
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
            className="text-xs font-semibold text-[#8C5338] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNewAddress ? 'Cancel' : 'Add New Address'}</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-xs text-[#786C64]">
            <div className="w-7 h-7 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin mb-3" />
            <span>Loading your delivery addresses...</span>
          </div>
        ) : addresses.length === 0 && !isAddingNewAddress ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-xs text-[#786C64]">
              No saved addresses found. Please add a shipping destination to continue.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setNewAddress({
                    recipientName: 'Rahul Kumar',
                    phone: '9876543210',
                    addressLine1: 'Flat 402, Lotus Residency, MG Road',
                    addressLine2: 'Near Metro Station',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    postalCode: '560001',
                    country: 'India',
                    isDefaultShipping: true,
                  });
                  setIsAddingNewAddress(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-[#8C5338] text-[#8C5338] hover:bg-[#F5EBE6] text-xs font-bold transition-all cursor-pointer"
              >
                ⚡ Use Sample Address
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNewAddress(true)}
                className="px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                + Add Delivery Address
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {addresses.map((addr) => {
              const isSelected = addr.id === selectedAddressId;

              return (
                <div
                  key={addr.id}
                  onClick={() => onSelectAddress(addr.id)}
                  className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-[#8C5338] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#E8E2DA] bg-white hover:border-[#8C5338]/40 hover:bg-[#FAF8F5]/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="mt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#8C5338] bg-[#8C5338]'
                            : 'border-[#786C64] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#2D2621]">
                          {addr.recipientName}
                        </span>
                        {addr.isDefaultShipping && (
                          <span className="text-[10px] font-bold text-[#8C5338] bg-[#F5EBE6] px-2 py-0.5 rounded-full">
                            Default Address
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#786C64] leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''},{' '}
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#786C64] pt-0.5">
                        <Phone className="w-3 h-3 text-[#8C5338]" />
                        <span>{addr.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deliver Here Button */}
                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProceed();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Deliver to this Address</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Address Form Modal/Section */}
      {isAddingNewAddress && (
        <form
          onSubmit={onCreateAddress}
          className="bg-white rounded-2xl border border-[#E8E2DA] p-5 sm:p-7 shadow-2xs space-y-5 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
            <h4 className="text-sm font-bold text-[#2D2621] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#8C5338]" />
              <span>Add New Delivery Destination</span>
            </h4>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setNewAddress({
                    recipientName: 'Rahul Kumar',
                    phone: '9876543210',
                    addressLine1: 'Flat 402, Lotus Residency, MG Road',
                    addressLine2: 'Near Metro Station',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    postalCode: '560001',
                    country: 'India',
                    isDefaultShipping: true,
                  });
                }}
                className="text-xs font-semibold text-[#8C5338] hover:underline cursor-pointer"
              >
                ⚡ Use Sample Address
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNewAddress(false)}
                className="text-xs text-[#786C64] hover:text-[#2D2621] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newAddress.recipientName}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, recipientName: e.target.value }))
                }
                placeholder="e.g. Rahul Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                Mobile Phone *
              </label>
              <input
                type="tel"
                required
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                Street Address / Flat / Building *
              </label>
              <input
                type="text"
                required
                value={newAddress.addressLine1}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, addressLine1: e.target.value }))
                }
                placeholder="Flat / House No., Apartment, Street"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                Landmark / Area (Optional)
              </label>
              <input
                type="text"
                value={newAddress.addressLine2 || ''}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, addressLine2: e.target.value }))
                }
                placeholder="Near Metro Station, Sector, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Bengaluru"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                State *
              </label>
              <input
                type="text"
                required
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, state: e.target.value }))
                }
                placeholder="Karnataka"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={newAddress.postalCode}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                }
                placeholder="560001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] focus:border-[#8C5338] text-xs text-[#2D2621] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#786C64] mb-1.5">
                Country
              </label>
              <input
                type="text"
                disabled
                value="India"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#786C64] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-[#2D2621] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(newAddress.isDefaultShipping)}
                onChange={(e) =>
                  setNewAddress((prev) => ({ ...prev, isDefaultShipping: e.target.checked }))
                }
                className="accent-[#8C5338]"
              />
              <span>Set as default delivery address</span>
            </label>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Saving...' : 'Save & Select Address'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
