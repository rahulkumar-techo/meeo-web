import React from 'react';
import { OrdersTab } from '@/features/account/OrdersTab';

export const metadata = {
  title: 'My Orders · Meeo E-Commerce',
  description: 'Track, view details, and manage your Meeo purchases.',
};

export default function OrdersPage() {
  return (
    <div className="w-full min-h-[70vh] bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E8E2DA] p-6 sm:p-8 shadow-2xs">
          <OrdersTab />
        </div>
      </div>
    </div>
  );
}
