import type { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'
import { terms } from '@/content/legal'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: terms.title,
  description: terms.description,
  path: '/terms',
  // Unfinished legal pages stay out of search results until approved.
  index: terms.status === 'approved',
})

export default function TermsPage() {
  return <LegalDocument doc={terms} />
}
