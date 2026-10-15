export interface UrbanNestHeroSlide {
  id: string;
  brand: string;
  name: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  rating: number;
  reviewCount: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface UrbanNestBenefit {
  id: string;
  iconName: 'truck' | 'rotate-ccw' | 'shield-check' | 'headphones';
  title: string;
  subtitle: string;
}

export interface UrbanNestCategory {
  id: string;
  label: string;
  href: string;
  image: string;
  count: string;
}

export interface UrbanNestProduct {
  id: string;
  name: string;
  category: string;
  categoryKey: 'footwear' | 'men' | 'women' | 'apparel' | 'accessories' | 'lifestyle';
  badge?: 'Bestseller' | 'New' | 'Limited';
  badgeVariant?: 'warm' | 'neutral' | 'dark';
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewCount: string;
  image: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  description?: string;
  productId?: string;
  slug?: string;
  defaultVariantId?: string;
  variants?: any[];
}

export interface UrbanNestPromo {
  badge: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  stampText: string;
}

export const URBAN_HERO_SLIDES: UrbanNestHeroSlide[] = [
  {
    id: 'nike-af1-07',
    brand: 'Nike',
    name: "Nike Air Force 1 '07",
    category: "Men's Sneakers",
    eyebrow: 'NEW COLLECTION',
    title: 'Every Step\nA Better You',
    description: 'Premium sneakers, crafted for comfort, designed for your everyday journey.',
    price: 7995,
    originalPrice: 9995,
    discount: '20% OFF',
    rating: 4.6,
    reviewCount: '5.2k',
    image: '/assets/urbannest/hero-sneaker.jpg',
    metrics: [
      { label: 'Premium Brands', value: '500+' },
      { label: 'Happy Customers', value: '50K+' },
      { label: 'Avg. Rating', value: '4.8 ★' },
    ],
  },
  {
    id: 'nb-574-legacy',
    brand: 'New Balance',
    name: 'New Balance 574 Legacy',
    category: 'Unisex Sneakers',
    eyebrow: 'TIMELESS HERITAGE',
    title: 'Pure Comfort,\nIconic Silhouette',
    description: 'Supple neutral suede paired with lightweight EVA foam and ENCAP midsole durability.',
    price: 7499,
    originalPrice: 8999,
    discount: '17% OFF',
    rating: 4.5,
    reviewCount: '3.1k',
    image: '/assets/urbannest/trending-nb-574.jpg',
    metrics: [
      { label: 'ENCAP Midsole', value: 'Standard' },
      { label: 'Suede Quality', value: 'Tier-1' },
      { label: 'Avg. Rating', value: '4.5 ★' },
    ],
  },
  {
    id: 'adidas-samba-og',
    brand: 'Adidas',
    name: 'Adidas Samba OG',
    category: 'Heritage Streetwear',
    eyebrow: 'TERRACE ICON',
    title: 'Precision Craft,\nEnduring Legacy',
    description: 'Full-grain leather upper, suede T-toe overlays, and low-profile gum rubber traction.',
    price: 8499,
    originalPrice: 10999,
    discount: '22% OFF',
    rating: 4.7,
    reviewCount: '4.8k',
    image: '/assets/urbannest/trending-samba-og.jpg',
    metrics: [
      { label: 'Full-Grain Leather', value: 'Verified' },
      { label: 'Gum Outsole', value: 'Low Profile' },
      { label: 'Avg. Rating', value: '4.7 ★' },
    ],
  },
];

export const URBAN_BENEFITS: UrbanNestBenefit[] = [
  {
    id: 'shipping',
    iconName: 'truck',
    title: 'Free Shipping',
    subtitle: 'On orders above ₹999',
  },
  {
    id: 'returns',
    iconName: 'rotate-ccw',
    title: 'Easy Returns',
    subtitle: 'Within 7 days',
  },
  {
    id: 'payment',
    iconName: 'shield-check',
    title: 'Secure Payment',
    subtitle: '100% secure checkout',
  },
  {
    id: 'support',
    iconName: 'headphones',
    title: '24/7 Support',
    subtitle: "We're here to help",
  },
];

export const URBAN_CATEGORIES: UrbanNestCategory[] = [];

export const URBAN_TRENDING_PRODUCTS: UrbanNestProduct[] = [];

export const URBAN_PROMO_BANNER: UrbanNestPromo = {
  badge: 'LIMITED TIME OFFER',
  headline: 'Up to 50% Off',
  subtitle: 'On selected styles. Don\'t miss your chance.',
  ctaText: 'Explore Deals',
  ctaHref: '/category?deals=true',
  image: '/assets/urbannest/promo-banner.jpg',
  stampText: 'BETTER STYLE • EVERYDAY • URBANNEST',
};
