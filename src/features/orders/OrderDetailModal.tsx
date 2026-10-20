'use client';

/**
 * @file OrderDetailModal.tsx
 * @description Modal showing full order details, address snapshot, line items, and audit status history.
 */

import React, { useState } from 'react';
import {
  X,
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  Receipt,
  RotateCcw,
  CheckCircle2,
  Truck,
  Ban,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrderByIdQuery, useCancelOrderMutation } from '@/hooks/order/useOrder';
import { useOrderRealtime } from '@/hooks/order/useOrderRealtime';
import { AppRoute } from '@/routes';
import type { OrderStatus } from '@/types/order/order.types';

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

function OrderItemModalImage({ src, alt }: { src?: string | null; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="relative w-14 h-14 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-center text-[#A09383] shrink-0">
        <Package className="w-5 h-5 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <div className="relative w-14 h-14 rounded-xl bg-white border border-[#E8E2DA] overflow-hidden p-1 shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="56px"
        className="object-contain p-1"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const { data, isLoading, error } = useOrderByIdQuery(orderId);
  const cancelMutation = useCancelOrderMutation();

  // Real-time WebSocket hook for instant order updates
  useOrderRealtime(orderId);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Customer requested cancellation before shipment');
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!isOpen) return null;

  const order = data?.data;

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
    if (!orderId) return;
    setCancelError(null);

    try {
      await cancelMutation.mutateAsync({
        id: orderId,
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
  const currencySymbol = (order?.financials?.currency || order?.currency) === 'USD' ? '$' : '₹';
  const subtotal = order?.financials?.subtotal ?? order?.subtotal ?? 0;
  const discountTotal = order?.financials?.discountTotal ?? order?.discountTotal ?? order?.discountAmount ?? 0;
  const shippingTotal = order?.financials?.shippingTotal ?? order?.shippingTotal ?? order?.shippingFee ?? 0;
  const taxTotal = order?.financials?.taxTotal ?? order?.taxTotal ?? order?.taxAmount ?? 0;
  const grandTotal = order?.financials?.grandTotal ?? order?.grandTotal ?? order?.totalAmount ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E8E2DA] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E8E2DA] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3EFEA] border border-[#E8E2DA] flex items-center justify-center text-[#8C5338]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#2D2621]">
                {order ? `Order #${order.orderNumber}` : 'Order Details'}
              </h3>
              <p className="text-xs text-[#786C64]">
                {order?.createdAt
                  ? `Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : 'Retrieving order snapshot...'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#E8E2DA] text-[#786C64] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#786C64]">Loading order details...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              Failed to load order details. Please verify that this order belongs to your account.
            </div>
          )}

          {order && (
            <>
              {/* Order Status & Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA]">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{order.status}</span>
                  </span>
                  {order.paymentStatus && (
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                        order.paymentStatus === 'PAID' || order.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-[#2E6F40] border-emerald-200 font-bold'
                          : order.paymentMethod === 'COD'
                          ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold'
                          : 'bg-white text-[#786C64] border-[#E8E2DA]'
                      }`}
                    >
                      Payment:{' '}
                      {order.status === 'DELIVERED' || order.paymentStatus === 'PAID'
                        ? 'Paid'
                        : order.paymentMethod === 'COD'
                        ? 'To be collected on delivery'
                        : order.paymentStatus}
                    </span>
                  )}
                </div>

                {isCancellable && (
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>

              {/* Cancel Confirmation Box */}
              {showCancelConfirm && (
                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-red-800 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Confirm Order Cancellation</span>
                  </div>
                  <p className="text-xs text-red-700">
                    Cancelling this order will release all reserved inventory items back to warehouse stock.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-red-900 block">
                      Cancellation Reason:
                    </label>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Why do you wish to cancel this order?"
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
                      className="px-3 py-1.5 text-xs font-bold text-[#786C64] hover:bg-red-100/50 rounded-lg transition-colors cursor-pointer"
                    >
                      Nevermind
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      disabled={cancelMutation.isPending}
                      className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      {cancelMutation.isPending ? 'Processing...' : 'Confirm Cancellation'}
                    </button>
                  </div>
                </div>
              )}

              {/* Order Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  Ordered Items ({order.items?.length || 0})
                </h4>

                <div className="divide-y divide-[#E8E2DA] border border-[#E8E2DA] rounded-2xl overflow-hidden bg-white">
                  {order.items?.map((item: any) => {
                    const itemImg =
                      item.thumbnailUrl ||
                      item.image ||
                      item.imageUrl ||
                      item.variantSnapshot?.thumbnail ||
                      null;
                    const itemName =
                      item.productName || item.title || item.name || 'Product Item';
                    const itemQty = Number(item.quantity ?? item.qty ?? 1);
                    const itemPrice = Number(item.unitPrice ?? item.price ?? 0);
                    const itemTotal = Number(item.total ?? item.totalPrice ?? itemPrice * itemQty);
                    const variantAttributes = Array.isArray(item.variantSnapshot?.attributes)
                      ? item.variantSnapshot.attributes
                          .map((a: any) => `${a.attribute ? `${a.attribute}: ` : ''}${a.value}`)
                          .join(', ')
                      : item.variantTitle || '';

                    return (
                      <div key={item.id} className="p-3.5 sm:p-4 flex items-center gap-4 text-xs">
                        <OrderItemModalImage src={itemImg} alt={itemName} />

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#2D2621] truncate">
                            {itemName}
                          </div>
                          <div className="text-[11px] text-[#786C64] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            {item.sku && <span>SKU: {item.sku}</span>}
                            {variantAttributes && (
                              <span className="inline-block bg-[#F3EFEA] text-[#786C64] px-1.5 py-0.5 rounded text-[10px] font-medium">
                                {variantAttributes}
                              </span>
                            )}
                            <span>• Qty: {itemQty} × {currencySymbol}{itemPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="font-bold text-[#2D2621] text-sm shrink-0 text-right">
                          <div>
                            {currencySymbol}
                            {itemTotal.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-[#786C64]">Tax Included</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address Snapshot */}
              {(order.address || order.shippingAddress) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                    Delivery Destination
                  </h4>
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
              )}

              {/* Price Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  Order Financial Breakdown
                </h4>
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2DA] space-y-2 text-xs">
                  <div className="flex justify-between text-[#786C64]">
                    <span>Items Subtotal</span>
                    <span>
                      {currencySymbol}
                      {subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountTotal > 0 ? (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount Savings</span>
                      <span>
                        -{currencySymbol}
                        {discountTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-[#786C64]">
                    <span>Shipping Total</span>
                    <span>
                      {shippingTotal === 0
                        ? 'FREE'
                        : `${currencySymbol}${shippingTotal.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#786C64]">
                    <span>Sales Taxes</span>
                    <span>
                      {currencySymbol}
                      {taxTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E8E2DA] flex justify-between font-bold text-sm text-[#2D2621]">
                    <span>Grand Total</span>
                    <span>
                      {currencySymbol}
                      {grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit Status History */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#786C64]">
                    Audit Status History
                  </h4>
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA] space-y-3">
                    {order.statusHistory.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-[#8C5338] mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#2D2621]">
                            {item.newStatus || item.status}
                            {item.previousStatus && (
                              <span className="text-[#786C64] font-normal ml-1">
                                (from {item.previousStatus})
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
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8E2DA] bg-[#FAF8F5] flex items-center justify-between">
          {order?.orderNumber ? (
            <Link
              href={AppRoute.ORDER_TRACK(order.orderNumber)}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#E8E2DA] hover:bg-[#FAF8F5] text-[#2D2621] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#8C5338]" />
              <span>Track Live Parcel</span>
            </Link>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D2621] hover:bg-[#433A33] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
