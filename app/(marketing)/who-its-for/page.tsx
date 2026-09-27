import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { Arrow } from '@/components/ui/links'
import { whoItsFor } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: whoItsFor.meta.title,
  description: whoItsFor.meta.description,
  path: '/who-its-for',
})

/**
 * Who CloseAgain suits — and who it doesn't — then eight kinds of
 * lead-driven business, each with the inquiries it typically gets and what
 * CloseAgain follows up on for new and older leads. Each card opens the
 * inquiry form with that industry already chosen.
 */
export default function WhoItsForPage() {
  const { fit, industries, labels, closing } = whoItsFor

  return (
    <>
      <PageIntro eyebrow={whoItsFor.eyebrow} title={whoItsFor.title} lede={whoItsFor.lede} />

      <section className="fit" aria-label="Is CloseAgain a fit?">
        <div className="wrap fit__grid">
          {[fit.good, fit.not].map((list, i) => (
            <div key={list.title} className={['fit__col', i === 1 && 'fit__col--not'].filter(Boolean).join(' ')}>
              <h2 className="fit__title">{list.title}</h2>
              <ul className="fit__list">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="industries" aria-labelledby="industries-title">
        <div className="wrap">
          <h2 id="industries-title" className="industries__title">
            What CloseAgain follows up on, by industry
          </h2>
          <ul className="industries__grid">
            {industries.map((industry, i) => (
              <li
                key={industry.id}
                className="industry"
                data-reveal
                style={{ '--reveal-delay': `${(i % 4) * 70}ms` } as CSSProperties}
              >
                <span className="industry__media">
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="(min-width: 1180px) 300px, (min-width: 560px) 45vw, 92vw"
                    className="industry__image"
                    loading={i < 4 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                  />
                </span>
                <div className="industry__text">
                  <h3 className="industry__name">{industry.name}</h3>
                  <dl className="industry__facts">
                    <div>
                      <dt>{labels.leads}</dt>
                      <dd>{industry.leads}</dd>
                    </div>
                    <div>
                      <dt>{labels.fresh}</dt>
                      <dd>{industry.fresh}</dd>
                    </div>
                    <div>
                      <dt>{labels.older}</dt>
                      <dd>{industry.older}</dd>
                    </div>
                  </dl>
                  <Link href={`/contact?industry=${encodeURIComponent(industry.formValue)}`} className="industry__go">
                    <span>
                      Talk to us<span className="sr-only"> about {industry.name.toLowerCase()}</span>
                    </span>
                    <Arrow />
                  </Link>
                </div>
              </li>
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
