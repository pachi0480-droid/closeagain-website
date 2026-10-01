import type { Metadata } from 'next'
import { Trail } from '@/components/art/Trail'
import { ClosingCta, PageIntro } from '@/components/editorial/blocks'
import { JourneyMoment } from '@/components/moments/Moments'
import { Control } from '@/components/home/Control'
import { ProductPreview } from '@/components/previews/Previews'
import { howItWorks } from '@/content/pages'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: howItWorks.meta.title,
  description: howItWorks.meta.description,
  path: '/how-it-works',
})

/**
 * Six steps, each beside the part of the product that does it: a lead's path through CloseAgain, each
 * step labelled with who does the work — CloseAgain automatically, or the
 * customer's own team.
 */
export default function HowItWorksPage() {
  const { steps, closing } = howItWorks

  return (
    <>
      <PageIntro eyebrow={howItWorks.eyebrow} title={howItWorks.title} lede={howItWorks.lede} visual={<JourneyMoment />} />

      <section className="trail-section" aria-label="How CloseAgain works, step by step">
        <div className="wrap">
          <Trail
            label="Six steps"
            items={steps.map((step, i) => ({
              key: step.number,
              copy: (
                <>
                  <span className="trail__num" aria-hidden="true">
                    {step.number}
                  </span>
                  <p className={['trail__who', step.who === 'Your team' && 'trail__who--team'].filter(Boolean).join(' ')}>
                    {step.who}
                  </p>
                  <h2 className="trail__title">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h2>
                  <p className="trail__body">{step.body}</p>
                </>
              ),
              visual: <ProductPreview kind={step.preview} />,
            }))}
          />
        </div>
      </section>

      <Control />

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
