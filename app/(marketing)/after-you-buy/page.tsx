import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { RibbonBand } from '@/components/art/Ribbon'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { afterYouBuy } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: afterYouBuy.meta.title,
  description: afterYouBuy.meta.description,
  path: '/after-you-buy',
})

/** Six plain steps from choosing a plan to going live. */
export default function AfterYouBuyPage() {
  const { steps, included, timing, closing } = afterYouBuy

  return (
    <>
      <PageIntro eyebrow={afterYouBuy.eyebrow} title={afterYouBuy.title} lede={afterYouBuy.lede} />

      <section className="onboarding" aria-labelledby="onboarding-title">
        <div className="wrap">
          <h2 id="onboarding-title" className="sr-only">
            Setup steps
          </h2>
          <div className="onboarding__track">
            <RibbonBand className="onboarding__band" />
            <ol className="onboarding__steps">
              {steps.map((step, i) => (
                <li
                  key={step.number}
                  className={['onboarding__step', i === steps.length - 1 && 'onboarding__step--live']
                    .filter(Boolean)
                    .join(' ')}
                  data-reveal
                  style={{ '--reveal-delay': `${(i % 3) * 90}ms` } as CSSProperties}
                >
                  <span className="onboarding__num" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="onboarding__title">{step.title}</h3>
                  <p className="onboarding__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="onboarding__notes">
            <p className="onboarding__included">{included}</p>
            <p className="onboarding__timing">{timing}</p>
          </div>
        </div>
      </section>

      <ClosingCta id="closing-title" title={closing.title} body={closing.body} cta={closing.cta} secondary={closing.secondary} />
    </>
  )
}
