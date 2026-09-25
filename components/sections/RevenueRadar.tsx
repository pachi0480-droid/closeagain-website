'use client'

import { useMemo, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { Fact, StateBadge } from '@/components/ui/Signal'
import { ModuleLabel, SectionMark } from '@/components/ui/Type'
import {
  kindMeta,
  signals,
  stateMeta,
  type Signal,
  type SignalKind,
} from '@/data/signals'
import { chapter, labels } from '@/data/site'
import { formatCurrency } from '@/lib/format'
import { track } from '@/lib/analytics'

/**
 * Chapter four — the Revenue Radar.
 *
 * Not a military sweep: a spatial map of everything in play. Size is value,
 * colour is state, and the field reorganises itself when the operator asks a
 * narrower question. Selecting a signal answers the only question that
 * matters about it — what happens next.
 */

type Filter = 'all' | SignalKind

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All opportunities' },
  { id: 'new-demand', label: kindMeta['new-demand'] },
  { id: 'missed-call', label: kindMeta['missed-call'] },
  { id: 'estimate', label: kindMeta.estimate },
  { id: 'no-show', label: kindMeta['no-show'] },
  { id: 'past-customer', label: kindMeta['past-customer'] },
]

/** Value drives the size of a signal, within limits that stay readable. */
function radius(value: number) {
  if (value >= 10000) return 30
  if (value >= 5000) return 25
  if (value >= 1000) return 20
  return 16
}

