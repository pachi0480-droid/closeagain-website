'use client'

import { useEffect } from 'react'
import { RecoveryEngine } from '@/components/visuals/RecoveryEngine'
import { Illustrative } from '@/components/ui/Disclaimer'
import { Reveal } from '@/components/ui/Reveal'
import { StatusTag } from '@/components/ui/StatusDot'
import { SectionMark } from '@/components/ui/Type'
import { loopStages, recordThrough } from '@/data/loop'
import { trackOnce } from '@/lib/analytics'
import { useScrollProgress } from '@/lib/hooks'


/**
 * From missed to booked.
 *
 * We followed one opportunity in the hero and the whole month in the Leak Map.
 * This is the machinery: the same opportunity moving through five layers, with
 * the record accumulating as each one attaches what it knows.
 */
export function RecoveryLoop() {
  return (
    <section
      id="recovery-loop"
      data-tone="ink"
      className="grain-ink lit-ink on-ink relative bg-ink text-chalk"
    >
      <div className="shell pt-24 pb-14 md:pt-32 md:pb-16">
        <Reveal>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-7">
              <SectionMark index="02" label="How it works" tone="ink" />
              <h2 className="mt-8 max-w-[16ch] text-h2 text-chalk">
                From missed to booked.
              </h2>
            </div>
            <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-auto lg:pb-2">
              <p className="max-w-[40ch] text-lede text-chalk-2">
                One of the eleven, followed all the way through. The same path
                applies whether the moment was a missed call, a quiet estimate
                or a lead from three months ago.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <StickyEngine />
      <StackedEngine />
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function StickyEngine() {
  const COUNT = loopStages.length
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const active = Math.min(COUNT - 1, Math.max(0, Math.floor(progress * COUNT * 1.001)))
  const stage = loopStages[active]

  useEffect(() => {
    if (progress > 0) trackOnce('recovery_loop_stage_viewed', { stage: stage.id })
  }, [stage.id, progress])

  return (
    <div
      ref={ref}
      id="loop-scroller"
      className="relative hidden lg:block"
      style={{ height: `calc(100vh + ${COUNT * 46}vh)` }}
    >
      <div className="sticky top-0 flex h-screen items-center pt-14">
        <div className="shell w-full">
          <div className="grid grid-cols-12 items-center gap-x-12">
            {/* --- the explanation, largely still ------------------- */}
            <div className="col-span-4">
              <ol>
                {loopStages.map((s, i) => {
                  const isActive = i === active
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        aria-current={isActive ? 'step' : undefined}
                        onClick={() => {
                          const host = document.getElementById('loop-scroller')
                          if (!host) return
                          const travel = host.offsetHeight - window.innerHeight
                          window.scrollTo({ top: host.offsetTop + (i / COUNT) * travel + 4 })
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
                              : 'text-chalk-3/55 group-hover:text-chalk-2'
                          }`}
                        >
                          {s.title}
                        </span>
                      </button>

                      <div
                        className="grid transition-[grid-template-rows,opacity] duration-500 [transition-timing-function:var(--ease-out-quiet)]"
                        style={{
                          gridTemplateRows: isActive ? '1fr' : '0fr',
                          opacity: isActive ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-[42ch] pb-4 pl-10 text-[0.9375rem] leading-relaxed text-chalk-2">
                            {s.summary}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* --- the machinery ------------------------------------ */}
            <div className="col-span-8 col-start-5">
              <RecoveryEngine active={active} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function StackedEngine() {
  return (
    <div className="shell pb-20 lg:hidden">
      <ol className="border-t border-rule-ink">
        {loopStages.map((stage, i) => {
          const added = recordThrough(i).length
          return (
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

                {/* what this layer attaches to the record */}
                <dl className="mt-6 rounded-[12px] border border-rule-ink bg-ink-raise/50 px-4 py-2">
                  {stage.adds.map((row) => (
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

                <div className="mt-4 flex items-center justify-between gap-4">
                  <StatusTag
                    state={stage.state}
                    label={
                      stage.state === 'recovered'
                        ? 'Recovered'
                        : stage.state === 'engaged'
                          ? 'In recovery'
                          : 'Slipping'
                    }
                    tone="ink"
                    pulse={stage.state === 'engaged'}
                  />
                  <span className="tnum font-mono text-mono-xs text-chalk-3 uppercase">
                    {added} facts on the record
                  </span>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>
      <Illustrative tone="ink" className="mt-5">
        Illustrative recovery flow
      </Illustrative>
    </div>
  )
}
