import type { MetadataRoute } from 'next'
import { isIndexable, site } from '@/content/site'

/**
 * Production (a public origin is configured): crawl the marketing pages, not
 * the confirmation page, the form endpoint or the sample-data product demo.
 * Anything else — a preview, a local build — asks every crawler to stay out.
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
        disallow: ['/api/', '/thank-you', '/demo'],
      },
    ],
    sitemap: `${site.origin}/sitemap.xml`,
  }
}
