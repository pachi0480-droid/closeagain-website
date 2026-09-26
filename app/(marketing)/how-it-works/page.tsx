import type { Metadata } from 'next'
import { Bubble } from '@/components/art/Bubble'
import { ClosingRibbon } from '@/components/art/ClosingRibbon'
import { Ribbon } from '@/components/art/Ribbon'
import { stepReturnCompact, stepReturnWide } from '@/components/art/ribbons'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { howItWorks } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: howItWorks.meta.title,
  description: howItWorks.meta.description,
  path: '/how-it-works',
})

export default function HowItWorksPage() {
  const { steps } = howItWorks

  return (
    <>
      <PageIntro eyebrow={howItWorks.eyebrow} title={howItWorks.title} lede={howItWorks.lede} />

      <section className="steps" aria-label="Three steps">
        <ol className="steps__list wrap">
          {steps.map((step, i) => (
            <li key={step.number} className="step">
              <div className="step__inner" data-reveal>
                <span className="step__num" aria-hidden="true">
                  {step.number}
                </span>
                <div className="step__copy">
                  <h2 className="step__title">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h2>
                  <p className="step__body">{step.body}</p>
                </div>
                {step.example && (
                  <figure className="step__example">
                    <figcaption className="example-label">{howItWorks.exampleLabel}</figcaption>
                    <Bubble tone={step.example.from}>{step.example.text}</Bubble>
                  </figure>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="step-return" aria-hidden="true">
                  <Ribbon
                    id={`step-return-${i}`}
                    className="step-return__art step-return__art--wide"
                    viewBox={stepReturnWide.viewBox}
                    spec={stepReturnWide.spec}
                    draw="scroll"
                  />
                  <Ribbon
                    id={`step-return-compact-${i}`}
                    className="step-return__art step-return__art--compact"
                    viewBox={stepReturnCompact.viewBox}
                    spec={stepReturnCompact.spec}
                    draw="scroll"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <ClosingCta
        id="closing-title"
        title={howItWorks.closing.title}
        cta={howItWorks.closing.cta}
        art={<ClosingRibbon id="hiw-closing" />}
      />
    </>
  )
}
