'use client'

import { useCallback, useId, useRef, useState } from 'react'
import { Illustrative } from '@/components/ui/Disclaimer'
import { StatusDot, StatusTag, stateText } from '@/components/ui/StatusDot'
import { scenarios } from '@/data/scenarios'
import { track } from '@/lib/analytics'

/**
 * The product's operational view: a recovery feed and the opportunity record
 * beside it. Switching the scenario replays the whole timeline.
 */
export function RecoveryFeed() {
  const [index, setIndex] = useState(0)
  const scenario = scenarios[index]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const select = useCallback((next: number) => {
    setIndex(next)
    track('recovery_feed_scenario_changed', { scenario: scenarios[next].id })
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : e.key === 'Home'
            ? -index
            : e.key === 'End'
              ? scenarios.length - 1 - index
              : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + scenarios.length) % scenarios.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      {/* --- scenario selector ------------------------------------------- */}
      <div
        role="tablist"
        aria-label="Recovery scenario"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                'relative shrink-0 rounded-[7px] px-3.5 py-2.5 text-[0.875rem] whitespace-nowrap',
                'transition-colors duration-300 [transition-timing-function:var(--ease-out-quiet)]',
                selected
                  ? 'bg-graphite text-paper'
                  : 'text-graphite-2 hover:bg-graphite/[0.05] hover:text-graphite',
              ].join(' ')}
            >
              {s.tab}
            </button>
          )
        })}
      </div>

      {/* --- the panel ---------------------------------------------------- */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${scenario.id}`}
        tabIndex={0}
        className="mt-4 overflow-hidden rounded-[14px] border border-rule-ink bg-ink text-chalk shadow-[0_34px_80px_-48px_rgba(13,15,14,0.6)]"
      >
        <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-chalk/12 to-transparent" />

        {/* signal */}
        <div className="border-b border-rule-ink px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <StatusTag state="lost" label={scenario.trigger} tone="ink" />
            <p className="tnum font-mono text-mono-sm text-chalk-3">
              {scenario.header.stamp}
            </p>
          </div>
          <p className="mt-3 text-[0.9375rem] text-chalk">
            {scenario.header.kind} · {scenario.header.identifier}
          </p>
          <p className="mt-1 text-[0.875rem] text-chalk-3">{scenario.signal}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_15rem]">
          {/* the feed */}
          <ol
            key={scenario.id}
            className="min-h-[24rem] px-5 py-4 sm:px-7 sm:py-5"
          >
            {scenario.events.map((event, i) => (
              <li
                key={`${event.time}-${event.label}`}
                className="feed-row group/row grid grid-cols-[1fr] gap-x-4 py-[0.4375rem] sm:grid-cols-[6.5rem_1fr]"
                style={{ '--row': i } as React.CSSProperties}
              >
                <span className="tnum order-2 pt-0.5 font-mono text-mono-sm text-chalk-3 sm:order-1 sm:text-right">
                  {event.time}
                </span>
                <div className="relative order-1 sm:order-2 sm:pl-5">
                  {/* the path between events */}
                  {i < scenario.events.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-[1.15rem] -bottom-[0.95rem] left-[1px] hidden w-px sm:block"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(to bottom, rgba(237,234,228,0.2) 0 3px, transparent 3px 8px)',
                      }}
                    />
                  ) : null}
                  <StatusDot
                    state={event.state}
                    tone="ink"
                    className="absolute top-[0.45rem] -left-[0.155rem] hidden sm:block"
                  />
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
              </li>
            ))}
          </ol>

          {/* the record */}
          <aside className="border-t border-rule-ink px-5 py-5 sm:px-7 lg:border-t-0 lg:border-l lg:px-6">
            <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
              Opportunity
            </h3>
            <dl key={scenario.id} className="mt-4">
              {scenario.record.map((field, i) => (
                <div
                  key={field.label}
                  className="feed-row border-b border-rule-ink-soft py-2.5 last:border-b-0"
                  style={{ '--row': i + 2 } as React.CSSProperties}
                >
                  <dt className="font-mono text-mono-xs text-chalk-3 uppercase">
                    {field.label}
                  </dt>
                  <dd
                    className={`mt-1 flex items-center gap-2 text-[0.9375rem] ${
                      field.state ? stateText.ink[field.state] : 'text-chalk'
                    }`}
                  >
                    {field.state ? (
                      <StatusDot state={field.state} tone="ink" />
                    ) : null}
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* outcome */}
        <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule-ink px-5 py-4 sm:px-7">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, color-mix(in oklab, var(--color-recover) 22%, transparent), transparent 70%)',
            }}
          />
          <span className="relative font-mono text-mono-xs text-recover-bright uppercase">
            Recovered
          </span>
          <span className="relative text-[0.9375rem] text-chalk">
            {scenario.result}
          </span>
        </div>
      </div>

      <Illustrative className="mt-3.5">
        Illustrative product flow · not live customer data
      </Illustrative>
    </div>
  )
}
