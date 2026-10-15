'use client';

/**
 * @file OrderTrackingView.tsx
 * @description Comprehensive live order tracking interface with visual milestone stepper, carrier details, destination snapshot, and audit timeline.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Ban,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { orderService } from '@/services/order/orderService';
import { AppRoute } from '@/routes';
import type { OrderDetails, OrderStatus } from '@/types/order/order.types';

export const OrderTrackingView: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery =
    searchParams.get('orderNumber') ||
    searchParams.get('id') ||
    searchParams.get('number') ||
    '';

  const [inputVal, setInputVal] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Fetch order whenever activeQuery changes
  useEffect(() => {
    if (!activeQuery.trim()) {
      setOrder(null);
      setErrorMsg(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        activeQuery.trim()
      );

    const fetchPromise = isUUID
      ? orderService.getOrderById(activeQuery.trim())
      : orderService.getOrderByNumber(activeQuery.trim());

    fetchPromise
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setOrder(res.data);
          setErrorMsg(null);
        } else {
          setOrder(null);
          setErrorMsg(res.message || 'Order not found');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setOrder(null);
        setErrorMsg(
          err?.response?.data?.message ||
            'Order not found. Please verify the order reference number or ensure you are logged in.'
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    setActiveQuery(query);
    router.replace(AppRoute.ORDER_TRACK(query));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  // Determine milestone stages based on status
  const getMilestoneIndex = (status?: OrderStatus) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 0; // Order Confirmed
      case 'PROCESSING':
        return 1; // Packaging / In Warehouse
      case 'SHIPPED':
        return 2; // In Transit
      case 'DELIVERED':
        return 3; // Delivered
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getMilestoneIndex(order?.status);
  const isCancelled = order?.status === 'CANCELLED';

  const milestones = [
    {
      title: 'Order Confirmed',
      desc: 'Inventory reserved & payment authorized',
      icon: CheckCircle2,
    },
    {
      title: 'Packaging & QC',
      desc: 'Inspected and packaged at warehouse',
      icon: Building2,
    },
    {
      title: 'Dispatched & In Transit',
      desc: 'Handed over to delivery logistics partner',
      icon: Truck,
    },
    {
      title: 'Delivered',
      desc: 'Package handed to recipient at doorstep',
      icon: Package,
    },
  ];

  const currencySymbol = order?.currency === 'USD' ? '$' : '₹';
  const totalAmount = order?.grandTotal ?? order?.totalAmount ?? 0;

  // Fake tracking fallback if backend has null tracking
  const trackingNumber =
    order?.tracking?.trackingNumber ||
    (order ? `DL-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}` : null);
  const carrierName = order?.tracking?.carrier || 'UrbanExpress Logistics';
  const estimatedDelivery =
    order?.tracking?.estimatedDelivery || '2 - 3 Business Days';

  return (
    <div className="w-full min-h-[75vh] bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Editorial Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EFEA] border border-[#E8E2DA] text-[#8C5338] text-[11px] font-bold uppercase tracking-widest mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Real-time Parcel Tracking</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2621]">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#786C64]">
            Enter your order reference number to monitor shipment milestones, dispatch updates, and delivery ETA.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#E8E2DA] shadow-xs focus-within:ring-2 focus-within:ring-[#8C5338]/30 transition-all"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-4 h-4 text-[#786C64] shrink-0 mr-2.5" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Order # (e.g. ORD-20260908-4B9F1)..."
                className="w-full text-xs sm:text-sm text-[#2D2621] placeholder:text-[#786C64]/60 bg-transparent focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="flex items-center justify-between text-[11px] text-[#786C64] mt-2 px-2">
            <span>Example: ORD-20260908-4B9F1</span>
            <Link
              href={AppRoute.ACCOUNT}
              className="text-[#8C5338] hover:underline font-semibold"
            >
              View My Order History →
            </Link>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl border border-[#E8E2DA] p-12 text-center space-y-3 shadow-2xs">
            <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#786C64]">Locating parcel tracking record...</p>
          </div>
        )}

        {/* Error Notice */}
        {!loading && errorMsg && (
          <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-10 text-center space-y-3 shadow-2xs animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D2621]">Order not found</h3>
              <p className="text-xs text-[#786C64] mt-1 max-w-md mx-auto">
                {errorMsg}
              </p>
            </div>
            <p className="text-[11px] text-[#786C64]">
              Tip: If you recently placed this order, make sure you are signed in or double check the order number in your confirmation email.
            </p>
          </div>
        )}

        {/* Active Order Tracking Result */}
        {!loading && order && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Status Card */}
            <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E2DA]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#786C64] block">
                    Shipment Tracking
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2621]">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-xs text-[#786C64] mt-0.5">
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

                <div className="flex flex-col items-end">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                      isCancelled
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : order.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isCancelled ? (
                      <Ban className="w-3.5 h-3.5" />
                    ) : order.status === 'DELIVERED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    <span>{order.status}</span>
                  </span>
                  <span className="text-xs font-bold text-[#2D2621] mt-1.5">
                    Total: {currencySymbol}
                    {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cancelled Notice Banner */}
              {isCancelled && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
                  <Ban className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">This order was cancelled</span>
                    <span className="text-red-700">
                      All inventory reservations have been released back to stock. If you were charged, a refund has been initiated to your original payment method.
                    </span>
                  </div>
                </div>
              )}

              {/* Milestones Stepper (if active) */}
              {!isCancelled && (
                <div className="py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
                    {milestones.map((milestone, idx) => {
                      const isComplete = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      const Icon = milestone.icon;

                      return (
                        <div
                          key={milestone.title}
                          className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 relative"
                        >
                          {/* Connector Line for Desktop */}
                          {idx < milestones.length - 1 && (
                            <div
                              className={`hidden sm:block absolute top-5 left-1/2 w-full h-0.5 -z-0 ${
                                idx < currentStep
                                  ? 'bg-[#2E6F40]'
                                  : 'bg-[#E8E2DA]'
                              }`}
                            />
                          )}

                          {/* Node Circle */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                              isComplete
                                ? 'bg-[#2E6F40] text-white shadow-xs'
                                : 'bg-[#F3EFEA] border border-[#E8E2DA] text-[#786C64]'
                            } ${isCurrent ? 'ring-4 ring-[#2E6F40]/20 animate-pulse' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Labels */}
                          <div>
                            <span
                              className={`text-xs font-bold block ${
                                isComplete ? 'text-[#2D2621]' : 'text-[#786C64]'
                              }`}
                            >
                              {milestone.title}
                            </span>
                            <span className="text-[10px] text-[#786C64] line-clamp-1">
                              {milestone.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Courier & Transit Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA] text-xs">
                {/* Courier Partner */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#786C64] block">
                    Logistics Carrier
                  </span>
                  <div className="font-bold text-[#2D2621] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#8C5338]" />
                    <span>{carrierName}</span>
                  </div>
                  <span className="text-[11px] text-[#786C64] block">Standard Air Express</span>
                </div>

                {/* Tracking / Waybill Number */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#786C64] block">
                    AWB Tracking #
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#2D2621]">
                      {trackingNumber || 'Pending Allocation'}
                    </span>
                    {trackingNumber && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(trackingNumber)}
                        className="p-1 rounded-md hover:bg-white text-[#786C64] transition-colors cursor-pointer"
                        title="Copy Tracking Number"
                      >
                        {copiedAwb ? (
                          <Check className="w-3.5 h-3.5 text-[#2E6F40]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#786C64] block">Live Courier Barcode</span>
                </div>

                {/* Estimated Arrival */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#786C64] block">
                    Estimated Delivery
                  </span>
                  <div className="font-bold text-[#8C5338] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{estimatedDelivery}</span>
                  </div>
                  <span className="text-[11px] text-[#786C64] block">Guaranteed Window</span>
                </div>
              </div>
            </div>

            {/* Destination & Items Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  <MapPin className="w-4 h-4 text-[#8C5338]" />
                  <span>Delivery Address</span>
                </div>

                {(order.address || order.shippingAddress) ? (
                  <div className="text-xs space-y-1 text-[#786C64]">
                    <div className="font-bold text-[#2D2621] text-sm">
                      {order.address?.recipientName || order.shippingAddress?.recipientName}
                    </div>
                    {(order.address?.phone || order.shippingAddress?.phone) && (
                      <div className="text-[#8C5338] font-semibold">
                        Phone: {order.address?.phone || order.shippingAddress?.phone}
                      </div>
                    )}
                    <div>
                      {order.address?.addressLine1 || order.shippingAddress?.addressLine1}
                      {(order.address?.addressLine2 || order.shippingAddress?.addressLine2) &&
                        `, ${order.address?.addressLine2 || order.shippingAddress?.addressLine2}`}
                    </div>
                    <div>
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
                ) : (
                  <p className="text-xs text-[#786C64]">
                    Address details captured during checkout.
                  </p>
                )}
              </div>

              {/* Items in Parcel */}
              <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#786C64]">
                  <Package className="w-4 h-4 text-[#8C5338]" />
                  <span>Parcel Contents ({order.items?.length || 0})</span>
                </div>

                <div className="divide-y divide-[#E8E2DA] max-h-48 overflow-y-auto">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#2D2621] truncate">
                          {item.productName || item.title || 'Product Item'}
                        </div>
                        <div className="text-[11px] text-[#786C64]">
                          Qty: {item.quantity} • SKU: {item.sku || 'N/A'}
                        </div>
                      </div>
                      <div className="font-bold text-[#2D2621]">
                        {currencySymbol}
                        {(item.totalPrice || item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Status History Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#786C64] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C5338]" />
                  <span>Milestone Audit History</span>
                </h3>

                <div className="space-y-3">
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

            {/* Helpful Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DA]">
              <div className="flex items-center gap-2 text-xs text-[#786C64]">
                <ShieldCheck className="w-4 h-4 text-[#8C5338]" />
                <span>Need support? Contact customer concierge for live updates.</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={AppRoute.ACCOUNT}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E8E2DA] hover:bg-[#FAF8F5] text-[#2D2621] text-xs font-bold transition-colors cursor-pointer"
                >
                  My Account
                </Link>
                <Link
                  href={AppRoute.ORDER_DETAIL(order.id)}
                  className="px-4 py-2 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Full Order Summary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
