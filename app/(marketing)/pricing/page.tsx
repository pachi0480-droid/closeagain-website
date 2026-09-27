import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { ClosingCta } from '@/components/editorial/blocks'
import { Accordion } from '@/components/editorial/Accordion'
import { BreakEven } from '@/components/pricing/BreakEven'
import { CompareMatrix, PlanCards } from '@/components/pricing/Plans'
import { faqByIds, pricingPage } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: pricingPage.meta.title,
  description: pricingPage.meta.description,
  path: '/pricing',
})

/**
 * Four plans, compared honestly. What every plan shares is said once; each
 * card leads with who it suits and what it adds; the details that depend on
 * the business are named as part of the proposal rather than invented; and
 * a break-even check lets visitors weigh the price against their own numbers.
 * Every price comes from content/pricing.ts.
 */
export default function PricingPage() {
  const { title, lede, common, proposal, compare, value, questions, closing } = pricingPage

  return (
    <>
      <header className="intro intro--pricing">
        <div className="intro__inner wrap">
          <p className="eyebrow">{pricingPage.eyebrow}</p>
          <h1 id="page-title" className="intro__title">
            {title.map((line) => (
              <span key={line} className="intro__line">
                {line}{' '}
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

          <div className="pricing__proposal">
            <h3 className="pricing__proposal-title">{proposal.title}</h3>
            <p className="pricing__proposal-body">{proposal.body}</p>
            <ul className="pricing__proposal-list">
              {proposal.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

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
        art={<ClosingRibbon id="pricing-closing" />}
      />
    </>
  )
}
