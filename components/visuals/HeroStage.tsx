'use client'

import { heroBeats } from '@/data/scenarios'

/**
 * The live sequence column inside the hero panel.
 *
 * No longer its own card: the hero surface is the panel now, and this is the
 * region of it where the opportunity moves. Every beat is in the DOM from the
 * first frame and revealed by opacity, so the column's height never changes
 * while the sequence runs.
 */
export function HeroStage({ step }: { step: number }) {
  const shown = (i: number) => i < Math.max(step, 1)
  const stalled = step >= 2 && step < 3

  return (
    <div className="relative h-full">
      {/* the path, drawn before anything travels it */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-[4.6rem] w-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(244,242,237,0.26) 0 3px, transparent 3px 9px)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-1 left-[4.6rem] w-px origin-top transition-[height] duration-[900ms] [transition-timing-function:var(--ease-out-quiet)]"
        style={{
          height: `calc((100% - 0.5rem) * ${Math.min(step, heroBeats.length) / heroBeats.length})`,
          backgroundImage:
            'linear-gradient(to bottom, var(--color-dormant-ink), var(--color-engaged-ink) 45%, var(--color-recover-bright))',
        }}
      />

      <ol className="relative flex flex-col gap-2.5">
        {heroBeats.map((beat, i) => {
          if (beat.kind === 'booking') return null
          const visible = shown(i)

          if (beat.kind === 'event') {
            return (
              <li
                key={i}
                className="grid grid-cols-[4.25rem_1fr] items-start gap-x-4 transition-all duration-700 [transition-timing-function:var(--ease-out-quiet)]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(10px)',
                }}
              >
                <span className="tnum pt-px text-right font-mono text-mono-sm text-chalk-3">
                  {beat.time}
                </span>
                <span className="flex items-baseline gap-3">
                  <span
                    className={`mt-1.5 h-[6px] w-[6px] shrink-0 rounded-full ${
                      beat.state === 'engaged'
                        ? 'bg-engaged-ink'
                        : beat.state === 'lost'
                          ? 'bg-dormant-ink'
                          : 'bg-chalk-3'
                    }`}
                  />
                  <span>
                    <span
                      className={`block text-[0.9375rem] ${
                        beat.state === 'lost' ? 'text-dormant-ink' : 'text-chalk'
                      }`}
                    >
                      {beat.label}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-chalk-3">
                      {beat.detail}
                    </span>
                  </span>
                </span>
              </li>
            )
          }

          const mine = beat.from === 'closeagain'
          return (
            <li
              key={i}
              className={`flex flex-col gap-1 transition-all duration-700 [transition-timing-function:var(--ease-out-quiet)] ${
                mine ? 'items-end pl-6' : 'items-start pl-[5.4rem] pr-4'
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(10px)',
              }}
            >
              <span
                className={`max-w-[26ch] rounded-[12px] px-3.5 py-2.5 text-[0.9375rem] leading-snug ${
                  mine
                    ? 'rounded-br-[4px] border border-recover-bright/25 bg-recover-deep/60 text-chalk'
                    : 'rounded-bl-[4px] bg-chalk/[0.09] text-chalk'
                }`}
              >
                {beat.body}
              </span>
              <span className="tnum font-mono text-[0.625rem] text-chalk-3">
                {mine ? 'CloseAgain' : 'Customer'} · {beat.time}
              </span>
            </li>
          )
        })}
      </ol>

      {/* the quiet decay while it is stalled — no red warnings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink-raise-2/55 transition-opacity duration-[900ms]"
        style={{ opacity: stalled ? 1 : 0 }}
      />
    </div>
  )
}
