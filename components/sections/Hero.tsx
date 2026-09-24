'use client'

import { HeroStage } from '@/components/visuals/HeroStage'
import { RecoveryPulse } from '@/components/visuals/RecoveryPulse'
import { RecoveryRail } from '@/components/visuals/RecoveryRail'
import { SignalField } from '@/components/visuals/SignalField'
import { usePointerDepth } from '@/components/visuals/usePointerDepth'
import { ButtonLink } from '@/components/ui/Button'
import { Illustrative } from '@/components/ui/Disclaimer'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'
import { heroBeats, heroWaypointForStep } from '@/data/scenarios'
import { cta, site } from '@/data/site'
import { trackOnce } from '@/lib/analytics'
import { usePrefersReducedMotion, useSequence } from '@/lib/hooks'

/*
 * Counts derived from imported data live inside the component, never at module
 * scope: an imported binding read while a client module is still initialising
 * throws at runtime while compiling cleanly.
 */

/**
 * The hero is the product surface, and the argument is written on it.
 *
 * Not a headline beside a screenshot: one large lifted panel fills the
 * viewport, the opportunity header runs across its top, the claim is set
 * inside it at display size, the live sequence occupies the right of the same
 * surface, and the rail and outcome close it along the bottom. The marketing
 * copy lives inside the operational UI because that is the claim — this is
 * what the thing is, not a picture of it.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion()
  const scene = usePointerDepth<HTMLDivElement>()
  const total = heroBeats.length
  const { ref, step } = useSequence(total, {
    stepMs: 1150,
    holdMs: 5200,
    enabled: !reduced,
    onComplete: () => trackOnce('hero_sequence_completed'),
  })

  const waypoint = heroWaypointForStep[Math.min(step, total)]
  const recovered = step >= total

  return (
    <section
      ref={ref}
      className="grain-ink relative isolate overflow-hidden bg-ink pt-24 pb-10 md:pt-28 md:pb-14"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="field-grid-ink absolute inset-0 opacity-70"
          style={{
            maskImage: 'radial-gradient(120% 90% at 50% 8%, #000 0%, transparent 74%)',
            WebkitMaskImage:
              'radial-gradient(120% 90% at 50% 8%, #000 0%, transparent 74%)',
          }}
        />
        <SignalField className="hidden md:block" />
      </div>

      <div ref={scene} className="shell">
        <Reveal y={20}>
          <div
            className="stage-ink depth-layer relative overflow-hidden rounded-[20px] text-chalk"
            style={{ '--depth': '6px' } as React.CSSProperties}
          >
            {/* recovery is a change of light across the whole surface */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] [transition-timing-function:var(--ease-out-quiet)]"
              style={{
                opacity: recovered ? 1 : 0,
                background:
                  'radial-gradient(70% 55% at 76% 104%, color-mix(in oklab, var(--color-recover) 30%, transparent), transparent 72%)',
              }}
            />

            {/* --- the opportunity, across the top ------------------- */}
            <header className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-rule-ink px-6 py-4 sm:px-9">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <Eyebrow tone="ink">Opportunity</Eyebrow>
                <span className="text-[0.9375rem] text-chalk">
                  Inbound call · AC not cooling
                </span>
                <span className="tnum font-mono text-mono-sm text-chalk-3">
                  (352) 555-0148 · Google LSA
                </span>
              </div>
              <span className="tnum font-mono text-mono-sm text-chalk-2">
                Fri 6:42 PM
              </span>
            </header>

            {/* --- the claim, written on the surface ---------------- */}
            <div className="relative grid gap-x-10 gap-y-12 px-6 py-9 sm:px-9 lg:grid-cols-12 lg:py-12">
              <div className="lg:col-span-8">
                <Eyebrow tone="ink">{site.category}</Eyebrow>

                <h1 className="mt-5 max-w-[16ch] text-display text-chalk">
                  Recover the leads you already paid for.
                </h1>

                <p className="mt-7 max-w-[44ch] text-lede text-chalk-2">
                  Every lead you buy is already moving — toward a booked job, or
                  toward gone. CloseAgain works the moment it starts going the
                  wrong way.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href={cta.target} size="lg" withArrow>
                    {cta.primary}
                  </ButtonLink>
                  <ButtonLink href="#leak" size="lg" variant="secondary">
                    {cta.leak}
                  </ButtonLink>
                </div>

                <p className="mt-8 flex items-center gap-2.5 font-mono text-mono-xs text-chalk-3 uppercase">
                  <span
                    className="status-dot bg-recover-bright text-recover-bright"
                    data-pulse="true"
                  />
                  Pre-launch · accepting pilot interest
                </p>
              </div>

              {/* --- the same opportunity, moving -------------------- */}
              <div className="lg:col-span-4 lg:border-l lg:border-rule-ink lg:pl-8">
                <HeroStage step={step} />
              </div>
            </div>

            {/* --- the journey and its outcome, closing the panel --- */}
            <footer className="relative border-t border-rule-ink px-6 pt-7 pb-6 sm:px-9">
              <RecoveryRail waypoint={waypoint} />

              <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                <div className="relative">
                  <RecoveryPulse fire={recovered} />
                  <p
                    className={`relative font-mono text-mono-xs uppercase transition-colors duration-700 ${
                      recovered ? 'text-recover-bright' : 'text-chalk-3'
                    }`}
                  >
                    {recovered ? 'Opportunity recovered' : 'Awaiting outcome'}
                  </p>
                  <p
                    className={`relative mt-2 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-none font-semibold tracking-[-0.03em] transition-colors duration-700 ${
                      recovered ? 'text-chalk' : 'text-chalk-3/60'
                    }`}
                  >
                    {recovered ? 'Tomorrow · 9:00–11:00 AM' : 'Pending'}
                  </p>
                </div>

                <span
                  className="rounded-[7px] border px-3 py-2 font-mono text-mono-xs uppercase transition-all duration-700"
                  style={{
                    borderColor: recovered
                      ? 'color-mix(in oklab, var(--color-recover-bright) 45%, transparent)'
                      : 'var(--color-rule-ink)',
                    color: recovered
                      ? 'var(--color-recover-bright)'
                      : 'var(--color-chalk-3)',
                    backgroundColor: recovered
                      ? 'color-mix(in oklab, var(--color-recover) 16%, transparent)'
                      : 'transparent',
                  }}
                >
                  {recovered ? 'Diagnostic booked' : 'No outcome'}
                </span>
              </div>
            </footer>
          </div>
        </Reveal>

        <Illustrative className="mt-4">Illustrative product view</Illustrative>
      </div>
    </section>
  )
}
