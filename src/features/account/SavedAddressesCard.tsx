'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SavedAddressesCard: React.FC = () => {
  const [addresses] = useState([
    {
      id: 'addr-1',
      label: 'Indiranagar Studio (Default)',
      street: 'Flat 402, Sovereign Residency, 12th Main Indiranagar',
      city: 'Bengaluru, Karnataka 560038',
      phone: '+91 98450 12345',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Koramangala Design Hub',
      street: '3rd Floor, Urban Oasis, 80 Feet Road',
      city: 'Bengaluru, Karnataka 560034',
      phone: '+91 98450 99881',
      isDefault: false,
    },
  ]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#412ce7]" />
          <h3 className="text-base font-bold text-[#131b2e]">Saved Shipping Addresses</h3>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-4 rounded-2xl border transition-all ${
              addr.isDefault
                ? 'border-[#412ce7] bg-[#eaedff]/30 shadow-xs'
                : 'border-[#e2e7ff] bg-[#faf8ff]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#131b2e]">{addr.label}</span>
              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#412ce7] text-[10px] font-bold uppercase">
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-[#464556] leading-relaxed">{addr.street}</p>
            <p className="text-xs text-[#464556]">{addr.city}</p>
            <p className="text-[11px] text-[#777588] mt-2 font-medium">{addr.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
