'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { OrderListItem } from '@/types/order/order.types';

interface OrderHistoryListProps {
  orders: (OrderListItem | any)[];
}

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-[#e2e7ff] text-center">
        <p className="text-sm text-[#777588] mb-4">No order history found.</p>
        <Link
          href="/category"
          className="inline-flex px-5 py-2.5 bg-[#412ce7] text-white rounded-xl text-xs font-bold"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => {
        const orderNum = order.orderNumber || order.id;
        const total = order.totalAmount || order.summary?.total || 0;
        const status = order.status || 'CONFIRMED';
        const isOut = status === 'out_for_delivery' || status === 'SHIPPED';
        const itemsPreview = order.itemsPreview || (order.items ? order.items.map((i: any) => ({
          title: i.product?.name || i.title,
          quantity: i.quantity,
          thumbnailUrl: i.product?.images?.[0] || i.thumbnailUrl || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300',
        })) : []);

        return (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e7ff]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#777588]">
                    Order #{orderNum}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isOut
                        ? 'bg-[#eaedff] text-[#412ce7]'
                        : 'bg-[#dcfce7] text-[#15803d]'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-xs text-[#464556]">
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Recently'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-extrabold text-[#131b2e]">
                  ₹{Number(total).toLocaleString('en-IN')}
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="px-4 py-2 bg-[#412ce7] hover:bg-[#5b4dff] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Track Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Items Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {itemsPreview.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff]"
                >
                  <img
                    src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300'}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-[#e2e7ff]"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[#131b2e] truncate">{item.title}</h5>
                    <p className="text-[11px] text-[#777588] mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
