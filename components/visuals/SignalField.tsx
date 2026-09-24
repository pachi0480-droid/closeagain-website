'use client'

import type { OpportunityState } from '@/data/scenarios'

/**
 * The live business behind the scene.
 *
 * Faint evidence that many opportunities are moving through this operation at
 * once, so the product reads as infrastructure rather than one chat window.
 * Everything here is subdued on purpose — the foreground event is the subject.
 */

type Signal = {
  label: string
  /** Percentage position within the field. */
  x: number
  y: number
  state: OpportunityState
  /** Drift distance and duration, so nothing moves in lockstep. */
  drift: number
  ms: number
}

const SIGNALS: Signal[] = [
  { label: 'Website lead', x: 52, y: 10, state: 'neutral', drift: 74, ms: 38000 },
  { label: 'Inbound call', x: 30, y: 90, state: 'neutral', drift: -58, ms: 44000 },
  { label: 'Estimate sent', x: 41, y: 24, state: 'neutral', drift: 66, ms: 52000 },
  { label: 'Follow-up due', x: 58, y: 78, state: 'engaged', drift: -48, ms: 41000 },
  { label: 'Appointment', x: 74, y: 36, state: 'neutral', drift: 54, ms: 47000 },
  { label: 'Old lead', x: 88, y: 68, state: 'lost', drift: -70, ms: 55000 },
  { label: 'Referral', x: 46, y: 80, state: 'neutral', drift: 44, ms: 49000 },
  { label: 'Missed call', x: 64, y: 8, state: 'lost', drift: -62, ms: 43000 },
]

const dot: Record<OpportunityState, string> = {
  neutral: 'bg-graphite-3/45',
  lost: 'bg-dormant/40',
  engaged: 'bg-engaged/40',
  recovered: 'bg-recover/50',
}

export function SignalField({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {SIGNALS.map((signal) => (
        <span
          key={signal.label}
          className="signal-drift absolute flex items-center gap-2 whitespace-nowrap"
          style={
            {
              left: `${signal.x}%`,
              top: `${signal.y}%`,
              '--drift': `${signal.drift}px`,
              '--drift-ms': `${signal.ms}ms`,
            } as React.CSSProperties
          }
        >
          <span className={`h-[3px] w-[3px] rounded-full ${dot[signal.state]}`} />
          <span className="font-mono text-[0.5625rem] tracking-[0.14em] text-chalk-3/55 uppercase">
            {signal.label}
          </span>
        </span>
      ))}
    </div>
  )
}
