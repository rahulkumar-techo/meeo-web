'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DropsTeaser: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-r from-[#412ce7] via-[#5b4dff] to-[#412ce7] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Ambient Overlay Patterns */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#fd6a49]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5 text-[#fd6a49]" />
            <span>Limited Archival Drop № 24</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Unlock Private Studio Pricing
          </h3>
          <p className="text-xs sm:text-sm text-[#e3dfff] leading-relaxed">
            Serialized drops are released in numbered batches of 500 units. Early Studio members receive instant access and complimentary priority air logistics.
          </p>
        </div>

        {/* Live Countdown & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-6 z-10 shrink-0">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
            <Clock className="w-4 h-4 text-[#fd6a49]" />
            <div className="flex items-center gap-1 font-mono text-base font-extrabold">
              <span className="w-8 text-center">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="w-8 text-center">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="w-8 text-center text-[#fd6a49]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

          <Link href="/drops">
            <Button
              variant="coral"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Access Drop Portal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
