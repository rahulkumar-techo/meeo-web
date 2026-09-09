import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/seo';

/**
 * Next.js App Router robots.txt Generator
 * Directs search engine crawlers and declares sitemap location.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/account/settings'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
