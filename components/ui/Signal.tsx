import { stateMeta, type SignalState } from '@/data/signals'

/**
 * A state badge. Colour and glyph carry the state, and so does the word —
 * nothing on this site is communicated by colour alone.
 */
export function StateBadge({
  state,
  className = '',
  pulse = false,
}: {
  state: SignalState
  className?: string
  pulse?: boolean
}) {
  const meta = stateMeta[state]
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase ${meta.text} ${className}`}
    >
      <span
        aria-hidden="true"
        className="dot"
        data-pulse={pulse ? 'true' : undefined}
      />
      {meta.label}
    </span>
  )
}

/** A label/value pair in the technical voice used across every module. */
export function Fact({
  label,
  value,
  state,
  className = '',
}: {
  label: string
  value: string
  state?: SignalState
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="font-mono text-mono-xs uppercase text-secondary">{label}</dt>
      <dd
        className={`mt-1 text-[0.9375rem] tracking-[-0.01em] ${
          state ? stateMeta[state].text : 'text-warm-white'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
