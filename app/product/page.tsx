import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { Capabilities } from '@/components/product/Capabilities'
import { AuditForm } from '@/components/sections/AuditForm'
import { CommandCenter } from '@/components/sections/CommandCenter'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { compatibility } from '@/data/industries'
import { cta } from '@/data/site'

export const metadata: Metadata = {
  title: 'Product',
  description:
    'One system across the whole lifecycle: new inquiries, missed calls, slow response, cold estimates, no-shows and dormant leads — each with a next action and a path to booked work.',
  alternates: { canonical: '/product' },
  openGraph: {
    title: 'Product — CloseAgain',
    description:
      'One system across the whole lifecycle, with every opportunity carrying its own next action.',
    url: '/product',
  },
}

export default function ProductPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product"
        title="One system. Every place demand stalls."
        lede="The capabilities share the same conversation, the same booking path and the same record, so a recovered opportunity does not arrive at your office as a mystery."
        aside={
          <ButtonLink href={cta.target} withArrow>
            {cta.primary}
          </ButtonLink>
        }
      />

      <section className="border-t border-rule bg-void py-20 md:py-24">
        <div className="shell-wide">
          <Reveal>
            <SectionMark index="01" label="Capabilities" />
            <h2 className="mt-6 max-w-[24ch] text-h2 font-semibold uppercase text-warm-white">
              What each part actually does.
            </h2>
          </Reveal>

          <div className="mt-12">
            <Capabilities />
          </div>

          <Reveal delay={80}>
            <p className="mt-10 max-w-[64ch] text-[0.9375rem] leading-relaxed text-muted">
              Most tools pick one moment in this path. CloseAgain covers the
              whole thing because demand does not stall in one place — it
              stalls at whichever point your team happens to be busiest.
            </p>
            <p className="mt-4 max-w-[64ch] text-[0.9375rem] leading-relaxed text-secondary">
              {compatibility}
            </p>
          </Reveal>
        </div>
      </section>

      <CommandCenter />
      <AuditForm />
    </>
  )
}
