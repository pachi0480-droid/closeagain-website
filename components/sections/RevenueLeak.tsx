'use client'

import { useState } from 'react'
import { LeakMap } from '@/components/visuals/LeakMap'
import { LeakMapMobile } from '@/components/visuals/LeakMapMobile'
import { Reveal } from '@/components/ui/Reveal'
import { Accent, SectionMark } from '@/components/ui/Type'
import { leakCounts } from '@/data/leak-map'
import { trackOnce } from '@/lib/analytics'
import { useInViewOnce } from '@/lib/hooks'

/**
 * Where revenue goes.
 *
 * The hero followed one opportunity. This is the whole month at once — and the
 * toggle is the argument: same demand, same spend, different outcome for seven
 * of the twelve that were going to disappear.
 */
export function RevenueLeak() {
  const [on, setOn] = useState(false)
  const { ref, inView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.18,
    onEnter: () => trackOnce('leak_moment_viewed', { moment: 'leak-map' }),
  })

  return (
    <section
      id="leak"
      className="grain-ink lit-ink on-ink relative bg-ink py-24 text-chalk md:py-32"
    >
      <div className="shell">
        {/* --- the turn ------------------------------------------------ */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionMark index="01" label="Where it goes" tone="ink" />
              <p className="mt-8 max-w-[22ch] text-h2 text-chalk">
                Revenue rarely disappears all at once.
              </p>
              <p className="mt-4 max-w-[22ch] text-h2 text-chalk-3">
                It leaks out in <Accent>moments</Accent>.
              </p>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-4 lg:col-start-9 lg:mt-auto lg:pb-2">
            <Reveal delay={140}>
              <p className="max-w-[40ch] text-lede text-chalk-2">
                A month of demand, drawn as movement. Every one of these had
                already raised a hand — the money was spent and the interest was
                real. Watch where they stop.
              </p>
            </Reveal>
          </div>
        </div>

        {/* --- the toggle --------------------------------------------- */}
        <Reveal delay={100} className="mt-14 md:mt-16">
          <div
            role="group"
            aria-label="Compare the same demand with and without CloseAgain"
            className="inline-flex rounded-[9px] border border-rule-ink p-1"
          >
            {[
              { label: 'Without CloseAgain', value: false },
              { label: 'With CloseAgain', value: true },
            ].map((option) => {
              const active = on === option.value
              return (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setOn(option.value)}
                  className={[
                    'rounded-[6px] px-4 py-2.5 text-[0.875rem] whitespace-nowrap',
                    'transition-colors duration-400 [transition-timing-function:var(--ease-out-quiet)]',
                    active
                      ? option.value
                        ? 'bg-recover-bright text-ink'
                        : 'bg-chalk text-ink'
                      : 'text-chalk-2 hover:bg-chalk/[0.07] hover:text-chalk',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* --- the map ------------------------------------------------- */}
        <div ref={ref} className="mt-6">
          <div className="hidden lg:block">
            <LeakMap on={on} drawn={inView} />
          </div>
          <div className="lg:hidden">
            <LeakMapMobile on={on} />
          </div>
        </div>

        {/* --- what it means ----------------------------------------- */}
        <Reveal delay={80}>
          <p className="mt-10 max-w-[64ch] text-lede text-chalk-2">
            {on ? (
              <>
                Same demand. Same marketing spend. Same {leakCounts.total}{' '}
                opportunities.{' '}
                <span className="text-chalk">
                  {leakCounts.recovered} of the {leakCounts.lost} that were going
                  to disappear are back in the flow
                </span>{' '}
                — and {leakCounts.stillLost} are still gone, because some of them
                always will be.
              </>
            ) : (
              <>
                {leakCounts.booked} of {leakCounts.total} make it through on their
                own.{' '}
                <span className="text-chalk">
                  The other {leakCounts.lost} stop at a gate
                </span>{' '}
                — not because the lead was bad, but because nobody got to it in
                time.
              </>
            )}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
