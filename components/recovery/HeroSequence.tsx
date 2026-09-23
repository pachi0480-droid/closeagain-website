'use client'

import { StatusDot, stateText } from '@/components/ui/StatusDot'
import { heroScenario } from '@/data/scenarios'
import { trackOnce } from '@/lib/analytics'
import { usePrefersReducedMotion, useSequence } from '@/lib/hooks'

const events = heroScenario.events
const total = events.length

/**
 * The hero's recovery sequence.
 *
 * One opportunity, one path. The path is drawn faintly from the start so the
 * panel never reads as an empty box, and the live line grows down it as the
 * opportunity is recovered. Every row is rendered at all times so the panel
 * height never changes — no layout shift as the sequence runs.
 */
export function HeroSequence() {
  const reduced = usePrefersReducedMotion()
  const { ref, step } = useSequence(total, {
    stepMs: 780,
    holdMs: 4200,
    enabled: !reduced,
    onComplete: () => trackOnce('hero_sequence_completed'),
  })

  const shown = Math.min(step, total)
  const current = shown > 0 ? events[shown - 1] : null
  const phase = current?.state ?? 'neutral'

  const headline =
    phase === 'recovered'
      ? 'Recovered'
      : phase === 'engaged'
        ? 'Recovering'
        : phase === 'lost'
          ? 'Missed'
          : 'Waiting'

  // The live rail stops at the center of the most recent event node.
  const railHeight = shown === 0 ? 0 : ((shown - 0.5) / total) * 100

  return (
    <div ref={ref} className="w-full">
      <div
        className="relative overflow-hidden rounded-[14px] border border-rule-ink bg-ink text-chalk shadow-[0_30px_70px_-40px_rgba(13,15,14,0.55)]"
        role="img"
        aria-label={`Illustrative recovery sequence. A missed call at 6:42 PM is answered by CloseAgain and booked as a diagnostic appointment for Saturday 9 to 11 AM.`}
      >
        {/* top highlight hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-chalk/12 to-transparent" />

        {/* --- opportunity header ------------------------------------- */}
        <div className="flex items-start justify-between gap-4 border-b border-rule-ink px-5 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <StatusDot
                state={phase === 'neutral' ? 'lost' : phase}
                tone="ink"
                pulse={phase === 'engaged'}
              />
              <span
                className={`font-mono text-mono-xs uppercase transition-colors duration-700 ${stateText.ink[phase === 'neutral' ? 'lost' : phase]}`}
              >
                {headline}
              </span>
            </div>
            <p className="mt-2 truncate text-[0.9375rem] text-chalk">
              {heroScenario.header.kind} · {heroScenario.header.identifier}
            </p>
            <p className="mt-0.5 font-mono text-mono-sm text-chalk-3">
              {heroScenario.header.source}
            </p>
          </div>
          <p className="tnum shrink-0 font-mono text-mono-sm text-chalk-2">
            {heroScenario.header.stamp}
          </p>
        </div>

        {/* --- the path ------------------------------------------------ */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5">
          {/* the path that exists before anything travels it */}
          <div
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-[4.9rem] w-px sm:top-5 sm:bottom-5 sm:left-[5.4rem]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(237,234,228,0.2) 0 3px, transparent 3px 8px)',
            }}
          />
          {/* the live line, growing as the opportunity is recovered */}
          <div
            aria-hidden="true"
            className="absolute top-4 left-[4.9rem] w-px origin-top transition-[height] duration-700 [transition-timing-function:var(--ease-out-quiet)] sm:top-5 sm:left-[5.4rem]"
            style={{
              height: `calc((100% - 2rem) * ${railHeight / 100})`,
              backgroundImage:
                'linear-gradient(to bottom, var(--color-dormant-ink) 0%, var(--color-engaged-ink) 38%, var(--color-recover-bright) 100%)',
            }}
          />

          <ol className="relative">
            {events.map((event, i) => {
              const visible = i < shown
              return (
                <li
                  key={`${event.time}-${event.label}`}
                  className="grid grid-cols-[4.25rem_1fr] items-start gap-x-4 py-[0.3125rem] sm:grid-cols-[4.75rem_1fr] sm:py-[0.4375rem]"
                >
                  <span
                    className={`tnum pt-px text-right font-mono text-mono-sm whitespace-nowrap transition-opacity duration-500 ${
                      visible ? 'text-chalk-3 opacity-100' : 'opacity-0'
                    }`}
                  >
                    {event.time}
                  </span>

                  <div className="relative pl-5">
                    {/* node on the path */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-[0.4rem] -left-[0.155rem] block h-[7px] w-[7px] rounded-full ring-[3px] ring-ink transition-all duration-500 [transition-timing-function:var(--ease-out-quiet)] ${
                        visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                      } ${
                        event.state === 'recovered'
                          ? 'bg-recover-bright'
                          : event.state === 'engaged'
                            ? 'bg-engaged-ink'
                            : event.state === 'lost'
                              ? 'bg-dormant-ink'
                              : 'bg-chalk-3'
                      }`}
                    />
                    <div
                      className={`transition-all duration-500 [transition-timing-function:var(--ease-out-quiet)] ${
                        visible
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-[6px] opacity-0'
                      }`}
                    >
                      <p
                        className={`text-[0.9375rem] leading-snug ${
                          event.state === 'lost' ? 'text-dormant-ink' : 'text-chalk'
                        }`}
                      >
                        {event.label}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] leading-snug text-chalk-3">
                        {event.detail}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* --- outcome -------------------------------------------------- */}
        <div className="relative flex items-center justify-between gap-4 border-t border-rule-ink px-5 py-4 sm:px-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-1000 [transition-timing-function:var(--ease-out-quiet)]"
            style={{
              opacity: phase === 'recovered' ? 1 : 0,
              background:
                'linear-gradient(to right, color-mix(in oklab, var(--color-recover) 22%, transparent), transparent 70%)',
            }}
          />
          <span
            className={`relative font-mono text-mono-xs uppercase transition-colors duration-700 ${
              phase === 'recovered' ? 'text-recover-bright' : 'text-chalk-3'
            }`}
          >
            Outcome
          </span>
          <span
            className={`relative text-right text-[0.9375rem] transition-colors duration-700 ${
              phase === 'recovered' ? 'text-chalk' : 'text-chalk-3'
            }`}
          >
            {phase === 'recovered' ? heroScenario.result : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  )
}
