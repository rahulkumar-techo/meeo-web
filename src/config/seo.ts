/**
 * Meeo SEO Master Configuration & Schema Generators
 * 
 * Provides centralized metadata defaults, OpenGraph presets,
 * Twitter card specifications, and Schema.org Rich Result JSON-LD generators.
 */

export const SITE_CONFIG = {
  name: 'Meeo',
  legalName: 'Meeo Tactile Commerce Inc.',
  url: 'https://meeo.store',
  ogImage: 'https://meeo.store/assets/meeo-og.jpg',
  description:
    'Meeo is an independent tech-commerce ecosystem engineering mindful daily hardware, quiet desk objects, and tactile living pieces for discerning modern spaces.',
  keywords: [
    'Meeo',
    'tactile objects',
    'minimalist hardware',
    'desk setup',
    'mechanical keyboards',
    'audiophile headphones',
    'sustainable tech',
    'curated design',
    'limited drops',
    'archival editions',
    'mindful commerce',
  ],
  authors: [{ name: 'Meeo Design Lab', url: 'https://meeo.store' }],
  creator: 'Meeo Studio',
  publisher: 'Meeo Commerce',
  twitterHandle: '@meeo_commerce',
  supportEmail: 'concierge@meeo.store',
  currency: 'INR',
  locale: 'en_IN',
};

/**
 * Generate Schema.org Organization Structured Data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/assets/meeo-logo.svg`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.supportEmail,
    sameAs: [
      'https://twitter.com/meeo_commerce',
      'https://instagram.com/meeo_commerce',
      'https://github.com/rahulkumar-techo/meeo-web',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer concierge',
      email: SITE_CONFIG.supportEmail,
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

/**
 * Generate Schema.org WebSite Structured Data with Search Action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/category?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Schema.org Product Structured Data for Rich Snippets
 */
export function generateProductSchema(product: {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  categoryLabel?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    category: product.categoryLabel || 'Tactile Tech Objects',
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/product/${product.id}`,
      priceCurrency: SITE_CONFIG.currency,
      price: product.price,
      priceValidUntil: '2027-12-31',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: Math.max(product.reviewCount, 1),
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * Generate Schema.org BreadcrumbList Structured Data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
