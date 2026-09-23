import { RecoveryFeed } from '@/components/recovery/RecoveryFeed'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

export function ProductPreview() {
  return (
    <section className="grain relative bg-limestone/70 py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionMark index="05" label="Recovery feed" />
              <h2 className="mt-7 max-w-[20ch] text-h2 text-graphite">
                Every recovery is a record you can read.
              </h2>
            </Reveal>
          </div>
          <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <Reveal delay={140}>
              <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-graphite-2">
                Pick a moment. The feed shows what happened, in order, with the
                timestamps that matter — and what the opportunity looked like at
                the end of it.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120} className="mt-14 md:mt-16">
          <RecoveryFeed />
        </Reveal>
      </div>
    </section>
  )
}
