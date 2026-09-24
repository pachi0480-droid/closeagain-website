'use client'

import { RecoveryPulse } from '@/components/visuals/RecoveryPulse'
import { Illustrative } from '@/components/ui/Disclaimer'
import { heroBeats } from '@/data/scenarios'

/**
 * The hero stage: a window into the system, bleeding off the right edge rather
 * than sitting beside the headline as a card.
 *
 * Every beat is in the DOM from the first frame and revealed by opacity, so
 * the stage height never changes while the sequence runs — no layout shift on
 * the most important element of the page.
 */
export function HeroStage({ step }: { step: number }) {
  const shown = (i: number) => i < Math.max(step, 1)
  const recovered = step >= heroBeats.length
  const stalled = step >= 2 && step < 3

  return (
    <div className="relative">
      {/* the stage is attached to the field, not floating on it: hairlines
          run out of its edges into the scene behind the copy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 right-full h-px w-[40vw] bg-gradient-to-l from-graphite/12 to-transparent" />
        <span className="absolute bottom-0 right-full h-px w-[26vw] bg-gradient-to-l from-graphite/10 to-transparent" />
        <span className="absolute top-0 -left-px h-full w-px bg-gradient-to-b from-graphite/12 via-transparent to-graphite/8" />
      </div>

      <div
        className="stage-ink hairline-top depth-layer relative overflow-hidden rounded-[16px] text-chalk"
        style={{ '--depth': '11px' } as React.CSSProperties}
        role="img"
        aria-label="Illustrative product view. A 6:42 PM inbound call about an air conditioner goes unanswered, CloseAgain opens a recovery conversation, and the job is booked for a 9 to 11 AM diagnostic the next morning."
      >
        {/* Recovery is a change of lighting across the whole panel, not a
            tinted strip: the room the opportunity sits in warms up. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-[1400ms] [transition-timing-function:var(--ease-out-quiet)]"
          style={{
            opacity: recovered ? 1 : 0,
            background:
              'radial-gradient(90% 70% at 50% 112%, color-mix(in oklab, var(--color-recover) 34%, transparent), transparent 74%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-[1400ms]"
          style={{
            opacity: recovered ? 1 : 0,
            background:
              'linear-gradient(to right, transparent, var(--color-recover-bright), transparent)',
          }}
        />

        {/* --- the opportunity ------------------------------------------ */}
        <header className="relative flex items-start justify-between gap-6 border-b border-rule-ink px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="font-mono text-mono-xs text-chalk-3 uppercase">
              Opportunity
            </p>
            <p className="mt-1.5 text-[1.0625rem] text-chalk">Inbound call · AC not cooling</p>
            <p className="mt-1 font-mono text-mono-sm text-chalk-3">
              (352) 555-0148 · Google LSA
            </p>
          </div>
          <p className="tnum shrink-0 font-mono text-mono-sm text-chalk-2">Fri 6:42 PM</p>
        </header>

        {/* --- the beats ------------------------------------------------- */}
        <div className="relative min-h-[17.5rem] px-5 py-4 sm:min-h-[18.5rem] sm:px-7 sm:py-5">
          {/* the path, drawn before the opportunity travels it */}
          <div
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-[5.85rem] w-px sm:left-[6.35rem]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(244,242,237,0.28) 0 3px, transparent 3px 9px)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-5 left-[5.85rem] w-px origin-top transition-[height] duration-[900ms] [transition-timing-function:var(--ease-out-quiet)] sm:left-[6.35rem]"
            style={{
              height: `calc((100% - 2.5rem) * ${Math.min(step, heroBeats.length) / heroBeats.length})`,
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
                    className="grid grid-cols-[4.5rem_1fr] items-start gap-x-4 transition-all duration-700 [transition-timing-function:var(--ease-out-quiet)]"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'none' : 'translateY(10px)',
                    }}
                  >
                    <span className="tnum pt-px text-right font-mono text-mono-sm text-chalk-3">
                      {beat.time}
                    </span>
                    <span className="flex items-baseline gap-2.5">
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
                    mine ? 'items-end pl-12' : 'items-start pl-[4.5rem] pr-12'
                  }`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(10px)',
                  }}
                >
                  <span
                    className={`max-w-[30ch] rounded-[12px] px-3.5 py-2.5 text-[0.9375rem] leading-snug ${
                      mine
                        ? 'rounded-br-[4px] border border-recover-bright/25 bg-recover-deep/45 text-chalk'
                        : 'rounded-bl-[4px] bg-chalk/[0.07] text-chalk'
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
            className="pointer-events-none absolute inset-0 bg-ink/45 transition-opacity duration-[900ms]"
            style={{ opacity: stalled ? 1 : 0 }}
          />
        </div>

        {/* --- the resolution ------------------------------------------- */}
        <footer className="relative border-t border-rule-ink px-5 py-4 sm:px-7 sm:py-5">
          <div
            className="flex items-center justify-between gap-5 transition-all duration-[900ms] [transition-timing-function:var(--ease-out-quiet)]"
            style={{
              opacity: 1,
              transform: recovered ? 'none' : 'translateY(6px)',
            }}
          >
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
                className={`relative mt-2 text-[1.5rem] leading-none font-semibold tracking-[-0.03em] transition-colors duration-700 ${
                  recovered ? 'text-chalk' : 'text-chalk-3/50'
                }`}
              >
                {recovered ? 'Tomorrow · 9:00–11:00 AM' : 'Pending'}
              </p>
            </div>
            <p
              className="shrink-0 rounded-[6px] border px-2.5 py-1.5 text-right font-mono text-mono-xs uppercase transition-all duration-700"
              style={{
                borderColor: recovered
                  ? 'color-mix(in oklab, var(--color-recover-bright) 45%, transparent)'
                  : 'var(--color-rule-ink)',
                color: recovered ? 'var(--color-recover-bright)' : 'var(--color-chalk-3)',
                backgroundColor: recovered
                  ? 'color-mix(in oklab, var(--color-recover) 16%, transparent)'
                  : 'transparent',
              }}
            >
              {recovered ? 'Diagnostic' : 'No outcome'}
            </p>
          </div>
        </footer>
      </div>

      <Illustrative className="mt-3.5">Illustrative product view</Illustrative>
    </div>
  )
}
