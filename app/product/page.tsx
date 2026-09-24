import type { Metadata } from 'next'
import { CapabilityDetail } from '@/components/product/CapabilityDetail'
import { LifecycleMap } from '@/components/product/LifecycleMap'
import { PageIntro } from '@/components/layout/PageIntro'
import { RecoveryFeed } from '@/components/recovery/RecoveryFeed'
import { EarlyAccess } from '@/components/sections/EarlyAccess'
import { Integrations } from '@/components/sections/Integrations'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { capabilities } from '@/data/capabilities'
import { cta } from '@/data/site'

export const metadata: Metadata = {
  title: 'Product',
  description:
    'One recovery engine across the whole lead lifecycle: missed calls, slow lead response, cold estimates, no-shows and dormant leads — with the recovery attributed so you can see what came back.',
  alternates: { canonical: '/product' },
  openGraph: {
    title: 'Product — CloseAgain',
    description:
      'One recovery engine across the whole lead lifecycle, with every recovery attributed to the moment it was slipping.',
    url: '/product',
  },
}

export default function ProductPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product"
        title="One recovery engine. Every place revenue slips."
        lede="Six capabilities, one system. They share the same conversation, the same booking path and the same record, so a recovered lead does not arrive at your office as a mystery."
        aside={
          <ButtonLink href={cta.target} withArrow>
            {cta.primary}
          </ButtonLink>
        }
      />

      {/* --- what it covers, in one picture --------------------------- */}
      <section className="grain relative bg-paper pb-24 md:pb-28">
        <div className="shell">
          <Reveal>
            <SectionMark index="01" label="Coverage" />
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <LifecycleMap />
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 max-w-[62ch] text-[0.9375rem] leading-relaxed text-graphite-2">
              Most tools pick one moment in this path. The reason CloseAgain
              covers the whole thing is that revenue does not leak in one place
              — it leaks at whichever point your team happens to be busiest.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --- the capabilities, one at a time -------------------------- */}
      <section className="grain relative bg-bone pt-20 pb-6 md:pt-24">
        <div className="shell">
          <Reveal>
            <SectionMark index="02" label="Capabilities" />
            <h2 className="mt-7 max-w-[22ch] text-h2 text-graphite">
              What each part actually does.
            </h2>
          </Reveal>
        </div>
      </section>

      {capabilities.map((capability, i) => (
        <CapabilityDetail
          key={capability.id}
          capability={capability}
          tone={i % 2 === 0 ? 'bone' : 'paper'}
        />
      ))}

      {/* --- the operational view ------------------------------------- */}
      <section className="grain relative bg-limestone/70 py-24 md:py-28">
        <div className="shell">
          <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
            <div className="lg:col-span-6">
              <Reveal>
                <SectionMark index="04" label="Recovery feed" />
                <h2 className="mt-7 max-w-[20ch] text-h2 text-graphite">
                  Every recovery is a record you can read.
                </h2>
              </Reveal>
            </div>
            <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0">
              <Reveal delay={140}>
                <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-graphite-2">
                  The same four moments from the homepage, in the view your
                  office would work from. Timestamps, what was said, and where
                  the opportunity ended up.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal delay={120} className="mt-14 md:mt-16">
            <RecoveryFeed />
          </Reveal>
        </div>
      </section>

      <Integrations />
      <EarlyAccess />
    </>
  )
}
