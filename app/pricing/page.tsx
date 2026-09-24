import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { PlanMatrix } from '@/components/pricing/PlanMatrix'
import { PlanSlab } from '@/components/pricing/PlanSlab'
import { PricingQuestions } from '@/components/pricing/PricingQuestions'
import { EarlyAccess } from '@/components/sections/EarlyAccess'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Monthly pricing from $499. Plans differ by how much of the lead lifecycle CloseAgain is recovering — no annual commitment, no annual pricing, no usage caps.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — CloseAgain',
    description:
      'Monthly plans from $499. No annual commitment, no annual pricing, no usage caps.',
    url: '/pricing',
  },
}

export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Monthly pricing. Nothing to unpick."
        lede="Four plans, one engine. What changes between them is how much of the lead lifecycle is being recovered — not how many messages you are rationed."
        aside={
          <ButtonLink href="/calculator" variant="secondary">
            Size the opportunity first
          </ButtonLink>
        }
      />

      <section className="grain relative bg-paper pb-20 md:pb-24">
        <div className="shell">
          <Reveal>
            <PlanSlab />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-mono-xs text-graphite-3 uppercase">
                Monthly · no annual contract · no annual pricing
              </p>
              <p className="font-mono text-mono-xs text-graphite-3 uppercase">
                Pre-launch · pilot terms confirmed in writing before setup
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- the full breakdown --------------------------------------- */}
      <section className="grain relative bg-bone py-24 md:py-28">
        <div className="shell">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionMark index="01" label="What you get" />
                <h2 className="mt-7 max-w-[18ch] text-h2 text-graphite">
                  What each plan actually covers.
                </h2>
              </Reveal>
            </div>
            <div className="mt-8 lg:col-span-6 lg:col-start-7 lg:mt-2">
              <Reveal delay={140}>
                <p className="max-w-[46ch] text-lede text-graphite-2">
                  There are no message, minute or seat counts in this table.
                  Those numbers do not exist yet, and inventing them would be
                  the fastest way to mislead an operator about what they are
                  buying.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={100} className="mt-14 md:mt-16">
            <PlanMatrix />
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-10 max-w-[62ch] text-[0.9375rem] leading-relaxed text-graphite-2">
              CloseAgain is pre-launch, so the depth of each capability is being
              set with pilot operators. If any of this changes before launch it
              gets changed on this page, not in a footnote.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --- pricing questions --------------------------------------- */}
      <section className="grain relative bg-paper py-24 md:py-28">
        <div className="shell">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionMark index="02" label="Questions" />
                <h2 className="mt-7 max-w-[14ch] text-h2 text-graphite">
                  On the money side.
                </h2>
              </Reveal>
            </div>
            <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <PricingQuestions />
            </div>
          </div>
        </div>
      </section>

      <EarlyAccess />
    </>
  )
}
