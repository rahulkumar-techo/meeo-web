import React from 'react';
import Link from 'next/link';
import { User, Award, Sparkles, Shield, Gift, Settings } from 'lucide-react';

export const AccountProfileHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center font-extrabold text-2xl border border-[#dae2fd]">
          MK
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e2e7ff] text-[#412ce7] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-[#fd6a49]" />
            <span>Studio Tier · Founding Member</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#131b2e]">Milo Kapoor</h2>
          <p className="text-xs text-[#464556]">milo.kapoor@studio.meeo · +91 98450 12345</p>
        </div>
      </div>

      {/* Rewards, Studio Points Card & Settings CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-[#faf8ff] border border-[#e2e7ff] flex-1 sm:flex-initial">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#fd6a49]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#777588]">Studio Credit</span>
              <p className="text-base sm:text-lg font-extrabold text-[#131b2e]">1,200 Pts (₹1,200)</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#e2e7ff]" />

          <div>
            <span className="text-[10px] font-bold uppercase text-[#777588]">Warranty Vault</span>
            <p className="text-xs font-bold text-green-700">3 Active Products</p>
          </div>
        </div>

        <Link
          href="/account/settings"
          className="p-3.5 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#412ce7] border border-[#dae2fd] flex items-center justify-center gap-2 text-xs font-bold transition-colors"
          title="Account Settings & Preferences"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};
