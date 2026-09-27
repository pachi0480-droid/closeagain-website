import type { Metadata } from 'next'
import { isIndexable, site } from '@/content/site'
import { shareCard } from '@/lib/share'

/**
 * Per-page metadata. Canonical URLs exist only when a real public origin is
 * configured; otherwise the site is a preview and asks not to be indexed.
 *
 * Every page names the share card explicitly: a page's own `openGraph` replaces
 * the layout's, which would otherwise drop the card from shared links.
 */
const shareImage = { url: '/opengraph-image', ...shareCard.size, alt: shareCard.alt }
export function pageMetadata({
  title,
  description,
  path,
  index = true,
  absoluteTitle = false,
}: {
  title: string
  description?: string
  path: string
  /** Pass false for pages that must never be indexed (confirmation, drafts). */
  index?: boolean
  absoluteTitle?: boolean
}): Metadata {
  const indexable = isIndexable && index
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: site.origin && index ? { canonical: path } : undefined,
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: absoluteTitle ? title : `${title} — ${site.name}`,
      description,
      url: site.origin ? path : undefined,
      locale: 'en_US',
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: absoluteTitle ? title : `${title} — ${site.name}`,
      description,
      images: [shareImage],
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: index },
  }
}
