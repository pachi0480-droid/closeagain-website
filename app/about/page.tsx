import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { ClosingCta, PageIntro, Trio } from '@/components/editorial/blocks'
import { WordSplit } from '@/components/editorial/WordSplit'
import { about } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: about.meta.title,
  description: about.meta.description,
  path: '/about',
})

export default function AboutPage() {
  const { statement, principles, closing } = about

  return (
    <>
      <PageIntro eyebrow={about.eyebrow} title={about.title} lede={about.lede} />

      <hr className="rule" />

      <WordSplit word={statement.word} heading={statement.title} id="statement" className="word-split--page">
        <p>{statement.body}</p>
      </WordSplit>

      <section className="section section--flush-top" aria-labelledby="principles-title">
        <div className="wrap">
          <h2 id="principles-title" className="sr-only">
            Principles
          </h2>
          <Trio items={principles} />
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={closing.title}
        cta={closing.cta}
        art={<ClosingRibbon id="about-closing" />}
      />
    </>
  )
}
