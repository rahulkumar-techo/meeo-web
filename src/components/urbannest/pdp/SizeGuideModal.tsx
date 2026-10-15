'use client';

import React, { useEffect } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { uk: 'UK 6', us: 'US 6.5', eu: 'EU 39', cm: '24.5 cm' },
  { uk: 'UK 6.5', us: 'US 7', eu: 'EU 40', cm: '25.0 cm' },
  { uk: 'UK 7', us: 'US 7.5', eu: 'EU 40.5', cm: '25.5 cm' },
  { uk: 'UK 7.5', us: 'US 8', eu: 'EU 41', cm: '26.0 cm' },
  { uk: 'UK 8', us: 'US 8.5', eu: 'EU 42', cm: '26.5 cm' },
  { uk: 'UK 8.5', us: 'US 9', eu: 'EU 42.5', cm: '27.0 cm' },
  { uk: 'UK 9', us: 'US 9.5', eu: 'EU 43', cm: '27.5 cm' },
  { uk: 'UK 9.5', us: 'US 10', eu: 'EU 44', cm: '28.0 cm' },
  { uk: 'UK 10', us: 'US 10.5', eu: 'EU 44.5', cm: '28.5 cm' },
  { uk: 'UK 11', us: 'US 11.5', eu: 'EU 46', cm: '29.5 cm' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-urban-fadeInUp"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2DA] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F5EBE6] text-[#8C5338] flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2D2621]">
                Footwear Size Guide
              </h3>
              <p className="text-xs text-[#786C64]">
                Standard sizing conversion for Nike &amp; lifestyle sneakers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F3EFEA] text-[#2D2621] flex items-center justify-center border border-[#E8E2DA] transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sizing Table */}
        <div className="my-6 max-h-[340px] overflow-y-auto rounded-xl border border-[#E8E2DA] bg-white">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F3EFEA] text-[#2D2621] font-semibold sticky top-0 border-b border-[#E8E2DA]">
              <tr>
                <th className="py-3 px-4">UK Size</th>
                <th className="py-3 px-4">US Size</th>
                <th className="py-3 px-4">EU Size</th>
                <th className="py-3 px-4">Foot Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2DA] text-[#786C64]">
              {SIZE_CHART.map((row) => (
                <tr
                  key={row.uk}
                  className={`hover:bg-[#FAF8F5] transition-colors ${
                    row.uk === 'UK 9' ? 'bg-[#F5EBE6]/60 font-semibold text-[#8C5338]' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 text-[#2D2621]">{row.uk}</td>
                  <td className="py-2.5 px-4">{row.us}</td>
                  <td className="py-2.5 px-4">{row.eu}</td>
                  <td className="py-2.5 px-4">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Tip */}
        <div className="bg-[#F3EFEA] rounded-2xl p-4 text-xs text-[#786C64] leading-relaxed">
          <span className="font-semibold text-[#2D2621]">Fit Recommendation: </span>
          The Nike Air Force 1 &apos;07 generally runs true to size with a roomy toe box. If you have narrow feet or prefer a snug lock-in, consider going half a size down.
        </div>
      </div>
    </div>
  );
};
