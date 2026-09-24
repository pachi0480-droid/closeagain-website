'use client'

import { HeroStage } from '@/components/visuals/HeroStage'
import { RecoveryRail } from '@/components/visuals/RecoveryRail'
import { SignalField } from '@/components/visuals/SignalField'
import { usePointerDepth } from '@/components/visuals/usePointerDepth'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/Type'
import { heroBeats, heroWaypointForStep } from '@/data/scenarios'
import { cta, site } from '@/data/site'
import { trackOnce } from '@/lib/analytics'
import { usePrefersReducedMotion, useSequence } from '@/lib/hooks'

/*
 * Counts derived from imported data live inside the component, never at module
 * scope: an imported binding read while a client module is still initialising
 * throws at runtime while compiling cleanly, so the build passes and the page
 * dies. This bit the Multiply bridge once already.
 */

/**
 * The hero is one scene, not a headline beside a screenshot.
 *
 * A single opportunity enters at 6:42 PM, stalls when nobody answers,
 * is intercepted, and completes its path to a booked window. The stage shows
 * the conversation; the full-bleed rail beneath shows the journey, including
 * the break that CloseAgain bridges. Both are driven by one state machine, so
 * the two halves of the scene can never disagree.
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

  return (
    <section
      ref={ref}
      className="grain lit-warm relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-bone pb-12 md:pb-14"
    >
      {/* --- the live business, behind everything -------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="field-grid absolute inset-0 opacity-60"
          style={{
            maskImage: 'radial-gradient(130% 95% at 60% 12%, #000 0%, transparent 74%)',
            WebkitMaskImage:
              'radial-gradient(130% 95% at 60% 12%, #000 0%, transparent 74%)',
          }}
        />
        {/* architectural verticals: the structure the scene is built on */}
        <div className="absolute inset-0 hidden lg:block">
          {[18, 42, 66, 84].map((x) => (
            <span
              key={x}
              className="absolute inset-y-0 w-px bg-graphite/[0.045]"
              style={{ left: `${x}%` }}
            />
          ))}
        </div>
        <SignalField className="hidden opacity-90 md:block" />
      </div>

      <div ref={scene} className="relative">
        <div className="shell pt-28 md:pt-32 lg:pt-36">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-8">
            {/* --- the claim ---------------------------------------- */}
            <div className="lg:col-span-7">
              <Reveal y={12}>
                <Eyebrow>{site.category}</Eyebrow>
              </Reveal>

              <Reveal delay={90} y={20}>
                <h1 className="mt-6 text-display text-graphite">
                  Recover the leads you already paid for.
                </h1>
              </Reveal>

              <Reveal delay={190} y={16}>
                <p className="mt-7 max-w-[42ch] text-lede text-graphite-2">
                  Every lead you buy is already moving — toward a booked job, or
                  toward gone. CloseAgain works the moment it starts going the
                  wrong way.
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

            {/* --- the scene, running off the right edge ------------ */}
            <div className="lg:col-span-5 lg:bleed-right lg:pl-4">
              <Reveal delay={240} y={26}>
                <HeroStage step={step} />
              </Reveal>
            </div>
          </div>
        </div>

        {/* --- the journey, full width -------------------------------- */}
        <div className="mt-14 md:mt-16">
          <div className="w-full px-5 md:px-10 lg:px-14">
            <RecoveryRail waypoint={waypoint} />
          </div>
        </div>
      </div>
    </section>
  )
}
