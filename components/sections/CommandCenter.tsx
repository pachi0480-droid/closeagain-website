'use client'

import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Fact, StateBadge } from '@/components/ui/Signal'
import { ModuleLabel, SectionMark } from '@/components/ui/Type'
import { activity, metrics, rows } from '@/data/command'
import { stateMeta } from '@/data/signals'
import { chapter, labels } from '@/data/site'
import { formatCurrency } from '@/lib/format'

/**
 * Chapter five — the Revenue Command Center.
 *
 * Not a spreadsheet and not a CRM: a queue with one next action per row, and
 * one opportunity open at a time. The figures are obvious demo values inside a
 * conceptual interface — the module carries that label once, at the top.
 */
export function CommandCenter() {
  const [selectedId, setSelectedId] = useState(rows[0].id)
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0]

  return (
    <section
      id={chapter.command}
      className="relative scroll-mt-24 border-t border-rule bg-void py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMark index="05" label="Revenue command center" />
              <h2 className="mt-6 max-w-[16ch] text-h2 font-semibold uppercase text-warm-white">
                Every opportunity.
                <br />
                One next action.
              </h2>
            </div>
            <div className="md:text-right">
              <p className="max-w-[38ch] text-lede text-muted">
                The queue your team actually works, with the reason each row is
                there written on it.
              </p>
              <div className="mt-4">
                <ModuleLabel>{labels.preview}</ModuleLabel>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------ the interface */}
        <Reveal delay={120} className="mt-12">
          <div className="stage overflow-hidden">
            {/* metrics */}
            <div className="grid grid-cols-2 gap-px bg-steel/40 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="bg-graphite p-5 lg:p-6">
                  <p className="font-mono text-mono-xs uppercase text-secondary">
                    {metric.label}
                  </p>
                  <p
                    className="tnum mt-2.5 text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-semibold tracking-[-0.035em]"
                    style={{
                      color: metric.state
                        ? stateMeta[metric.state].colour
                        : 'var(--color-warm-white)',
                    }}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-secondary">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-steel/40 lg:grid-cols-12">
              {/* the stream */}
              <div className="bg-graphite lg:col-span-5">
                <div className="flex items-center justify-between border-b border-rule px-5 py-3.5">
                  <p className="font-mono text-mono-xs uppercase text-muted">
                    Opportunity stream
                  </p>
                  <span className="flex items-center gap-1.5 font-mono text-mono-xs uppercase text-secondary">
                    <span aria-hidden="true" className="dot text-signal" data-pulse="true" />
                    Live
                  </span>
                </div>

                <ul role="list">
                  {rows.map((row) => {
                    const meta = stateMeta[row.state]
                    const on = row.id === selected.id
                    return (
                      <li key={row.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(row.id)}
                          aria-pressed={on}
                          className={`flex w-full items-center gap-3 border-b border-rule-soft border-l-2 px-5 py-4 text-left transition-colors duration-300 ${
                            on ? 'bg-graphite-raised' : 'hover:bg-graphite-raised/60'
                          }`}
                          style={{
                            borderLeftColor: on ? meta.colour : 'transparent',
                          }}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.9375rem] tracking-[-0.01em] text-warm-white">
                              {row.opportunity}
                            </span>
                            <span className="mt-1 block font-mono text-mono-xs uppercase text-secondary">
                              {row.source}
                            </span>
                          </span>

                          <span className="shrink-0 text-right">
                            <StateBadge state={row.state} />
                            <span className="tnum mt-1 block font-mono text-mono-xs text-muted">
                              {formatCurrency(row.value)} · {row.time}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* the open opportunity */}
              <div
                aria-live="polite"
                className="bg-graphite-deep p-6 lg:col-span-4 lg:p-7"
              >
                <p className="font-mono text-mono-xs uppercase text-secondary">
                  Selected opportunity
                </p>
                <h3 className="mt-3 text-h3 text-warm-white">
                  {selected.opportunity}
                </h3>

                <dl className="mt-6 space-y-5">
                  <Fact
                    label="Current state"
                    value={selected.detail.currentState}
                    state={selected.state}
                  />
                  <Fact label="Last activity" value={selected.detail.lastActivity} />
                  <Fact
                    label="Potential value"
                    value={formatCurrency(selected.value)}
                  />
                </dl>

                <div className="mt-6 border-t border-rule pt-5">
                  <p className="font-mono text-mono-xs uppercase text-signal">
                    Next action
                  </p>
                  <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-warm-white">
                    {selected.detail.nextAction}
                  </p>
                </div>
              </div>

              {/* the rail */}
              <div className="bg-graphite lg:col-span-3">
                <div className="border-b border-rule px-5 py-3.5">
                  <p className="font-mono text-mono-xs uppercase text-muted">
                    Activity
                  </p>
                </div>
                <ul role="list" className="p-5">
                  {activity.map((item, i) => (
                    <li
                      key={`${item.time}-${item.label}`}
                      className={`row-in flex items-baseline gap-3 pb-4 last:pb-0 ${
                        i >= 3 ? 'hidden lg:flex' : ''
                      }`}
                      style={{ ['--row' as string]: i }}
                    >
                      <time className="tnum shrink-0 font-mono text-mono-xs text-secondary">
                        {item.time}
                      </time>
                      <span
                        aria-hidden="true"
                        className="dot mt-1.5 shrink-0"
                        style={{ color: stateMeta[item.state].colour }}
                      />
                      <span className="text-[0.875rem] leading-snug text-muted">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
