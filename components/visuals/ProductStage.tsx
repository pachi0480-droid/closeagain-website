'use client'

import { useCallback, useId, useRef, useState } from 'react'
import { RecoveryPulse } from '@/components/visuals/RecoveryPulse'
import { Illustrative } from '@/components/ui/Disclaimer'
import { StatusDot, stateText } from '@/components/ui/StatusDot'
import { feedBackdrop, queueFilters, scenarios } from '@/data/scenarios'
import { track } from '@/lib/analytics'

/**
 * The product stage: the interface an office would actually work from.
 *
 * Three layers — the queue, the feed, the selected opportunity — at a width
 * the rest of the site does not use, because this is the moment the site stops
 * telling you about the product and shows it.
 *
 * Switching scenario reconfigures all three panels: a different opportunity is
 * selected, the feed reorders around it, and the timeline and outcome change
 * with it. Illustrative throughout.
 */
export function ProductStage() {
  const [index, setIndex] = useState(0)
  const [filter, setFilter] = useState('active')
  const scenario = scenarios[index]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const select = useCallback((next: number) => {
    setIndex(next)
    track('recovery_feed_scenario_changed', { scenario: scenarios[next].id })
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta =
      e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + scenarios.length) % scenarios.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  const outcomeState = scenario.record.at(-2)?.state ?? 'recovered'

  return (
    <div>
      {/* --- scenario control -------------------------------------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div
          role="tablist"
          aria-label="Recovery scenario"
          onKeyDown={onKeyDown}
          className="-mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {scenarios.map((s, i) => {
            const selected = i === index
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`${baseId}-tab-${s.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={[
                  'shrink-0 rounded-[7px] px-3.5 py-2.5 text-[0.875rem] whitespace-nowrap',
                  'transition-colors duration-300 [transition-timing-function:var(--ease-out-quiet)]',
                  selected
                    ? 'bg-chalk text-ink'
                    : 'text-chalk-2 hover:bg-chalk/[0.06] hover:text-chalk',
                ].join(' ')}
              >
                {s.tab}
              </button>
            )
          })}
        </div>
        <Illustrative className="hidden sm:block">
          Illustrative product view · not live customer data
        </Illustrative>
      </div>

      {/* --- the interface ------------------------------------------ */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${scenario.id}`}
        tabIndex={0}
        className="stage-ink hairline-top mt-4 overflow-hidden rounded-[18px] text-chalk"
      >
        <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)_21rem]">
          {/* --- queue ---------------------------------------------- */}
          <aside className="border-b border-rule-ink px-4 py-5 lg:border-r lg:border-b-0">
            <h3 className="px-2 font-mono text-mono-xs text-chalk-3 uppercase">Queue</h3>
            <ul className="mt-3 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {queueFilters.map((f) => {
                const on = filter === f.id
                return (
                  <li key={f.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilter(f.id)}
                      className={`flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left transition-colors duration-300 ${
                        on ? 'bg-chalk/[0.07]' : 'hover:bg-chalk/[0.04]'
                      }`}
                    >
                      <StatusDot state={f.state} tone="ink" />
                      <span
                        className={`text-[0.875rem] whitespace-nowrap ${on ? 'text-chalk' : 'text-chalk-2'}`}
                      >
                        {f.label}
                      </span>
                      <span className="tnum ml-auto hidden font-mono text-[0.6875rem] text-chalk-3 lg:inline">
                        {f.count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* --- feed ----------------------------------------------- */}
          <div className="border-b border-rule-ink lg:border-r lg:border-b-0">
            <div className="flex items-center justify-between gap-4 border-b border-rule-ink px-5 py-3.5">
              <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
                Live opportunities
              </h3>
              <span className="tnum font-mono text-mono-xs text-chalk-3">Today</span>
            </div>

            <ul key={scenario.id} className="px-2.5 py-2.5">
              {/* the selected one, at the top */}
              <li
                className="feed-row relative rounded-[10px] bg-chalk/[0.07] px-3 py-3"
                style={{ '--row': 0 } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-recover-bright"
                />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.9375rem] text-chalk">{scenario.customer}</span>
                  <span className="tnum font-mono text-mono-sm text-chalk-3">
                    {scenario.events.at(-1)?.time}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <StatusDot state="recovered" tone="ink" />
                  <span className="truncate text-[0.8125rem] text-chalk-2">
                    {scenario.record[1]?.value} · {scenario.result}
                  </span>
                </div>
              </li>

              {feedBackdrop.map((row, i) => (
                <li
                  key={row.customer}
                  className="feed-row rounded-[10px] px-3 py-3 transition-colors duration-300 hover:bg-chalk/[0.035]"
                  style={{ '--row': i + 1 } as React.CSSProperties}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.9375rem] text-chalk-2">{row.customer}</span>
                    <span className="tnum font-mono text-mono-sm text-chalk-3">
                      {row.time}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusDot state={row.state} tone="ink" />
                    <span className="truncate text-[0.8125rem] text-chalk-3">
                      {row.service} · {row.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- selected opportunity ------------------------------- */}
          <aside key={`${scenario.id}-detail`} className="flex flex-col">
            <div className="feed-row border-b border-rule-ink px-5 py-4" style={{ '--row': 0 } as React.CSSProperties}>
              <p className="text-[1.0625rem] text-chalk">{scenario.customer}</p>
              <p className="mt-1 font-mono text-mono-sm text-chalk-3">
                {scenario.record[0]?.value} · {scenario.record[1]?.value}
              </p>
            </div>

            <ol className="grow px-5 py-4">
              {scenario.events.map((event, i) => (
                <li
                  key={`${event.time}-${event.label}`}
                  className="feed-row relative grid grid-cols-[1fr] gap-x-3 py-[0.3125rem] sm:grid-cols-[5.25rem_1fr]"
                  style={{ '--row': i + 1 } as React.CSSProperties}
                >
                  <span className="tnum order-2 font-mono text-[0.6875rem] text-chalk-3 sm:order-1 sm:pt-0.5 sm:text-right">
                    {event.time}
                  </span>
                  <div className="relative order-1 sm:order-2 sm:pl-4">
                    {i < scenario.events.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-[0.95rem] -bottom-[0.65rem] left-[1px] hidden w-px sm:block"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(to bottom, rgba(244,242,237,0.3) 0 3px, transparent 3px 8px)',
                        }}
                      />
                    ) : null}
                    <StatusDot
                      state={event.state}
                      tone="ink"
                      className="absolute top-[0.3rem] -left-[0.155rem] hidden sm:block"
                    />
                    <p
                      className={`text-[0.8125rem] leading-snug ${
                        event.state === 'lost' ? 'text-dormant-ink' : 'text-chalk'
                      }`}
                    >
                      {event.label}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="relative border-t border-rule-ink px-5 py-4">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, color-mix(in oklab, var(--color-recover) 20%, transparent), transparent 75%)',
                }}
              />
              <div className="relative">
                <RecoveryPulse fire />
                <p className={`font-mono text-mono-xs uppercase ${stateText.ink[outcomeState]}`}>
                  Outcome
                </p>
                <p className="mt-1.5 text-[0.9375rem] text-chalk">{scenario.result}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Illustrative className="mt-3.5 sm:hidden">
        Illustrative product view · not live customer data
      </Illustrative>
    </div>
  )
}
