'use client';

/**
 * @file page.tsx (orders/[id])
 * @description Dedicated order details page retrieving by UUID or human order number with address snapshot, status timeline, and self-service cancellation.
 */

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Receipt,
  AlertTriangle,
} from 'lucide-react';
import { useOrderByIdQuery, useOrderByNumberQuery, useCancelOrderMutation } from '@/hooks/order/useOrder';
import { AppRoute } from '@/routes';
import type { OrderStatus } from '@/types/order/order.types';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderPageProps) {
  const resolvedParams = use(params);
  const identifier = decodeURIComponent(resolvedParams.id || '');

  const isOrderNumber = identifier.startsWith('ORD-') || !identifier.includes('-');

  const idQuery = useOrderByIdQuery(!isOrderNumber ? identifier : '');
  const numberQuery = useOrderByNumberQuery(isOrderNumber ? identifier : '');

  const query = isOrderNumber ? numberQuery : idQuery;
  const { data, isLoading, error } = query;
  const order = data?.data;

  const cancelMutation = useCancelOrderMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Customer requested cancellation before shipment');
  const [cancelError, setCancelError] = useState<string | null>(null);

  const getStatusBadge = (status?: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        };
      case 'SHIPPED':
        return {
          icon: Truck,
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
        };
      case 'CONFIRMED':
      case 'PROCESSING':
        return {
          icon: Package,
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
        };
      case 'CANCELLED':
        return {
          icon: Ban,
          bg: 'bg-red-50 border-red-200 text-red-800',
        };
      default:
        return {
          icon: Clock,
          bg: 'bg-zinc-50 border-zinc-200 text-zinc-800',
        };
    }
  };

  const isCancellable =
    order &&
    ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);

  const handleCancelOrder = async () => {
    if (!order?.id) return;
    setCancelError(null);

    try {
      await cancelMutation.mutateAsync({
        id: order.id,
        payload: {
          reason: cancelReason.trim() || 'Customer requested cancellation before shipment',
        },
      });
      setShowCancelConfirm(false);
    } catch (err: any) {
      setCancelError(
        err?.response?.data?.message || err?.message || 'Failed to cancel order'
      );
    }
  };

  const badge = getStatusBadge(order?.status);
  const StatusIcon = badge.icon;
  const currencySymbol = order?.currency === 'USD' ? '$' : '₹';

  return (
    <div className="w-full min-h-[70vh] bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={AppRoute.ACCOUNT}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#786C64] hover:text-[#2D2621] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account Orders</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#786C64]">Retrieving order record...</p>
          </div>
        )}

        {/* Error / Not Found State */}
        {error && (
          <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D2621]">Order not found</h3>
              <p className="text-xs text-[#786C64] mt-1">
                Unable to locate order &quot;{identifier}&quot;. Please verify the order reference or check that you are signed in with the purchasing account.
              </p>
            </div>
            <Link
              href={AppRoute.ACCOUNT}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C5338] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Return to Account
            </Link>
          </div>
        )}

        {/* Order Content */}
        {order && (
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2DA]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F3EFEA] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-serif font-bold text-[#2D2621]">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-xs text-[#786C64]">
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${badge.bg}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{order.status}</span>
                </span>

                {isCancellable && (
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-4 py-1.5 rounded-full border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cancel Box */}
            {showCancelConfirm && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-red-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Confirm Order Cancellation</span>
                </div>
                <p className="text-xs text-red-700">
                  Cancelling this order will release all active inventory reservations back to warehouse stock.
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-red-900 block">
                    Cancellation Reason:
                  </label>
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter reason for cancellation"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-red-200 text-[#2D2621] focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {cancelError && (
                  <p className="text-[11px] text-red-600 font-semibold">{cancelError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelMutation.isPending}
                    className="px-3 py-1.5 text-xs font-bold text-[#786C64] hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Nevermind
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelMutation.isPending}
                    className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    {cancelMutation.isPending ? 'Processing...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </div>
            )}

            {/* Line Items */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                Purchased Items ({order.items?.length || 0})
              </h2>

              <div className="divide-y divide-[#E8E2DA] border border-[#E8E2DA] rounded-2xl overflow-hidden bg-white">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#2D2621]">
                        {item.productName || item.title || 'Product'}
                      </div>
                      <div className="text-[11px] text-[#786C64] mt-0.5">
                        {item.sku ? `SKU: ${item.sku} • ` : ''}Quantity: {item.quantity} × {currencySymbol}
                        {(item.unitPrice || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="font-bold text-sm text-[#2D2621] shrink-0">
                      {currencySymbol}
                      {(item.totalPrice || item.unitPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Financials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  Shipping Destination
                </h3>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA] text-xs space-y-1">
                  <div className="font-bold text-[#2D2621]">
                    {order.address?.recipientName || order.shippingAddress?.recipientName}
                    {(order.address?.phone || order.shippingAddress?.phone) && (
                      <span className="text-[#786C64] font-normal ml-2">
                        ({order.address?.phone || order.shippingAddress?.phone})
                      </span>
                    )}
                  </div>
                  <div className="text-[#786C64]">
                    {order.address?.addressLine1 || order.shippingAddress?.addressLine1}
                    {(order.address?.addressLine2 || order.shippingAddress?.addressLine2) &&
                      `, ${order.address?.addressLine2 || order.shippingAddress?.addressLine2}`}
                  </div>
                  <div className="text-[#786C64]">
                    {[
                      order.address?.city || order.shippingAddress?.city,
                      order.address?.state || order.shippingAddress?.state,
                      order.address?.postalCode || order.shippingAddress?.postalCode,
                      order.address?.country || order.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
              </div>

              {/* Order Financials */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  Payment Summary
                </h3>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2DA] space-y-2 text-xs">
                  <div className="flex justify-between text-[#786C64]">
                    <span>Subtotal</span>
                    <span>
                      {currencySymbol}
                      {(order.subtotal || 0).toLocaleString()}
                    </span>
                  </div>

                  {(order.discountTotal || order.discountAmount) ? (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>
                        -{currencySymbol}
                        {(order.discountTotal || order.discountAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-[#786C64]">
                    <span>Shipping Total</span>
                    <span>
                      {(order.shippingTotal || order.shippingFee || 0) === 0
                        ? 'FREE'
                        : `${currencySymbol}${(order.shippingTotal || order.shippingFee || 0).toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#786C64]">
                    <span>Sales Tax</span>
                    <span>
                      {currencySymbol}
                      {(order.taxTotal || order.taxAmount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E8E2DA] flex justify-between font-bold text-sm text-[#2D2621]">
                    <span>Grand Total</span>
                    <span>
                      {currencySymbol}
                      {(order.grandTotal || order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Audit History Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E8E2DA]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  Order Status Audit History
                </h3>
                <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA]">
                  {order.statusHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8C5338] mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#2D2621]">
                          {item.newStatus || item.status}
                          {item.previousStatus && (
                            <span className="text-[#786C64] font-normal ml-1">
                              (transitioned from {item.previousStatus})
                            </span>
                          )}
                        </div>
                        {(item.reason || item.note) && (
                          <p className="text-[11px] text-[#786C64] mt-0.5">
                            {item.reason || item.note}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-[#786C64] shrink-0">
                        {item.createdAt || item.timestamp
                          ? new Date(item.createdAt || item.timestamp!).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )
                          : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
