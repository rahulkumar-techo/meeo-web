'use client';

import React from 'react';
import { CreditCard, QrCode, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SavedPaymentsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#412ce7]" />
          <h3 className="text-base font-bold text-[#131b2e]">Saved Payment Instruments</h3>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add Method
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* UPI Instrument */}
        <div className="p-4 rounded-2xl border border-[#412ce7] bg-[#eaedff]/30 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#412ce7] text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#131b2e]">Google Pay (Primary UPI)</span>
              <p className="text-[11px] text-[#464556]">milo.kapoor@okhdfcbank</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#412ce7] text-[10px] font-bold uppercase">
            Default
          </span>
        </div>

        {/* Card Instrument */}
        <div className="p-4 rounded-2xl border border-[#e2e7ff] bg-[#faf8ff] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-[#464556] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#131b2e]">HDFC Bank Visa Infinite</span>
              <p className="text-[11px] text-[#464556]">•••• •••• •••• 4018 · Exp 09/29</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
