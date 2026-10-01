import type { Metadata } from 'next'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { FaqMoment } from '@/components/moments/Moments'
import { Accordion } from '@/components/editorial/Accordion'
import { faq } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: faq.meta.title,
  description: faq.meta.description,
  path: '/faq',
})

export default function FaqPage() {
  return (
    <>
      <PageIntro eyebrow={faq.eyebrow} title={faq.title} lede={faq.lede} visual={<FaqMoment />} />

      <section className="section section--flush-top" aria-label="Questions and answers">
        <div className="wrap">
          <Accordion items={faq.items} />
        </div>
      </section>

      <ClosingCta id="closing-title" title={faq.closing.title} body={faq.closing.body} cta={faq.closing.cta} />
    </>
  )
}
