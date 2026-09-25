'use client'

import { useId } from 'react'

/**
 * One calculator assumption: a typed value and a dragged value, both editing
 * the same number. The label is real, the range is stated, and nothing about
 * the maths is hidden.
 */
export function SliderField({
  label,
  hint,
  value,
  min,
  max,
  step,
  suffix,
  prefix,
  format,
  curve = 1,
  onChange,
  onCommit,
}: {
  label: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  prefix?: string
  format: (n: number) => string
  /**
   * Response curve for the drag. 1 is linear; higher values give the low end
   * of a wide range more of the track, which is what makes a $150–$25,000
   * field usable with a thumb.
   */
  curve?: number
  onChange: (n: number) => void
  onCommit?: () => void
}) {
  const id = useId()
  const numberId = `${id}-number`
  const labelId = `${id}-label`

  const TICKS = 1000
  const toTick = (n: number) =>
    Math.round(Math.pow((n - min) / (max - min), 1 / curve) * TICKS)
  const fromTick = (t: number) => {
    const raw = min + (max - min) * Math.pow(t / TICKS, curve)
    return Math.round(raw / step) * step
  }

  const tick = toTick(value)
  const fill = (tick / TICKS) * 100

  return (
    <div className="border-b border-rule py-5 first:pt-0 last:border-b-0">
      <div className="flex items-end justify-between gap-5">
        <label
          id={labelId}
          htmlFor={numberId}
          className="font-mono text-mono-xs text-muted uppercase"
        >
          {label}
        </label>

        <div className="flex items-baseline gap-1 text-warm-white">
          {prefix ? (
            <span className="font-mono text-[0.9375rem] text-secondary">{prefix}</span>
          ) : null}
          <input
            id={numberId}
            type="number"
            inputMode="numeric"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const next = Number(e.target.value)
              if (Number.isFinite(next)) onChange(next)
            }}
            onBlur={onCommit}
            className="bare-number tnum w-[5.5ch] rounded-[5px] bg-transparent text-right font-mono text-[1.375rem] text-warm-white transition-colors duration-300 hover:bg-warm-white/5 focus:bg-warm-white/5"
          />
          {suffix ? (
            <span className="font-mono text-[0.9375rem] text-secondary">{suffix}</span>
          ) : null}
        </div>
      </div>

      <input
        type="range"
        className="slider mt-1.5"
        aria-labelledby={labelId}
        value={tick}
        min={0}
        max={TICKS}
        step={1}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={`${prefix ?? ''}${format(value)}${suffix ?? ''}`}
        onChange={(e) => onChange(fromTick(Number(e.target.value)))}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
      />

      <div className="mt-1 flex items-baseline justify-between gap-4">
        <p className="max-w-[34ch] text-[0.8125rem] leading-snug text-secondary">
          {hint}
        </p>
        <p className="tnum shrink-0 font-mono text-mono-xs text-secondary">
          {prefix ?? ''}
          {format(min)}
          {suffix ?? ''} – {prefix ?? ''}
          {format(max)}
          {suffix ?? ''}
        </p>
      </div>
    </div>
  )
}
