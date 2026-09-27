import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { RibbonBand } from '@/components/art/Ribbon'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { gettingStarted } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: gettingStarted.meta.title,
  description: gettingStarted.meta.description,
  path: '/getting-started',
})

/**
 * The real sequence, in order: inquiry, fit and scope, approval of plan and
 * terms, setup, review, launch. Nothing here suggests a purchase has already
 * happened, and nothing promises a timeline.
 */
export default function GettingStartedPage() {
  const { steps, included, timing, needs, closing } = gettingStarted

  return (
    <>
      <PageIntro eyebrow={gettingStarted.eyebrow} title={gettingStarted.title} lede={gettingStarted.lede} />

      <section className="onboarding" aria-labelledby="onboarding-title">
        <div className="wrap">
          <h2 id="onboarding-title" className="sr-only">
            From inquiry to launch
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
                  style={{ '--reveal-delay': `${(i % 3) * 70}ms` } as CSSProperties}
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

          <div className="onboarding__needs">
            <h2 className="onboarding__needs-title">{needs.title}</h2>
            <ul className="onboarding__needs-list">
              {needs.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
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