export function RevenueRadar() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState<string>(signals[0].id)

  const visible = useMemo(
    () => (filter === 'all' ? signals : signals.filter((s) => s.kind === filter)),
    [filter],
  )

  // When a filter narrows the field, the survivors lay out on a clean grid
  // rather than keeping the holes left by everything that went away.
  const placed = useMemo(() => {
    if (filter === 'all') return visible.map((s) => ({ ...s }))
    const cols = Math.min(3, visible.length)
    const rows = Math.ceil(visible.length / cols)
    return visible.map((s, i) => ({
      ...s,
      x: ((i % cols) + 0.5) * (100 / cols),
      y: ((Math.floor(i / cols) + 0.5) * 100) / rows,
    }))
  }, [visible, filter])

  const selected =
    visible.find((s) => s.id === selectedId) ?? visible[0] ?? signals[0]

  const choose = (signal: Signal) => {
    setSelectedId(signal.id)
    track('radar_signal_selected', { signal: signal.id })
  }

  const applyFilter = (next: Filter) => {
    setFilter(next)
    track('radar_filtered', { filter: next })
  }

  return (
    <section
      id={chapter.radar}
      className="relative scroll-mt-24 border-t border-rule bg-graphite-deep py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMark index="04" label="Revenue radar" />
              <h2 className="mt-6 max-w-[21ch] text-h2 font-semibold uppercase text-warm-white">
                See what is moving.
                <br />
                See what needs action.
              </h2>
            </div>
            <div className="md:text-right">
              <p className="max-w-[38ch] text-lede text-muted">
                Every opportunity in play, placed by value and coloured by what
                it is doing.
              </p>
              <div className="mt-4">
                <ModuleLabel>{labels.preview}</ModuleLabel>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------------------------------------------------- filters */}
        <Reveal delay={80} className="mt-10">
          <div
            role="group"
            aria-label="Filter opportunities"
            className="flex flex-wrap gap-2"
          >
            {filters.map((f) => {
              const on = filter === f.id
              const count =
                f.id === 'all'
                  ? signals.length
                  : signals.filter((s) => s.kind === f.id).length
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => applyFilter(f.id)}
                  className={`h-11 rounded-[8px] border px-3.5 text-[0.875rem] transition-colors duration-300 ${
                    on
                      ? 'border-signal bg-signal/10 text-signal'
                      : 'border-steel text-muted hover:border-warm-white/35 hover:text-warm-white'
                  }`}
                >
                  {f.label}
                  <span className="tnum ml-2 font-mono text-mono-xs text-secondary">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* -------------------------------------------- the field */}
          <div className="lg:col-span-8">
            {/* Desktop and tablet: the spatial map. */}
            <div className="stage hidden h-[30rem] p-6 sm:block xl:h-[34rem]">
              <div className="field-grid relative h-full w-full">
                {placed.map((signal) => {
                  const meta = stateMeta[signal.state]
                  const on = signal.id === selected.id
                  const r = radius(signal.value)
                  return (
                    <button
                      key={signal.id}
                      type="button"
                      onClick={() => choose(signal)}
                      aria-pressed={on}
                      title={`${signal.opportunity} — ${meta.label}`}
                      className="absolute flex items-center justify-center rounded-full transition-[left,top,width,height,box-shadow] duration-700 [transition-timing-function:var(--ease-out-quiet)] focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{
                        left: `${signal.x}%`,
                        top: `${signal.y}%`,
                        width: r * 2,
                        height: r * 2,
                        marginLeft: -r,
                        marginTop: -r,
                        backgroundColor: on
                          ? meta.colour
                          : `color-mix(in oklab, ${meta.colour} 16%, transparent)`,
                        border: `1px solid ${meta.colour}`,
                        boxShadow: on
                          ? `0 0 0 6px color-mix(in oklab, ${meta.colour} 14%, transparent)`
                          : 'none',
                      }}
                    >
                      <span className="sr-only">
                        {signal.opportunity}. {meta.label}. {signal.source}.{' '}
                        {signal.since}.{' '}
                        {signal.value > 0
                          ? `Estimated value ${formatCurrency(signal.value)}.`
                          : 'Value not yet estimated.'}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[0.6rem] font-semibold"
                        style={{ color: on ? 'var(--color-void)' : meta.colour }}
                      >
                        {meta.glyph}
                      </span>

                      {/* the open signal names itself, so the map and the
                          panel beside it are plainly the same thing */}
                      {on ? (
                        <span
                          aria-hidden="true"
                          className="absolute top-full left-1/2 mt-2 -translate-x-1/2 font-mono text-mono-xs whitespace-nowrap uppercase"
                          style={{ color: meta.colour }}
                        >
                          {signal.opportunity}
                        </span>
                      ) : null}
                    </button>
                  )
                })}

                {/* legend: state is never carried by colour alone */}
                <ul className="absolute right-0 bottom-0 flex flex-wrap justify-end gap-x-4 gap-y-1.5">
                  {(['new', 'active', 'booked', 'risk', 'quiet', 'waiting'] as const).map(
                    (state) => (
                      <li key={state} className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="text-[0.55rem]"
                          style={{ color: stateMeta[state].colour }}
                        >
                          {stateMeta[state].glyph}
                        </span>
                        <span className="font-mono text-mono-xs uppercase text-secondary">
                          {stateMeta[state].label}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Small screens: the same signals as a filterable stream, in a
                fixed frame so twelve of them cannot become a wall. */}
            <ul className="max-h-[24rem] space-y-px overflow-y-auto overscroll-contain sm:hidden">
              {placed.map((signal) => {
                const meta = stateMeta[signal.state]
                const on = signal.id === selected.id
                return (
                  <li key={signal.id}>
                    <button
                      type="button"
                      onClick={() => choose(signal)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-3 border-l-2 px-4 py-3.5 text-left transition-colors ${
                        on ? 'bg-graphite' : 'bg-graphite/40'
                      }`}
                      style={{ borderLeftColor: meta.colour }}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] text-warm-white">
                          {signal.opportunity}
                        </span>
                        <span className="mt-0.5 block font-mono text-mono-xs uppercase text-secondary">
                          {signal.source} · {signal.since}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <StateBadge state={signal.state} />
                        {signal.value > 0 ? (
                          <span className="tnum mt-1 block font-mono text-mono-xs text-muted">
                            {formatCurrency(signal.value)}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ------------------------------------------ the selection */}
          <div className="lg:col-span-4">
            <div aria-live="polite" className="stage h-full p-6">
              <StateBadge
                state={selected.state}
                pulse={selected.state === 'risk'}
              />
              <h3 className="mt-3 text-h3 text-warm-white">
                {selected.opportunity}
              </h3>

              <dl className="mt-6 space-y-5">
                <Fact label="Source" value={selected.source} />
                <Fact label="Time since activity" value={selected.since} />
                <Fact
                  label="Potential value"
                  value={
                    selected.value > 0
                      ? formatCurrency(selected.value)
                      : 'Not yet estimated'
                  }
                />
              </dl>

              <div className="mt-6 border-t border-rule pt-5">
                <p className="font-mono text-mono-xs uppercase text-signal">
                  Recommended action
                </p>
                <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-warm-white">
                  {selected.action}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
