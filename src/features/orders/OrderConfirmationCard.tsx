import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, PackageCheck, Download, ExternalLink } from 'lucide-react';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/Button';

interface OrderConfirmationCardProps {
  order: Order;
}

export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#dcfce7] text-green-700 flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Dispatched</span>
              <span className="w-1 h-1 rounded-full bg-[#fd6a49]" />
              <span>Air Priority Express</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#131b2e]">
              Order Confirmed #{order.orderNumber}
            </h2>
            <p className="text-xs text-[#464556] mt-0.5">
              Estimated Delivery: <span className="font-bold text-[#131b2e]">{order.estimatedDelivery}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert(`Downloading official VAT invoice for ${order.orderNumber}`)}
          >
            Invoice
          </Button>
          <Link href="/category">
            <Button variant="secondary" size="sm">
              Explore More
            </Button>
          </Link>
        </div>
      </div>

      {/* Courier Lockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] text-xs">
        <div>
          <span className="text-[#777588] font-bold uppercase block mb-1">Logistics Carrier</span>
          <p className="font-bold text-[#131b2e]">{order.courierName}</p>
        </div>
        <div>
          <span className="text-[#777588] font-bold uppercase block mb-1">Tracking Number</span>
          <p className="font-mono font-bold text-[#412ce7]">{order.trackingNumber}</p>
        </div>
        <div>
          <span className="text-[#777588] font-bold uppercase block mb-1">Destination</span>
          <p className="font-medium text-[#131b2e] truncate">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
        </div>
      </div>
    </div>
  );
};
