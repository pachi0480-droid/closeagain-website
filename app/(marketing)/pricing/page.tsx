import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { ClosingCta } from '@/components/editorial/blocks'
import { Accordion } from '@/components/editorial/Accordion'
import { Words, wordCount } from '@/components/editorial/Words'
import { BreakEven } from '@/components/pricing/BreakEven'
import { CompareMatrix, PlanCards } from '@/components/pricing/Plans'
import { TierSystem } from '@/components/pricing/TierSystem'
import { faqByIds, pricingPage } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: pricingPage.meta.title,
  description: pricingPage.meta.description,
  path: '/pricing',
})

/**
 * Four plans, easy to tell apart. What every plan shares is said once; each
 * card leads with who it is for and its headline facts; the full comparison
 * opens in place; and a break-even check lets visitors weigh the price
 * against their own numbers. Every price comes from content/pricing.ts.
 */
export default function PricingPage() {
  const { title, lede, common, proposal, compare, value, questions, closing } = pricingPage

  return (
    <>
      <header className="intro intro--pricing">
        <div className="intro__inner wrap">
          <p className="eyebrow">{pricingPage.eyebrow}</p>
          <h1 id="page-title" className="intro__title">
            {title.map((line, i) => (
              <span key={line} className="intro__line">
                <Words text={line} start={title.slice(0, i).reduce((sum, before) => sum + wordCount(before), 0)} />{' '}
              </span>
            ))}
          </h1>
          <p className="intro__lede">{lede}</p>
        </div>
      </header>

      <section className="pricing" aria-labelledby="plans-title">
        <div className="wrap">
          <h2 id="plans-title" className="sr-only">
            Plans
          </h2>

          <TierSystem>
            <div className="pricing__common">
              <p className="pricing__common-title">{common.title}</p>
              <ul className="pricing__common-list">
                {common.items.map((item) => (
                  <li key={item}>
                    <Check size={15} strokeWidth={2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <PlanCards />
          </TierSystem>

          <p className="pricing__decision-note">{proposal}</p>

          <CompareMatrix openLabel={compare.open} closeLabel={compare.close} />

        </div>
      </section>

      <section className="section value" aria-labelledby="value-title">
        <div className="wrap value__inner">
          <div className="value__copy">
            <p className="eyebrow">{value.eyebrow}</p>
            <h2 id="value-title" className="section__title value__title">
              {value.title}
            </h2>
            <p className="value__body">{value.body}</p>
          </div>
          <BreakEven />
        </div>
      </section>

      <section className="section" aria-labelledby="pricing-questions-title">
        <div className="wrap home-questions__inner">
          <div className="home-questions__head">
            <p className="eyebrow">{questions.eyebrow}</p>
            <h2 id="pricing-questions-title" className="section__title">
              {questions.title}
            </h2>
          </div>
          <Accordion items={faqByIds(questions.ids)} headingLevel="h3" />
        </div>
      </section>

      <ClosingCta
        id="closing-title"
        title={closing.title}
        body={closing.body}
        cta={closing.cta}
        secondary={closing.secondary}
      />
    </>
  )
}
