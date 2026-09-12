'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { OrderHistoryList } from '@/features/orders/OrderHistoryList';
import { useOrdersQuery } from '@/hooks/order/useOrder';
import { extractArray } from '@/lib/apiHelper';

export default function OrdersPage() {
  const { data: ordersResponse, isLoading } = useOrdersQuery();
  const orders = extractArray(ordersResponse);

  return (
    <div className="flex flex-col w-full pb-20">
      <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-6">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Personal Fulfillment Matrix</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Your Orders &amp; Dispatches<span className="text-[#fd6a49]">.</span>
            </h1>
          </div>

          <Link
            href="/category"
            className="text-xs text-[#412ce7] font-bold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </section>

      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#777588]">Loading your orders...</div>
        ) : (
          <OrderHistoryList orders={orders} />
        )}
      </div>
    </div>
  );
}
