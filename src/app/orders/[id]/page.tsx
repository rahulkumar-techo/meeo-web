'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { OrderConfirmationCard } from '@/features/orders/OrderConfirmationCard';
import { OrderMilestonesTimeline } from '@/features/orders/OrderMilestonesTimeline';
import { useOrderByIdQuery } from '@/hooks/order/useOrder';
import { useOrderRealtime } from '@/hooks/order/useOrderRealtime';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { data: orderResponse, isLoading } = useOrderByIdQuery(orderId);
  useOrderRealtime(orderId);

  const rawOrder: any = orderResponse?.data || orderResponse;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-[#777588]">Loading live telemetry and order tracking...</p>
      </div>
    );
  }

  const milestones = rawOrder?.milestones?.length
    ? rawOrder.milestones
    : rawOrder?.statusHistory?.length
    ? rawOrder.statusHistory.map((sh: any, idx: number) => ({
        id: `ms_${idx}`,
        title: sh.status,
        description: sh.note || `Order status updated to ${sh.status}`,
        timestamp: new Date(sh.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: 'Logistics Vault',
        completed: true,
        current: idx === (rawOrder.statusHistory?.length || 0) - 1,
      }))
    : [
        {
          id: 'ms_1',
          title: 'Order Confirmed & Serialized',
          description: 'Quality inspected and assigned dedicated priority batch.',
          timestamp: new Date(rawOrder?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: 'Central Vault, Bengaluru',
          completed: true,
          current: rawOrder?.status === 'CONFIRMED' || rawOrder?.status === 'PENDING',
        },
        {
          id: 'ms_2',
          title: 'Dispatched via Air Priority Express',
          description: 'Departed sorting facility in climate-controlled transit.',
          timestamp: 'In Transit',
          location: 'BlueDart Air Hub',
          completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(rawOrder?.status || ''),
          current: rawOrder?.status === 'PROCESSING' || rawOrder?.status === 'SHIPPED',
        },
        {
          id: 'ms_3',
          title: 'Out for Priority Delivery',
          description: 'Courier agent en route for zero-contact doorstep handover.',
          timestamp: 'Pending Handover',
          location: `${rawOrder?.shippingAddress?.city || 'Local'} Delivery Zone`,
          completed: rawOrder?.status === 'DELIVERED',
          current: rawOrder?.status === 'OUT_FOR_DELIVERY',
        },
      ];

  const order: any = {
    id: rawOrder?.id || orderId,
    orderNumber: rawOrder?.orderNumber || `ORD-${orderId.substring(0, 8)}`,
    createdAt: rawOrder?.createdAt || new Date().toISOString(),
    status: rawOrder?.status || 'CONFIRMED',
    estimatedDelivery: rawOrder?.tracking?.estimatedDelivery || 'Today by 6:00 PM',
    items: rawOrder?.items || [],
    shippingAddress: {
      fullName: rawOrder?.shippingAddress?.recipientName || rawOrder?.shippingAddress?.fullName || 'Customer',
      streetAddress: rawOrder?.shippingAddress?.addressLine1 || rawOrder?.shippingAddress?.streetAddress || 'Shipping Address',
      city: rawOrder?.shippingAddress?.city || 'Bengaluru',
      state: rawOrder?.shippingAddress?.state || 'Karnataka',
      postalCode: rawOrder?.shippingAddress?.postalCode || '560038',
      phone: rawOrder?.shippingAddress?.phone || '+91 9999999999',
    },
    paymentMethod: {
      type: 'upi',
      label: rawOrder?.paymentStatus === 'PAID' ? 'Verified Online Payment' : 'Pending Payment',
    },
    summary: {
      subtotal: rawOrder?.subtotal || 0,
      shipping: rawOrder?.shippingFee || 0,
      discount: rawOrder?.discountAmount || 0,
      total: rawOrder?.totalAmount || 0,
    },
    trackingNumber: rawOrder?.tracking?.trackingNumber || 'BD-AIR-789012',
    courierName: rawOrder?.tracking?.carrier || 'BlueDart Air Priority',
    milestones,
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Breadcrumbs Strip */}
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-3.5">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-[#777588]">
            <Link href="/" className="hover:text-[#412ce7] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/orders" className="hover:text-[#412ce7] transition-colors">
              Orders
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#412ce7] font-semibold">{order.orderNumber}</span>
          </nav>

          <Link
            href="/orders"
            className="text-xs text-[#412ce7] font-bold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
        </div>
      </section>

      {/* Main Grid: Confirmation Banner + Real-Time Telemetry Timeline */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex flex-col gap-8">
        <OrderConfirmationCard order={order} />
        <OrderMilestonesTimeline order={order} />
      </div>
    </div>
  );
}
