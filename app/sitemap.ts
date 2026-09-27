import type { MetadataRoute } from 'next'
import { privacy, terms } from '@/content/legal'
import { isIndexable, site } from '@/content/site'

/** Indexable routes only. Legal pages join once their text is approved. */
const routes: Array<{ path: string; priority: number }> = [
  { path: '', priority: 1 },
  { path: '/pricing', priority: 0.9 },
  { path: '/how-it-works', priority: 0.9 },
  { path: '/features', priority: 0.9 },
  { path: '/who-its-for', priority: 0.8 },
  { path: '/contact', priority: 0.8 },
  { path: '/after-you-buy', priority: 0.6 },
  { path: '/faq', priority: 0.6 },
  { path: '/about', priority: 0.5 },
  ...(privacy.status === 'approved' ? [{ path: '/privacy', priority: 0.2 }] : []),
  ...(terms.status === 'approved' ? [{ path: '/terms', priority: 0.2 }] : []),
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Without a real public origin there is nothing honest to list.
  if (!isIndexable || !site.origin) return []
  return routes.map((route) => ({
    url: `${site.origin}${route.path}`,
    changeFrequency: 'monthly',
    priority: route.priority,
  }))
}
