'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles, Shield } from 'lucide-react';

export const DropsHero: React.FC = () => {
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
    <section className="w-full bg-[#131b2e] text-white py-12 sm:py-16 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#412ce7]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#fd6a49]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-[#fd6a49]" />
            <span>Archival Drop № 24 · Autumn Curation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-3">
            Limited Numbered Editions<span className="text-[#fd6a49]">.</span>
          </h1>
          <p className="text-sm text-[#dae2fd] leading-relaxed">
            Numbered production runs of 500 units worldwide. Calibrated in small artisan batches with serialized certificate cards.
          </p>
        </div>

        {/* Live Timer Card */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-3 shrink-0 shadow-2xl">
          <span className="text-xs font-bold text-[#dae2fd] uppercase tracking-wider">
            Drop Closes In
          </span>
          <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-extrabold text-white">
            <div className="bg-black/40 px-3 py-2 rounded-xl text-center min-w-[56px]">
              {String(timeLeft.hours).padStart(2, '0')}
              <span className="text-[10px] text-[#777588] block font-sans">HRS</span>
            </div>
            <span>:</span>
            <div className="bg-black/40 px-3 py-2 rounded-xl text-center min-w-[56px]">
              {String(timeLeft.minutes).padStart(2, '0')}
              <span className="text-[10px] text-[#777588] block font-sans">MIN</span>
            </div>
            <span>:</span>
            <div className="bg-black/40 px-3 py-2 rounded-xl text-center min-w-[56px] text-[#fd6a49]">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="text-[10px] text-[#777588] block font-sans">SEC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
