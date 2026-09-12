import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/seo';
import { catalogService } from '@/services/catalog/catalogService';

/**
 * Dynamic Sitemap Generator for Next.js App Router
 * Outputs /sitemap.xml automatically with full static and dynamic route indexing via API.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const currentDate = new Date().toISOString();

  // Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/drops`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  try {
    const [productsRes, categoriesRes] = await Promise.allSettled([
      catalogService.getProducts({ limit: 100 }),
      catalogService.getCategories(),
    ]);

    const products = productsRes.status === 'fulfilled' ? productsRes.value.data || [] : [];
    const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data || [] : [];

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/category?cat=${cat.slug || cat.id}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.slug || prod.id}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
