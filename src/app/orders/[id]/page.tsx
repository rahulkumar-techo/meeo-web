'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { OrderConfirmationCard } from '@/features/orders/OrderConfirmationCard';
import { OrderMilestonesTimeline } from '@/features/orders/OrderMilestonesTimeline';
import { MOCK_ORDERS } from '@/data/orders';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const order = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId) || MOCK_ORDERS[0];

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
