import type { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'
import { privacy } from '@/content/legal'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: privacy.title,
  description: privacy.description,
  path: '/privacy',
  // Unfinished legal pages stay out of search results until approved.
  index: privacy.status === 'approved',
})

export default function PrivacyPage() {
  return <LegalDocument doc={privacy} />
}
