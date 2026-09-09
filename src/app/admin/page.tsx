'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { AdminMetricsStrip } from '@/features/admin/AdminMetricsStrip';
import { AdminInventoryTable } from '@/features/admin/AdminInventoryTable';
import { AdminOrdersManager } from '@/features/admin/AdminOrdersManager';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Bar */}
      <section className="w-full bg-[#131b2e] text-white py-8 border-b border-black">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fd6a49]" />
              <span>Studio Master Console</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Meeo Commerce &amp; Fulfillment Studio<span className="text-[#fd6a49]">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="tonal"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => window.location.reload()}
            >
              Sync Vault
            </Button>
            <Link
              href="/"
              className="text-xs text-[#dae2fd] hover:text-white font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex flex-col gap-8">
        <AdminMetricsStrip />
        <AdminInventoryTable />
        <AdminOrdersManager />
      </div>
    </div>
  );
}
