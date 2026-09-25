import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { PlanGrid } from '@/components/pricing/PlanGrid'
import { PlanMatrix } from '@/components/pricing/PlanMatrix'
import { PricingQuestions } from '@/components/pricing/PricingQuestions'
import { AuditForm } from '@/components/sections/AuditForm'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { cta } from '@/data/site'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Monthly, per business. Plans differ by how much of the lead lifecycle CloseAgain is working — not by metered message counts.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — CloseAgain',
    description:
      'Monthly, per business. Plans differ by how much of the lifecycle CloseAgain is working.',
    url: '/pricing',
  },
}

export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Priced by how much of the lifecycle we work."
        lede="Monthly, per business. No annual plan, no annual discount, and no metered message counts."
        aside={
          <ButtonLink href={cta.target} withArrow>
            {cta.primary}
          </ButtonLink>
        }
      />

      <section className="border-t border-rule bg-void py-20 md:py-24">
        <div className="shell-wide">
          <Reveal>
            <PlanGrid />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-rule bg-graphite-deep py-20 md:py-24">
        <div className="shell-wide">
          <Reveal>
            <SectionMark index="02" label="What each plan covers" />
            <h2 className="mt-6 max-w-[24ch] text-h2 font-semibold uppercase text-warm-white">
              The whole breakdown.
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <PlanMatrix />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-rule bg-void py-20 md:py-24">
        <div className="shell-narrow">
          <Reveal>
            <SectionMark index="03" label="Questions" />
            <h2 className="mt-6 max-w-[24ch] text-h2 font-semibold uppercase text-warm-white">
              Before you ask.
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <PricingQuestions />
          </Reveal>
        </div>
      </section>

      <AuditForm />
    </>
  )
}
