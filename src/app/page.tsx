import React from 'react';
import { UrbanNestHero } from '@/components/urbannest/UrbanNestHero';
import { UrbanNestBenefits } from '@/components/urbannest/UrbanNestBenefits';
import { UrbanNestCategories } from '@/components/urbannest/UrbanNestCategories';
import { UrbanNestTrending } from '@/components/urbannest/UrbanNestTrending';
import { UrbanNestPromoBanner } from '@/components/urbannest/UrbanNestPromoBanner';

export const metadata = {
  title: 'UrbanNest · Modern Lifestyle, Apparel & Curated Essentials',
  description:
    'Discover UrbanNest: Curated collections of premium apparel, modern lifestyle goods, electronics, and home essentials. Explore our new collection and exclusive deals.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAF8F5]">
      {/* Editorial Hero Section with 3D / Photorealistic Staging */}
      <UrbanNestHero />

      {/* Service Trust Badges & Benefits */}
      <UrbanNestBenefits />

      {/* Image-led Category Showcase */}
      <UrbanNestCategories />

      {/* Four-Column Trending Products Grid */}
      <UrbanNestTrending />

      {/* Cinematic Promotional Sale Banner */}
      <UrbanNestPromoBanner />
    </div>
  );
}