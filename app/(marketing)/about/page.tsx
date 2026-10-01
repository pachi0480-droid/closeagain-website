import type { Metadata } from 'next'
import Image from 'next/image'
import { ClosingCta, PageIntro, Trio } from '@/components/editorial/blocks'
import { WordSplit } from '@/components/editorial/WordSplit'
import { ComebackMoment } from '@/components/moments/Moments'
import { about } from '@/content/pages'
import { founder } from '@/content/people'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: about.meta.title,
  description: about.meta.description,
  path: '/about',
})

/** A short brand story — why CloseAgain exists — the person behind it once named, and nothing invented. */
export default function AboutPage() {
  const { statement, principles, closing } = about

  return (
    <>
      <PageIntro eyebrow={about.eyebrow} title={about.title} lede={about.lede} visual={<ComebackMoment />} />

      <hr className="rule" />

      <WordSplit word={statement.word} heading={statement.title} id="statement" className="word-split--page">
        {statement.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </WordSplit>

      <section className="section section--flush-top" aria-labelledby="principles-title">
        <div className="wrap">
          <h2 id="principles-title" className="sr-only">
            What CloseAgain does
          </h2>
          <Trio items={principles} />
        </div>
      </section>

      {/* A real person behind the product, once content/people.ts names them. */}
      {founder && (
        <section className="section founder" aria-labelledby="founder-title">
          <div className="wrap founder__inner">
            {founder.photo && (
              <Image className="founder__photo" src={founder.photo.src} alt={founder.photo.alt} width={320} height={320} />
            )}
            <div className="founder__copy">
              <p className="eyebrow">Who’s behind CloseAgain</p>
              <h2 id="founder-title" className="founder__name">
                {founder.name}
              </h2>
              <p className="founder__role">{founder.role}</p>
              {founder.story.map((paragraph) => (
                <p key={paragraph} className="founder__story">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <ClosingCta id="closing-title" title={closing.title} cta={closing.cta} />
    </>
  )
}
