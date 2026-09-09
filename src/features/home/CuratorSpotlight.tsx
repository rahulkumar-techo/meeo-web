import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Leaf, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const CuratorSpotlight: React.FC = () => {
  const pillars = [
    {
      icon: Hammer,
      title: 'Monolithic CNC Milling',
      description: 'Aerospace-grade 6063 aluminum precision carved with zero hollow acoustic resonances.',
    },
    {
      icon: Leaf,
      title: 'Zero Plastic Packaging',
      description: '100% recycled unbleached fiber pulp trays with tamper-evident paper tape.',
    },
    {
      icon: Cpu,
      title: 'Acoustic Calibration',
      description: 'Beryllium dynamic drivers tuned for honest, uncolored sonic transparency.',
    },
    {
      icon: ShieldCheck,
      title: 'Discerning Warranty',
      description: '2-year direct replacement coverage backed by our Bengaluru & Milano studio facilities.',
    },
  ];

  return (
    <section className="w-full bg-[#f2f3ff] py-16 sm:py-20 border-y border-[#e2e7ff]">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#412ce7] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#fd6a49]" />
            <span>Meeo Philosophy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
            Designed for Quiet Discerning Spaces
          </h2>
          <p className="text-sm text-[#464556] mt-2 leading-relaxed">
            We reject mass plastic disposability. Every Meeo silhouette is engineered with tactile weight, authentic materials, and architectural integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 border border-[#e2e7ff] shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
              >
                <div className="w-11 h-11 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#131b2e] mb-1.5">{pillar.title}</h4>
                <p className="text-xs text-[#464556] leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
