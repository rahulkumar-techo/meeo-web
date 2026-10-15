'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  X,
  CreditCard as CardIcon,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { useUserStore } from '@/store/user.store';
import { authService } from '@/services/auth/authService';
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/hooks/user/useAddress';
import { useUpdateProfileMutation } from '@/hooks/user/useUser';
import { useToast } from '@/context/ToastContext';
import { OrdersTab } from '@/features/account/OrdersTab';
import { AccountSettings } from '@/features/account/AccountSettings';
import { AppRoute } from '@/routes';
import type { CreateAddressPayload, SavedAddress } from '@/types/user/user.types';

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'payments' | 'profile' | 'settings'>('orders');
  const { user, isAuthenticated, logout } = useUserStore();
  const { showToast } = useToast();

  useEffect(() => {
    if (tabParam && ['orders', 'addresses', 'payments', 'profile', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Profile Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const updateProfileMutation = useUpdateProfileMutation();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to update your profile.', 'info');
      router.push(AppRoute.AUTH.LOGIN_WITH_REDIRECT(AppRoute.ACCOUNT));
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await updateProfileMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      showToast('Profile information updated successfully.', 'success');
    } catch {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Addresses State & Mutations
  const { data: serverAddresses = [], isLoading: addressesLoading } = useAddressesQuery();
  const createAddressMutation = useCreateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<CreateAddressPayload>({
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefaultShipping: false,
    addressType: 'SHIPPING',
  });

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to save an address.', 'info');
      router.push(AppRoute.AUTH.LOGIN_WITH_REDIRECT(AppRoute.ACCOUNT));
      return;
    }

    if (!addressForm.recipientName || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city || !addressForm.postalCode) {
      showToast('Please fill out all required address fields.', 'error');
      return;
    }

    try {
      await createAddressMutation.mutateAsync(addressForm);
      showToast('Delivery address added successfully.', 'success');
      setIsAddAddressOpen(false);
      setAddressForm({
        recipientName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefaultShipping: false,
        addressType: 'SHIPPING',
      });
    } catch {
      showToast('Failed to save address. Please try again.', 'error');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddressMutation.mutateAsync(addressId);
      showToast('Address removed successfully.', 'success');
    } catch {
      showToast('Could not delete address.', 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await updateAddressMutation.mutateAsync({
        addressId,
        payload: { isDefaultShipping: true },
      });
      showToast('Default delivery address updated.', 'success');
    } catch {
      showToast('Could not update default address.', 'error');
    }
  };

  // Logout Handler
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
    } catch {
      // Local logout fallback
    } finally {
      logout();
      setIsLoggingOut(false);
      showToast('Logged out successfully.', 'success');
      router.push(AppRoute.HOME);
    }
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
    : 'Guest Explorer';
  const displayEmail = user?.email || 'Sign in to access your orders, saved addresses, and profile';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'UN';

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#786C64] mb-4">
          <Link href="/" className="hover:text-[#2D2621] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#2D2621] font-semibold">Account</span>
        </nav>

        {/* User Hero Banner */}
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 mb-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#EFEAE4] border border-[#E5DFD7] flex items-center justify-center text-[#8C5338] font-serif text-2xl font-bold">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2621]">
                    {displayName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8C5338]/10 text-[#8C5338] text-[10px] font-bold uppercase tracking-wider">
                    {isAuthenticated ? 'Member' : 'Guest'}
                  </span>
                </div>
                <p className="text-xs text-[#786C64] mt-0.5">
                  {displayEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href={AppRoute.AUTH.LOGIN_WITH_REDIRECT(AppRoute.ACCOUNT)}
                  className="px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Sign In to Account
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Account Layout (Sidebar Tabs + Tab Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#E8E2DA] p-3 shadow-2xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#8C5338]" />
                <span>Orders</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#8C5338]" />
                <span>Saved Addresses</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#8C5338]" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#8C5338]" />
                <span>Profile Details</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#EFEAE4] text-[#2D2621] font-bold'
                  : 'text-[#786C64] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-[#8C5338]" />
                <span>Settings &amp; Theme</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#786C64]" />
            </button>

            {isAuthenticated && (
              <div className="pt-2 mt-2 border-t border-[#E8E2DA]">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <LogOut className="w-4 h-4 text-red-600" />
                    )}
                    <span>Log Out</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </div>
            )}
          </aside>

          {/* Tab Content Area */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && <OrdersTab />}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2DA] pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                      Delivery Addresses
                    </h2>
                    <p className="text-xs text-[#786C64] mt-0.5">
                      Manage your saved doorstep delivery destinations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-4 py-2 rounded-full bg-[#8C5338] text-white text-xs font-semibold hover:bg-[#72422C] transition-colors cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Add New Address Modal/Inline Form */}
                {isAddAddressOpen && (
                  <form onSubmit={handleCreateAddress} className="p-5 rounded-2xl border border-[#8C5338]/30 bg-[#FAF8F5] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8E2DA]">
                      <h3 className="text-sm font-bold text-[#2D2621]">New Delivery Address</h3>
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="text-[#786C64] hover:text-[#2D2621] p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#786C64] mb-1">Recipient Name *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.recipientName}
                          onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                          placeholder="e.g. Rahul Kumar"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-white text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#786C64] mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-white text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#786C64] mb-1">Street Address / Flat / Building *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.addressLine1}
                          onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                          placeholder="House No., Street Name, Area"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-white text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#786C64] mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="e.g. Bengaluru"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-white text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#786C64] mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          placeholder="e.g. Karnataka"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-white text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#786C64] mb-1">PIN / Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          placeholder="560038"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-white text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#786C64] mb-1">Country</label>
                        <input
                          type="text"
                          disabled
                          value="India"
                          className="w-full px-3 py-2 rounded-xl border border-[#E8E2DA] bg-gray-100 text-xs text-[#786C64]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="defaultShipping"
                        checked={addressForm.isDefaultShipping}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefaultShipping: e.target.checked })}
                        className="w-4 h-4 accent-[#8C5338] rounded cursor-pointer"
                      />
                      <label htmlFor="defaultShipping" className="text-xs text-[#2D2621] cursor-pointer">
                        Set as primary default shipping address
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="px-4 py-2 rounded-xl border border-[#E8E2DA] text-xs font-semibold text-[#786C64] hover:bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createAddressMutation.isPending}
                        className="px-5 py-2 rounded-xl bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-semibold flex items-center gap-2"
                      >
                        {createAddressMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save Address</span>
                      </button>
                    </div>
                  </form>
                )}

                {addressesLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-[#786C64]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#8C5338] mb-2" />
                    <span className="text-xs">Loading saved addresses...</span>
                  </div>
                ) : serverAddresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serverAddresses.map((addr: SavedAddress) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          addr.isDefaultShipping
                            ? 'border-[#8C5338] bg-[#FAF8F5]'
                            : 'border-[#E8E2DA] bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#8C5338] uppercase tracking-wider">
                            {addr.addressType || 'Delivery'}
                          </span>
                          {addr.isDefaultShipping && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8C5338] text-white">
                              Default
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#2D2621]">{addr.recipientName}</h3>
                        <p className="text-xs text-[#786C64] mt-1 leading-relaxed">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} – {addr.postalCode}
                        </p>
                        <p className="text-xs text-[#2D2621] font-medium mt-2">
                          Phone: {addr.phone}
                        </p>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8E2DA] text-xs">
                          {!addr.isDefaultShipping ? (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[#8C5338] hover:underline font-semibold cursor-pointer"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#786C64] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Primary Destination
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-600 hover:text-red-700 font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-[#E8E2DA] bg-[#FAF8F5]">
                    <MapPin className="w-8 h-8 text-[#8C5338] mx-auto mb-2 opacity-60" />
                    <h3 className="text-sm font-bold text-[#2D2621]">No saved addresses yet</h3>
                    <p className="text-xs text-[#786C64] mt-1 max-w-sm mx-auto">
                      Add your preferred delivery address for rapid, one-click checkout.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(true)}
                      className="mt-4 px-4 py-2 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-semibold cursor-pointer"
                    >
                      Add Address Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="border-b border-[#E8E2DA] pb-4">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                    Payment Methods &amp; Gateways
                  </h2>
                  <p className="text-xs text-[#786C64] mt-0.5">
                    Secure transaction options supported during checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-[#E8E2DA] bg-[#FAF8F5] flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2D2621]">Cash on Delivery</div>
                        <div className="text-[11px] text-[#786C64]">Doorstep Payment</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md self-start">
                      Active for verified orders
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#E8E2DA] bg-[#FAF8F5] flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2D2621]">UPI &amp; QR Codes</div>
                        <div className="text-[11px] text-[#786C64]">GPay, PhonePe, Paytm</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#8C5338] bg-[#8C5338]/10 px-2 py-0.5 rounded-md self-start">
                      Instant Settlement
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#E8E2DA] bg-[#FAF8F5] flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
                        <CardIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2D2621]">Cards &amp; NetBanking</div>
                        <div className="text-[11px] text-[#786C64]">Visa, MC, RuPay</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md self-start">
                      PCI-DSS Compliant
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[#E8E2DA] bg-white flex items-center gap-3 text-xs text-[#786C64]">
                  <ShieldCheck className="w-5 h-5 text-[#8C5338] shrink-0" />
                  <span>
                    All payment processing happens over end-to-end 256-bit encrypted channels. Card numbers are never stored in plain text.
                  </span>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="border-b border-[#E8E2DA] pb-4">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
                    Account Profile
                  </h2>
                  <p className="text-xs text-[#786C64] mt-0.5">
                    Update personal profile details and contact information.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#786C64]">Email Address</label>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-gray-100 text-xs text-[#786C64] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#786C64] mb-1.5">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2DA] bg-[#FAF8F5] text-xs text-[#2D2621] focus:outline-none focus:border-[#8C5338]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E2DA]">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-2.5 rounded-full bg-[#8C5338] hover:bg-[#72422C] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {isUpdatingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* SETTINGS & APPEARANCE TAB */}
            {activeTab === 'settings' && <AccountSettings />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#FAF8F5] py-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#8C5338]" />
        </div>
      }
    >
      <AccountPageContent />
    </React.Suspense>
  );
}
