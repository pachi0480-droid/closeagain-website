import type { Metadata } from 'next'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { IndustryIndex } from '@/components/industries/IndustryIndex'
import { industries, industryPage } from '@/content/industries'
import { whoItsFor } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: whoItsFor.meta.title,
  description: whoItsFor.meta.description,
  path: '/who-its-for',
})

/**
 * Eight kinds of lead-driven business, as an index in the site's editorial
 * layout (as the industry pages): each row names the industry, says what
 * CloseAgain does for it and shows one sample exchange from its page, and
 * opens that page. The closing call to action opens the buying form.
 */
export default function WhoItsForPage() {
  const { closing, index } = whoItsFor

  return (
    <>
      <PageIntro eyebrow={whoItsFor.eyebrow} title={whoItsFor.title} lede={whoItsFor.lede} />

      <section className="industries" aria-label={index.label}>
        <div className="wrap">
          <IndustryIndex industries={industries} label={index.label} go={industryPage.related.go} moment={index.moment} />
          <p className="industries__note">{index.note}</p>
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={closing.title}
        body={closing.body}
        cta={closing.cta}
      />

      <p className="big-word big-word--end wrap" aria-hidden="true" data-reveal>
        {whoItsFor.word}
      </p>
    </>
  )
}
