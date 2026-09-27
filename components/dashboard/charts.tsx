'use client'

/**
 * Hand-rolled charts for the demo. Restrained on purpose: hairline solid
 * gridlines, 1.5px lines, columns in ink with vermilion only for the series
 * that matters most, washes at 8% or less.
 *
 * Every chart has a value-axis caption and a legend, carries a text summary
 * and a visually hidden data table, and its readout works from the pointer
 * and the keyboard (focus the chart, then use the arrow keys).
 */

import { useId, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { fmtNumber } from '@/content/demo/format'
import { cx } from './ui'

export type Tone = 'ink' | 'accent' | 'muted'

const stroke: Record<Tone, string> = {
  ink: 'var(--ink)',
  accent: 'var(--vermilion)',
  muted: 'var(--ink-3)',
}

export type Series = {
  id: string
  label: string
  values: number[]
  tone: Tone
  /** A line, or one column per point. Defaults to the chart's `kind`. */
  mark?: 'line' | 'column'
  /** Fill a faint wash under a line. */
  area?: boolean
  /** A dashed line, for averages and other derived series. */
  dashed?: boolean
  /** Column series that share a stack id sit on top of each other. */
  stack?: string
}

/** A “nice” axis top and step for counts. */
export function niceScale(max: number, ticks = 4, integer = true) {
  if (!(max > 0)) return { top: ticks, step: 1 }
  const raw = max / ticks
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / magnitude
  let step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * magnitude
  if (integer) step = Math.max(1, Math.round(step))
  return { top: Math.ceil(max / step) * step, step }
}

/** A trailing average, so a trend reads through day-to-day noise. */
export function rolling(values: readonly number[], size = 7): number[] {
  return values.map((_, index) => {
    const from = Math.max(0, index - size + 1)
    const slice = values.slice(from, index + 1)
    return slice.reduce((sum, value) => sum + value, 0) / slice.length
  })
}

const VIEW_W = 1000
const PAD_TOP = 10

type ChartProps = {
  series: Series[]
  /** Short label per point, used on the axis. */
  labels: string[]
  /** Longer label per point, used in the readout. */
  longLabels?: string[]
  height?: number
  format?: (value: number) => string
  /** One-sentence description for assistive technology. */
  summary: string
  /** The default mark for series that do not set one. */
  kind?: 'line' | 'columns'
  integer?: boolean
  /** Value labels at the end of each solid line. */
  endLabels?: boolean
  legend?: boolean
  /** A faint reference line, e.g. an average. */
  reference?: { value: number; label: string }
  /** Caption for the value axis, e.g. “Leads per day”. */
  yLabel?: string
  /** Adds a total row to the readout (for stacked columns). */
  totalLabel?: string
  /** False renders a still picture: no focus stop, readout or data table (for decorative previews). */
  interactive?: boolean
}

type Group = { key: string; series: Series[] }

export function TimeChart({
  series,
  labels,
  longLabels = labels,
  height = 220,
  format = (value) => fmtNumber(value),
  summary,
  kind = 'line',
  integer = true,
  endLabels = true,
  legend = true,
  reference,
  yLabel,
  totalLabel,
  interactive = true,
}: ChartProps) {
  const id = useId()
  const [active, setActive] = useState<number | null>(null)
  const [announce, setAnnounce] = useState('')
  const count = labels.length
  const markOf = (s: Series) => s.mark ?? (kind === 'columns' ? 'column' : 'line')
  const lines = series.filter((s) => markOf(s) === 'line')
  const columnSeries = series.filter((s) => markOf(s) === 'column')
  const slotted = columnSeries.length > 0

  // Column series grouped by stack: one bar per group per point.
  const groups: Group[] = []
  for (const s of columnSeries) {
    const key = s.stack ?? s.id
    const group = groups.find((item) => item.key === key)
    if (group) group.series.push(s)
    else groups.push({ key, series: [s] })
  }
  const groupTotal = (group: Group, index: number) => group.series.reduce((sum, s) => sum + (s.values[index] ?? 0), 0)

  const max = Math.max(
    0,
    ...lines.flatMap((s) => s.values),
    ...groups.flatMap((group) => labels.map((_, index) => groupTotal(group, index))),
    reference?.value ?? 0,
  )
  const { top, step } = niceScale(max, 4, integer)
  const plotH = height - PAD_TOP

  const x = (index: number) => {
    if (slotted) return ((index + 0.5) / count) * VIEW_W
    return count <= 1 ? VIEW_W / 2 : (index / (count - 1)) * VIEW_W
  }
  const y = (value: number) => PAD_TOP + plotH - (value / top) * plotH
  const px = (value: number) => (value / top) * plotH
  const xPct = (index: number) => (x(index) / VIEW_W) * 100

  const ticks: number[] = []
  for (let value = 0; value <= top + 1e-9; value += step) ticks.push(value)

  const paths = lines.map((s) => {
    const points = s.values.map((value, index) => `${x(index).toFixed(2)},${y(value).toFixed(2)}`)
    const line = `M${points.join('L')}`
    const base = (PAD_TOP + plotH).toFixed(2)
    const area = `${line}L${x(s.values.length - 1).toFixed(2)},${base}L${x(0).toFixed(2)},${base}Z`
    return { id: s.id, line, area }
  })

  const every = Math.max(1, Math.ceil(count / 6))
  const tickIndexes = labels.map((_, index) => index).filter((index) => index % every === 0 || index === count - 1)
  // Keep the last two axis labels from colliding.
  if (tickIndexes.length > 2 && tickIndexes[tickIndexes.length - 1] - tickIndexes[tickIndexes.length - 2] < every * 0.6) {
    tickIndexes.splice(tickIndexes.length - 2, 1)
  }

  const describe = (index: number) => {
    const parts = series.map((s) => `${s.label} ${format(s.values[index] ?? 0)}`)
    if (totalLabel) parts.push(`${totalLabel} ${format(series.reduce((sum, s) => sum + (markOf(s) === 'column' ? (s.values[index] ?? 0) : 0), 0))}`)
    return `${longLabels[index]}: ${parts.join(', ')}`
  }

  const move = (index: number) => {
    const clamped = Math.max(0, Math.min(count - 1, index))
    setActive(clamped)
    return clamped
  }

  const onPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    move(slotted ? Math.floor(ratio * count) : Math.round(ratio * (count - 1)))
  }

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null
    const current = active ?? count - 1
    if (event.key === 'ArrowRight') next = current + 1
    else if (event.key === 'ArrowLeft') next = current - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = count - 1
    else if (event.key === 'Escape') {
      setActive(null)
      return
    }
    if (next === null) return
    event.preventDefault()
    setAnnounce(describe(move(next)))
  }

  // End labels for solid lines, nudged apart when two lines finish close together.
  const ends = lines
    .filter((s) => !s.dashed)
    .map((s) => ({ id: s.id, tone: s.tone, value: s.values[s.values.length - 1] ?? 0, top: y(s.values[s.values.length - 1] ?? 0) }))
    .sort((a, b) => a.top - b.top)
  for (let i = 1; i < ends.length; i++) {
    if (ends[i].top - ends[i - 1].top < 16) ends[i].top = ends[i - 1].top + 16
  }
  const showEnds = endLabels && ends.length > 0

  const tipLeft = active !== null ? xPct(active) : 0
  const flip = tipLeft > 62
  const barWidth = `min(${((groups.length > 1 ? 0.7 : 0.58) / count / Math.max(1, groups.length)) * 100}%, ${groups.length > 1 ? 10 : 16}px)`
  const total = (index: number) => columnSeries.reduce((sum, s) => sum + (s.values[index] ?? 0), 0)

  // One bar per series per point; stacked series start where the one below ends.
  const bars: Array<{ key: string; index: number; tone: Tone; shift: number; bottom: number; value: number; top: boolean }> = []
  if (slotted) {
    for (let index = 0; index < count; index++) {
      groups.forEach((group, g) => {
        let base = 0
        const first = bars.length
        for (const s of group.series) {
          const value = s.values[index] ?? 0
          if (value > 0) bars.push({ key: `${index}-${s.id}`, index, tone: s.tone, shift: g - (groups.length - 1) / 2, bottom: base, value, top: false })
          base += value
        }
        if (bars.length > first) bars[bars.length - 1].top = true
      })
    }
  }

  const keyClass = (s: Series) =>
    cx('app-legend__key', `app-legend__key--${s.tone}`, markOf(s) === 'column' && 'app-legend__key--column', s.dashed && 'app-legend__key--dashed')

  return (
    <figure className={cx('app-chart', slotted && 'app-chart--columns', !showEnds && 'app-chart--bare')}>
      {(yLabel || (legend && (series.length > 1 || reference))) && (
        <div className="app-chart__head" aria-hidden="true">
          {yLabel && <p className="app-chart__ylabel">{yLabel}</p>}
          {legend && (series.length > 1 || reference) && (
            <ul className="app-legend">
              {series.map((s) => (
                <li key={s.id} className="app-legend__item">
                  <span className={keyClass(s)} />
                  {s.label}
                </li>
              ))}
              {reference && (
                <li className="app-legend__item">
                  <span className="app-legend__key app-legend__key--ref" />
                  {reference.label}
                </li>
              )}
            </ul>
          )}
        </div>
      )}
      <div className="app-chart__frame" style={{ '--plot-h': `${height}px` } as CSSProperties}>
        <div className="app-chart__y" aria-hidden="true">
          {ticks.map((value) => (
            <span key={value} style={{ top: `${y(value)}px` }}>
              {format(value)}
            </span>
          ))}
        </div>
        <div className="app-chart__plot">
          <svg className="app-chart__svg" viewBox={`0 0 ${VIEW_W} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {ticks.map((value) => (
              <line
                key={value}
                x1="0"
                x2={VIEW_W}
                y1={y(value)}
                y2={y(value)}
                className={value === 0 ? 'app-chart__base' : 'app-chart__grid'}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {reference && (
              <line x1="0" x2={VIEW_W} y1={y(reference.value)} y2={y(reference.value)} className="app-chart__ref" vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {slotted && (
            <div className="app-chart__columns" aria-hidden="true">
              {bars.map((bar) => (
                <span
                  key={bar.key}
                  className={cx('app-chart__column', `app-chart__column--${bar.tone}`, active === bar.index && 'is-active', bar.top && 'is-top')}
                  style={{
                    left: `calc(${((bar.index + 0.5) / count) * 100}% + ${bar.shift} * (${barWidth} + 2px))`,
                    width: barWidth,
                    bottom: `${px(bar.bottom).toFixed(1)}px`,
                    height: `${Math.max(1, px(bar.value)).toFixed(1)}px`,
                  }}
                />
              ))}
            </div>
          )}

          {lines.length > 0 && (
            <svg className="app-chart__svg app-chart__svg--lines" viewBox={`0 0 ${VIEW_W} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
              {lines.map((s, index) => (
                <g key={s.id}>
                  {s.area && <path d={paths[index].area} fill={stroke[s.tone]} className="app-chart__area" />}
                  <path
                    d={paths[index].line}
                    fill="none"
                    stroke={stroke[s.tone]}
                    strokeWidth={s.dashed ? 1.25 : 1.5}
                    strokeDasharray={s.dashed ? '4 4' : undefined}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>
          )}

          {active !== null && (
            <div aria-hidden="true">
              <span className="app-chart__crosshair" style={{ left: `${tipLeft}%` }} />
              {lines.map((s) => (
                <span key={s.id} className={`app-chart__dot app-chart__dot--${s.tone}`} style={{ left: `${tipLeft}%`, top: `${y(s.values[active] ?? 0)}px` }} />
              ))}
              <div className={cx('app-chart__tip', flip && 'app-chart__tip--flip')} style={{ left: `${tipLeft}%` }}>
                <p className="app-chart__tip-date">{longLabels[active]}</p>
                {series.map((s) => (
                  <p key={s.id} className="app-chart__tip-row">
                    <span className={keyClass(s)} />
                    <strong>{format(s.values[active] ?? 0)}</strong>
                    <span>{s.label}</span>
                  </p>
                ))}
                {totalLabel && columnSeries.length > 1 && (
                  <p className="app-chart__tip-row app-chart__tip-row--total">
                    <strong>{format(total(active))}</strong>
                    <span>{totalLabel}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {interactive && (
            <div
              className="app-chart__hit"
              role="group"
              tabIndex={0}
              aria-label={`${summary} Use the left and right arrow keys to read each point.`}
              aria-describedby={`${id}-table`}
              onPointerMove={onPointer}
              onPointerDown={onPointer}
              onPointerLeave={() => setActive(null)}
              onFocus={() => {
                if (active === null) setAnnounce(describe(move(count - 1)))
              }}
              onBlur={() => setActive(null)}
              onKeyDown={onKey}
            />
          )}
        </div>
        {showEnds && (
          <div className="app-chart__ends" aria-hidden="true">
            {ends.map((end) => (
              <span key={end.id} style={{ top: `${end.top}px` }}>
                <span className={`app-legend__key app-legend__key--${end.tone}`} />
                {format(end.value)}
              </span>
            ))}
          </div>
        )}
        <div className="app-chart__x" aria-hidden="true">
          {tickIndexes.map((index) => (
            <span
              key={index}
              className={cx(!slotted && index === 0 && 'is-first', !slotted && index === count - 1 && 'is-last')}
              style={{ left: `${xPct(index)}%` }}
            >
              {labels[index]}
            </span>
          ))}
        </div>
      </div>
      {interactive && (
        <>
          <figcaption className="app-sr">{summary}</figcaption>
          <p className="app-sr" aria-live="polite">
            {announce}
          </p>
          <div className="app-sr">
            <table id={`${id}-table`}>
              <caption>{summary}</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  {series.map((s) => (
                    <th key={s.id} scope="col">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {longLabels.map((label, index) => (
                  <tr key={index}>
                    <th scope="row">{label}</th>
                    {series.map((s) => (
                      <td key={s.id}>{format(s.values[index] ?? 0)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </figure>
  )
}

/** A tiny trend line for stat tiles. Decorative: the tile states the value. */
export function Sparkline({ values, tone = 'muted', label }: { values: number[]; tone?: Tone; label?: string }) {
  const max = Math.max(1, ...values)
  const min = Math.min(0, ...values)
  const range = max - min || 1
  const points = values.map((value, index) => {
    const x = values.length <= 1 ? 50 : (index / (values.length - 1)) * 100
    const y = 30 - ((value - min) / range) * 26
    return { x, y }
  })
  const last = points[points.length - 1]
  return (
    <span className="app-spark" aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" focusable="false" aria-hidden="true">
        <polyline
          points={points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')}
          fill="none"
          stroke={stroke[tone]}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {last && <span className={`app-spark__dot app-spark__dot--${tone}`} style={{ top: `${(last.y / 32) * 100}%` }} />}
    </span>
  )
}

export type BarRow = {
  id: string
  label: ReactNode
  value: number
  display?: string
  sub?: ReactNode
  previous?: number
  highlight?: boolean
}

/** Horizontal bars with the value at the tip; an optional tick marks the previous period. */
export function BarList({
  rows,
  max,
  format = (value) => fmtNumber(value),
  label,
  previousLabel = 'Prior period',
  stacked = false,
}: {
  rows: BarRow[]
  max?: number
  format?: (value: number) => string
  label: string
  previousLabel?: string
  /** Label and value above each bar, for narrow panels. */
  stacked?: boolean
}) {
  const top = max ?? Math.max(1, ...rows.map((row) => Math.max(row.value, row.previous ?? 0)))
  const hasPrevious = rows.some((row) => row.previous !== undefined)
  return (
    <div className={cx('app-bars', stacked && 'app-bars--stacked')}>
      {hasPrevious && (
        <ul className="app-legend" aria-hidden="true">
          <li className="app-legend__item">
            <span className="app-legend__key app-legend__key--column" />
            This period
          </li>
          <li className="app-legend__item">
            <span className="app-legend__key app-legend__key--tick" />
            {previousLabel}
          </li>
        </ul>
      )}
      <ul className="app-bars__list" aria-label={label}>
        {rows.map((row) => (
          <li key={row.id} className="app-bars__row">
            <span className="app-bars__label">
              {row.label}
              {row.sub && <span className="app-bars__sub">{row.sub}</span>}
            </span>
            <span className="app-bars__track" aria-hidden="true">
              <span className={cx('app-bars__bar', row.highlight && 'app-bars__bar--accent')} style={{ width: `${(row.value / top) * 100}%` }} />
              {row.previous !== undefined && <span className="app-bars__tick" style={{ left: `${(row.previous / top) * 100}%` }} />}
            </span>
            <span className="app-bars__value">
              {row.display ?? format(row.value)}
              {row.previous !== undefined && <span className="app-sr">{`, ${previousLabel.toLowerCase()} ${format(row.previous)}`}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** One 100% bar split into ordered parts, with a legend that carries the numbers. */
export function StackedBar({
  parts,
  label,
}: {
  parts: Array<{ id: string; label: string; value: number; display: string; detail?: string; shade: 1 | 2 | 3 | 4 }>
  label: string
}) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1
  return (
    <div className="app-stack">
      <div className="app-stack__bar" aria-hidden="true">
        {parts
          .filter((part) => part.value > 0)
          .map((part) => (
            <span key={part.id} className={`app-stack__part app-stack__part--${part.shade}`} style={{ flexGrow: part.value / total }} />
          ))}
      </div>
      <ul className="app-stack__legend" aria-label={label}>
        {parts.map((part) => (
          <li key={part.id}>
            <span className={`app-stack__swatch app-stack__part--${part.shade}`} aria-hidden="true" />
            <span className="app-stack__name">{part.label}</span>
            <span className="app-stack__value">{part.display}</span>
            {part.detail && <span className="app-stack__detail">{part.detail}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
