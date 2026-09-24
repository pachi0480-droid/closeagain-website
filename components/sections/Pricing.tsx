import Link from 'next/link'
import { PlanSlab } from '@/components/pricing/PlanSlab'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

/**
 * Monthly only — there is no annual toggle and no annual discount to hunt for.
 * The full capability breakdown lives on /pricing; this is the commercial beat
 * of the homepage narrative, not the reference page.
 */
export function Pricing() {
  return (
    <section id="pricing" className="grain-ink relative bg-ink-raise py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionMark index="10" label="Pricing" />
              <h2 className="mt-7 max-w-[18ch] text-h2 text-chalk">
                Monthly pricing. Nothing to unpick.
              </h2>
            </Reveal>
          </div>
          <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <Reveal delay={140}>
              <p className="max-w-[40ch] text-[1.0625rem] leading-relaxed text-chalk-2">
                Plans differ by how much of the lead lifecycle CloseAgain is
                recovering — not by how many messages you are rationed.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={100} className="mt-14 md:mt-16">
          <PlanSlab />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-mono text-mono-xs text-chalk-3 uppercase">
              Monthly · no annual contract · no annual pricing
            </p>
            <Link href="/pricing" className="link-rule text-[0.9375rem] text-chalk">
              Compare what each plan covers
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
