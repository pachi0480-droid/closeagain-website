import type { Metadata } from 'next'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { IndustryCard } from '@/components/industries/IndustryCard'
import { industries, industryPage } from '@/content/industries'
import { whoItsFor } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: whoItsFor.meta.title,
  description: whoItsFor.meta.description,
  path: '/who-its-for',
})

/**
 * Eight kinds of lead-driven business, each with one line on what CloseAgain
 * does for it. The whole card is the target and opens that industry's own
 * page; the closing call to action opens the buying form.
 */
export default function WhoItsForPage() {
  const { closing } = whoItsFor

  return (
    <>
      <PageIntro eyebrow={whoItsFor.eyebrow} title={whoItsFor.title} lede={whoItsFor.lede} />

      <section className="industries" aria-label="Industries">
        <div className="wrap">
          <ul className="industries__grid">
            {industries.map((industry, i) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
                label={industryPage.related.go}
                index={i}
                eager={i < 4}
                sizes="(min-width: 1180px) 300px, (min-width: 560px) 45vw, 92vw"
              />
            ))}
          </ul>
          <p className="industries__note">{whoItsFor.imageNote}</p>
        </div>
      </section>

      <ClosingCta id="closing-title" title={closing.title} body={closing.body} cta={closing.cta} />

      <p className="big-word big-word--end wrap" aria-hidden="true" data-reveal>
        {whoItsFor.word}
      </p>
    </>
  )
}
