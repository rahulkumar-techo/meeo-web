'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ExternalLink, Download } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderHistoryListProps {
  orders: Order[];
}

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({ orders }) => {
  return (
    <div className="flex flex-col gap-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6"
        >
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e7ff]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#777588]">
                  Order #{order.orderNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'out_for_delivery'
                      ? 'bg-[#eaedff] text-[#412ce7]'
                      : 'bg-[#dcfce7] text-[#15803d]'
                  }`}
                >
                  {order.status === 'out_for_delivery' ? 'Out for Delivery' : 'Delivered'}
                </span>
              </div>
              <p className="text-xs text-[#464556]">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-[#131b2e]">
                ₹{order.summary.total.toLocaleString('en-IN')}
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
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff]"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-[#e2e7ff]"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-[#131b2e] truncate">{item.product.name}</h5>
                  <p className="text-[11px] text-[#777588] mt-0.5">
                    Qty: {item.quantity} {item.selectedSize && `· ${item.selectedSize}`}
                  </p>
                  <span className="text-xs font-bold text-[#412ce7] mt-1 block">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
