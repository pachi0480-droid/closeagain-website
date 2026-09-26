import type { Metadata } from 'next'
import { Bubble } from '@/components/art/Bubble'
import { Ribbon } from '@/components/art/Ribbon'
import { returnLoopCompact, returnLoopWide } from '@/components/art/ribbons'
import { ClosingCta, NumberedRows, PageIntro } from '@/components/editorial/blocks'
import { whoItsFor } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: whoItsFor.meta.title,
  description: whoItsFor.meta.description,
  path: '/who-its-for',
})

export default function WhoItsForPage() {
  return (
    <>
      <PageIntro eyebrow={whoItsFor.eyebrow} title={whoItsFor.title} lede={whoItsFor.lede} />

      <div className="loop-art" aria-hidden="true">
        <Ribbon
          id="return-loop"
          className="loop-art__svg loop-art__svg--wide"
          viewBox={returnLoopWide.viewBox}
          spec={returnLoopWide.spec}
          draw="scroll"
        />
        <Ribbon
          id="return-loop-compact"
          className="loop-art__svg loop-art__svg--compact"
          viewBox={returnLoopCompact.viewBox}
          spec={returnLoopCompact.spec}
          draw="scroll"
        />
      </div>

      <section className="section section--flush-top" aria-label="Conversations worth restarting">
        <div className="wrap">
          <NumberedRows
            headingLevel="h2"
            className="rows--audience"
            items={whoItsFor.rows.map((row) => ({
              number: row.number,
              title: row.title,
              body: row.body,
              aside: (
                <Bubble tone={row.number === '03' ? 'reply' : 'ask'} className="bubble--quiet">
                  {row.detail}
                </Bubble>
              ),
            }))}
          />
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={whoItsFor.closing.title}
        body={whoItsFor.closing.body}
        cta={whoItsFor.closing.cta}
      />

      <p className="big-word big-word--end wrap" aria-hidden="true" data-reveal>
        {whoItsFor.word}
      </p>
    </>
  )
}
