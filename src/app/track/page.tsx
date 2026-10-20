import React, { Suspense } from 'react';
import { OrderTrackingView } from '@/features/orders/OrderTrackingView';

export const metadata = {
  title: 'Track Order · Meeo Logistics',
  description: 'Real-time shipment tracking, milestone timeline, and parcel delivery updates.',
};

export default function TrackPage() {
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
