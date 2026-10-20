import React from 'react';
import { MeeoHero } from '@/components/meeo/MeeoHero';
import { MeeoBenefits } from '@/components/meeo/MeeoBenefits';
import { MeeoCategories } from '@/components/meeo/MeeoCategories';
import { MeeoTrending } from '@/components/meeo/MeeoTrending';
import { MeeoPromoBanner } from '@/components/meeo/MeeoPromoBanner';

export const metadata = {
  title: 'Meeo E-Commerce · Modern Lifestyle, Apparel & Curated Essentials',
  description:
    'Discover Meeo E-Commerce: Curated collections of premium apparel, modern lifestyle goods, electronics, and home essentials. Explore our new collection and exclusive deals.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAF8F5]">
      {/* Editorial Hero Section with 3D / Photorealistic Staging */}
      <MeeoHero />

      {/* Service Trust Badges & Benefits */}
      <MeeoBenefits />

      {/* Image-led Category Showcase */}
      <MeeoCategories />

      {/* Four-Column Trending Products Grid */}
      <MeeoTrending />

      {/* Cinematic Promotional Sale Banner */}
      <MeeoPromoBanner />
    </div>
  );
}