import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { PlanGrid } from '@/components/pricing/PlanGrid'
import { chapter, cta } from '@/data/site'

/**
 * Chapter eight — what it costs, and what happens first.
 *
 * A compact dark comparison with one recommended plan, then the offer that
 * actually starts the relationship: a Revenue Gap Audit. Plans are monthly,
 * per business, and the only numbers here are the ones in `data/pricing`.
 */

const audit = [
  'Map lead sources',
  'Review response speed',
  'Identify follow-up gaps',
  'Find recoverable opportunities',
  'Prioritize the highest-value next actions',
  'Define the required implementation scope',
]

export function Offer() {
  return (
    <section
      id={chapter.pricing}
      className="relative scroll-mt-24 border-t border-rule bg-void py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMark index="08" label="Plans" />
              <h2 className="mt-6 max-w-[20ch] text-h2 font-semibold uppercase text-warm-white">
                Priced by how much of the lifecycle we work.
              </h2>
            </div>
            <p className="max-w-[36ch] text-lede text-muted">
              Monthly, per business. No annual lock-in, and no metered message
              counts.
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------- plans */}
        <Reveal delay={100} className="mt-12">
          <PlanGrid />
        </Reveal>

        {/* ------------------------------------------------- the audit */}
        <Reveal delay={120} className="mt-14">
          <div className="stage grid gap-px lg:grid-cols-12">
            <div className="bg-graphite p-7 lg:col-span-5 lg:p-9">
              <p className="font-mono text-mono-xs uppercase text-signal">
                Start here
              </p>
              <h3 className="mt-4 text-h3 text-warm-white">Revenue Gap Audit</h3>
              <p className="mt-4 max-w-[40ch] text-[0.9375rem] leading-relaxed text-muted">
                Before anyone talks about a plan, we look at how opportunities
                actually move through your business — and what is already
                recoverable.
              </p>
              <ButtonLink href={cta.target} size="lg" withArrow className="mt-7">
                {cta.primary}
              </ButtonLink>
            </div>

            <div className="bg-graphite-deep p-7 lg:col-span-7 lg:p-9">
              <p className="font-mono text-mono-xs uppercase text-secondary">
                What the audit covers
              </p>
              <ol className="mt-5 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {audit.map((item, i) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span className="tnum shrink-0 font-mono text-mono-xs text-secondary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.9375rem] leading-snug text-warm-white">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
