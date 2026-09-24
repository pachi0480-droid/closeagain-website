import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

const routes = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/product', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculator', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
