import React, { Suspense } from 'react';
import { OrderTrackingView } from '@/features/orders/OrderTrackingView';

export const metadata = {
  title: 'Track Shipment · UrbanNest Orders',
  description: 'Monitor real-time shipment milestones, dispatch updates, and delivery ETA.',
};

export default function OrdersTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderTrackingView />
    </Suspense>
  );
}
