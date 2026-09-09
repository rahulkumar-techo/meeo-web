import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface WishlistHeroProps {
  count: number;
}

export const WishlistHero: React.FC<WishlistHeroProps> = ({ count }) => {
  return (
    <section className="w-full bg-[#f2f3ff]/60 border-b border-[#e2e7ff] py-8">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdad2] text-[#ae3115] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Curated Wishboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">
            Saved Pieces &amp; Desired Drops<span className="text-[#fd6a49]">.</span>
          </h1>
          <p className="text-sm text-[#464556] mt-1">
            Personalized curation archive with live price-drop alerts and low-inventory warnings.
          </p>
        </div>

        <span className="text-xs font-bold text-[#412ce7] bg-[#eaedff] px-4 py-2 rounded-full shrink-0">
          {count} Saved {count === 1 ? 'Object' : 'Objects'}
        </span>
      </div>
    </section>
  );
};
