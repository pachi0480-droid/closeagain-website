import { HeroSequence } from '@/components/recovery/HeroSequence'
import { ButtonLink } from '@/components/ui/Button'
import { Illustrative } from '@/components/ui/Disclaimer'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'
import { cta, site } from '@/data/site'

export function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden bg-bone pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-[9.5rem] lg:pb-28">
      <HeroBackdrop />

      <div className="shell">
        <div className="grid items-start gap-10 md:gap-14 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-0">
          {/* --- the argument ----------------------------------------- */}
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <Eyebrow>{site.category}</Eyebrow>
            </Reveal>

            <Reveal delay={90} y={20}>
              <h1 className="mt-5 max-w-[20ch] text-display text-graphite">
                Recover the leads you already paid for.
              </h1>
            </Reveal>

            <Reveal delay={190} y={16}>
              <p className="mt-7 max-w-[46ch] text-lede text-graphite-2">
                CloseAgain works the moments between interest and booked revenue —
                the missed call, the slow reply, the estimate that went quiet — and
                is built to turn more of them back into jobs on the schedule.
              </p>
            </Reveal>

            <Reveal delay={280} y={14}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={cta.target} size="lg" withArrow>
                  {cta.primary}
                </ButtonLink>
                <ButtonLink href="#leak" size="lg" variant="secondary">
                  {cta.leak}
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={360} y={10}>
              <p className="mt-8 flex items-center gap-2.5 font-mono text-mono-xs text-graphite-3 uppercase">
                <span className="status-dot bg-recover text-recover" data-pulse="true" />
                Pre-launch · accepting pilot interest
              </p>
            </Reveal>
          </div>

          {/* --- the proof -------------------------------------------- */}
          <div className="lg:col-span-5 lg:pt-1">
            <Reveal delay={240} y={26}>
              <HeroSequence />
              <Illustrative className="mt-3.5 pl-0.5" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Environmental depth: a faint measured field, one soft warm light, and a
 * horizon line. No particles, no orbs, nothing floating.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="field-grid absolute inset-0 opacity-70"
        style={{
          maskImage:
            'radial-gradient(120% 90% at 62% 18%, #000 0%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(120% 90% at 62% 18%, #000 0%, transparent 72%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(85% 60% at 72% 8%, rgba(255,252,244,0.95) 0%, rgba(255,252,244,0) 60%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-56"
        style={{
          background:
            'linear-gradient(to bottom, rgba(242,238,231,0) 0%, var(--color-paper) 100%)',
        }}
      />
    </div>
  )
}
