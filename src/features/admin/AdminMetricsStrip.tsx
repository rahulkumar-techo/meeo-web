import React from 'react';
import { TrendingUp, Package, Users, Activity } from 'lucide-react';
import { SalesMetric } from '@/types/admin';

export const AdminMetricsStrip: React.FC = () => {
  const metrics: (SalesMetric & { icon: React.ElementType })[] = [
    {
      title: 'Gross Vault Revenue',
      value: '₹14,82,450',
      change: '+18.4%',
      isPositive: true,
      period: 'vs last 30 days',
      icon: TrendingUp,
    },
    {
      title: 'Active Dispatches',
      value: '24 Shipments',
      change: '100% On-Time',
      isPositive: true,
      period: 'Air Priority Courier',
      icon: Package,
    },
    {
      title: 'Studio Members',
      value: '1,420 Collectors',
      change: '+126 New',
      isPositive: true,
      period: 'Founding Tier',
      icon: Users,
    },
    {
      title: 'Discerning Return Rate',
      value: '0.42%',
      change: '-0.15%',
      isPositive: true,
      period: 'Calibrated Hardware',
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className="bg-white rounded-3xl p-6 border border-[#e2e7ff] shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#777588]">
                {m.title}
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="text-2xl font-extrabold text-[#131b2e] block">{m.value}</span>
              <div className="flex items-center gap-1.5 text-xs mt-1">
                <span className="font-bold text-green-600">{m.change}</span>
                <span className="text-[#777588]">{m.period}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
