import type { Metadata } from 'next'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { ClosingCta, Trio } from '@/components/editorial/blocks'
import { CompareMatrix, PlanCards } from '@/components/pricing/Plans'
import { pricingPage } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: pricingPage.meta.title,
  description: pricingPage.meta.description,
  path: '/pricing',
})

/** Four plans, one comparison, no tricks: prices come from content/pricing.ts. */
export default function PricingPage() {
  const { title, lede, compare, reassurance, closing } = pricingPage

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
          <PlanCards />
          <CompareMatrix openLabel={compare.open} closeLabel={compare.close} />
        </div>
      </section>

      <section className="section section--ruled" aria-label="Good to know">
        <div className="wrap">
          <Trio items={reassurance} />
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
