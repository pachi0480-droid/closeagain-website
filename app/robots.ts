import type { MetadataRoute } from 'next'
import { isIndexable, site } from '@/content/site'

/**
 * Production (a public origin is configured): crawl the marketing pages, not
 * the confirmation page or the form endpoint. Anything else — a preview, a
 * local build — asks every crawler to stay out.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable || !site.origin) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thank-you'],
      },
    ],
    sitemap: `${site.origin}/sitemap.xml`,
  }
}
