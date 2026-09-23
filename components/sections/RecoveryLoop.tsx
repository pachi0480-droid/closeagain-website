'use client'

import { useEffect } from 'react'
import {
  LoopReadout,
  LoopStatus,
  LoopTrack,
} from '@/components/recovery/LoopStage'
import { Illustrative } from '@/components/ui/Disclaimer'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { loopStages } from '@/data/loop'
import { trackOnce } from '@/lib/analytics'
import { useScrollProgress } from '@/lib/hooks'

const COUNT = loopStages.length

/**
 * The site's signature interaction: one opportunity travelling the whole
 * recovery path while the explanation stays put.
 *
 * Desktop gets the sticky sequence. Mobile gets the same story as five read
 * blocks — the narrative survives without the scroll mechanic.
 */
export function RecoveryLoop() {
  return (
    <section
      id="recovery-loop"
      data-tone="ink"
      className="grain-ink on-ink relative bg-ink text-chalk"
    >
      <div className="shell pt-10 pb-16 md:pt-14 md:pb-20">
        <Reveal>
          <SectionMark index="03" label="How it works" tone="ink" />
          <h2 className="mt-7 max-w-[16ch] text-h2 text-chalk">
            From missed to booked.
          </h2>
          <p className="mt-6 max-w-[54ch] text-lede text-chalk-2">
            One opportunity, start to finish. This is the path CloseAgain is
            built to run — and the same path applies whether the moment is a
            missed call, a quiet estimate or a lead from three months ago.
          </p>
        </Reveal>
      </div>

      <StickySequence />
      <StackedSequence />
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* desktop                                                                     */
/* -------------------------------------------------------------------------- */

function StickySequence() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const active = Math.min(COUNT - 1, Math.max(0, Math.floor(progress * COUNT * 1.001)))
  const stage = loopStages[active]

  useEffect(() => {
    // progress stays at 0 until the sequence is on screen, so this does not
    // report a stage the reader has not reached.
    if (progress > 0) trackOnce('recovery_loop_stage_viewed', { stage: stage.id })
  }, [stage.id, progress])

  return (
    <div
      ref={ref}
      id="loop-scroller"
      className="relative hidden lg:block"
      style={{ height: `calc(100vh + ${COUNT * 68}vh)` }}
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="shell w-full">
          <div className="grid grid-cols-12 items-center gap-x-12">
            {/* --- the explanation, largely still ------------------------- */}
            <div className="col-span-5">
              <ol className="relative">
                {loopStages.map((s, i) => {
                  const isActive = i === active
                  return (
                    <li key={s.id} className="relative">
                      <button
                        type="button"
                        aria-current={isActive ? 'step' : undefined}
                        onClick={() => {
                          // Jump the page to the scroll offset that makes this
                          // step active, rather than fighting the scroll.
                          const host = document.getElementById('loop-scroller')
                          if (!host) return
                          const travel = host.offsetHeight - window.innerHeight
                          window.scrollTo({
                            top: host.offsetTop + (i / COUNT) * travel + 4,
                          })
                        }}
                        className="group flex w-full items-baseline gap-5 py-2.5 text-left"
                      >
                        <span
                          className={`tnum font-mono text-mono-xs transition-colors duration-500 ${
                            isActive ? 'text-recover-bright' : 'text-chalk-3/70'
                          }`}
                        >
                          {s.index}
                        </span>
                        <span
                          className={`text-h3 transition-colors duration-500 ${
                            isActive
                              ? 'text-chalk'
                              : 'text-chalk-3/60 group-hover:text-chalk-2'
                          }`}
                        >
                          {s.title}
                        </span>
                      </button>

                      {/* the active step's explanation */}
                      <div
                        className="grid transition-[grid-template-rows,opacity] duration-500 [transition-timing-function:var(--ease-out-quiet)]"
                        style={{
                          gridTemplateRows: isActive ? '1fr' : '0fr',
                          opacity: isActive ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-[46ch] pb-4 pl-10 text-[0.9375rem] leading-relaxed text-chalk-2">
                            {s.summary}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* --- the opportunity, moving -------------------------------- */}
            <div className="col-span-7 col-start-6">
              <div className="overflow-hidden rounded-[14px] border border-rule-ink bg-ink-raise/60 px-8 pt-16 pb-8">
                <LoopTrack stages={loopStages} active={active} className="px-2" />

                <div className="mt-12 border-t border-rule-ink pt-2">
                  <LoopReadout stages={loopStages} active={active} />
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-rule-ink pt-6">
                  <LoopStatus stage={stage} />
                  <span className="tnum font-mono text-mono-xs text-chalk-3 uppercase">
                    Stage {stage.index} / {String(COUNT).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <Illustrative tone="ink" className="mt-3.5">
                Illustrative recovery flow
              </Illustrative>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* mobile and tablet                                                           */
/* -------------------------------------------------------------------------- */

function StackedSequence() {
  return (
    <div className="shell pb-20 lg:hidden">
      <ol className="border-t border-rule-ink">
        {loopStages.map((stage) => (
          <li key={stage.id} className="border-b border-rule-ink py-9">
            <Reveal>
              <div className="flex items-baseline gap-4">
                <span
                  className={`tnum font-mono text-mono-xs ${
                    stage.state === 'recovered'
                      ? 'text-recover-bright'
                      : stage.state === 'engaged'
                        ? 'text-engaged-ink'
                        : 'text-dormant-ink'
                  }`}
                >
                  {stage.index}
                </span>
                <h3 className="text-h3 text-chalk">{stage.title}</h3>
              </div>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-chalk-2">
                {stage.summary}
              </p>

              <dl className="mt-6 rounded-[12px] border border-rule-ink bg-ink-raise/50 px-4 py-2">
                {stage.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-5 border-b border-rule-ink-soft py-2.5 last:border-b-0"
                  >
                    <dt className="font-mono text-mono-xs text-chalk-3 uppercase">
                      {row.label}
                    </dt>
                    <dd className="tnum text-right text-[0.875rem] text-chalk">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4">
                <LoopStatus stage={stage} />
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <Illustrative tone="ink" className="mt-5">
        Illustrative recovery flow
      </Illustrative>
    </div>
  )
}
