import type { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/data';

export const dynamic = 'force-static';

/** Before launch (ALLOW_INDEXING not set) everything is blocked, so previews aren't indexed. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();
  if (!site.allowIndexing) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.baseUrl}/sitemap.xml`,
  };
}
