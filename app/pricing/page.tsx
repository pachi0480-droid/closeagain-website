import type { Metadata } from 'next'
import { PageIntro } from '@/components/editorial/blocks'
import { WordSplit } from '@/components/editorial/WordSplit'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { pricing } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: pricing.meta.title,
  description: pricing.meta.description,
  path: '/pricing',
})

/**
 * No prices exist yet, so this page offers a conversation instead of tiers.
 * When pricing is approved, fill `pricing.offer.details` in content/pages.ts
 * and set its status to 'published'.
 */
export default function PricingPage() {
  const { offer, clarity } = pricing

  return (
    <>
      <PageIntro eyebrow={pricing.eyebrow} title={pricing.title} lede={pricing.lede} />

      <section className="offer-section" aria-labelledby="offer-title">
        <div className="wrap">
          <div className="offer" data-reveal>
            <div className="offer__lead">
              <h2 id="offer-title" className="offer__title">
                {offer.title}
              </h2>
              <p className="offer__body">{offer.body}</p>
              <div className="offer__actions">
                <ButtonLink href={offer.cta.href} size="lg">
                  {offer.cta.label}
                </ButtonLink>
              </div>
              {offer.status === 'unconfirmed' ? (
                <p className="offer__note">
                  <span className="offer__note-mark" aria-hidden="true" />
                  {offer.note}
                </p>
              ) : (
                <ul className="offer__details">
                  {offer.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>

            <dl className="offer__rows">
              {offer.rows.map((row) => (
                <div key={row.title} className="offer__row">
                  <dt className="offer__row-title">{row.title}</dt>
                  <dd className="offer__row-body">{row.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <WordSplit word={clarity.word} heading={clarity.title} id="clarity" className="word-split--page">
        <p>{clarity.body}</p>
        <p className="word-split__link">
          <TextLink href="/faq" arrow>
            Read the questions
          </TextLink>
        </p>
      </WordSplit>
    </>
  )
}
