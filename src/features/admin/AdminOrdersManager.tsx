'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PackageCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { AdminOrderSummary } from '@/types/admin';
import { useToast } from '@/context/ToastContext';

export const AdminOrdersManager: React.FC = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<AdminOrderSummary[]>([
    {
      id: 'ord-9021',
      orderNumber: 'MEEO-89234',
      customerName: 'Milo Kapoor',
      customerEmail: 'milo.kapoor@studio.meeo',
      total: 11798,
      itemsCount: 2,
      status: 'out_for_delivery',
      paymentStatus: 'Paid',
      createdAt: 'Today, 02:45 PM',
    },
    {
      id: 'ord-8812',
      orderNumber: 'MEEO-77412',
      customerName: 'Aanya Sharma',
      customerEmail: 'aanya.s@meeo.in',
      total: 18499,
      itemsCount: 1,
      status: 'delivered',
      paymentStatus: 'Paid',
      createdAt: 'Aug 20, 2026',
    },
  ]);

  const handleStatusUpdate = (
    id: string,
    newStatus: AdminOrderSummary['status']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-[#412ce7]" />
          <h3 className="text-base font-bold text-[#131b2e]">Customer Orders &amp; Fulfillment Queue</h3>
        </div>
        <span className="text-xs font-semibold text-[#777588]">{orders.length} Active Orders</span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#e2e7ff] text-[#777588] font-bold uppercase tracking-wider">
              <th className="pb-3">Order &amp; Customer</th>
              <th className="pb-3">Items</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Payment</th>
              <th className="pb-3">Fulfillment Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2f3ff]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#faf8ff] transition-colors">
                <td className="py-3.5 pr-4">
                  <span className="font-bold text-[#131b2e] block">#{order.orderNumber}</span>
                  <span className="text-[11px] text-[#464556]">{order.customerName}</span>
                </td>
                <td className="py-3.5 pr-4 text-[#464556]">{order.itemsCount} pcs</td>
                <td className="py-3.5 pr-4 font-bold text-[#131b2e]">
                  ₹{order.total.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 pr-4">
                  <span className="px-2 py-0.5 rounded bg-[#dcfce7] text-[#15803d] text-[10px] font-bold uppercase">
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value as AdminOrderSummary['status'])
                    }
                    className="bg-[#f2f3ff] text-[#131b2e] font-semibold text-xs py-1 px-2.5 rounded-lg border border-[#e2e7ff] outline-none cursor-pointer"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Dispatched</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-[#412ce7] font-bold hover:underline"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
