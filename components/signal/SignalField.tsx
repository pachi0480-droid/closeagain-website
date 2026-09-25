'use client'

import { Mark } from '@/components/ui/Mark'
import { heroSignals, stateMeta, type HeroSignal } from '@/data/signals'
import { useProximity } from '@/lib/hooks'

/**
 * The Signal Room.
 *
 * Opportunities enter the field from the edges, each carrying its source, its
 * state and the time since it last moved. Every one of them is wired to a
 * single node, and light travels those wires toward it — the system taking
 * each signal and assigning it a next action. A booked signal holds its green.
 *
 * The composition is authored, not random: positions live in `data/signals`
 * so the field reads as a considered arrangement at every viewport rather
 * than a particle effect.
 */

/** The connector from a signal to the node, routed orthogonally. */
function connector(signal: HeroSignal) {
  const { x, y } = signal
  // Run to the node's column first, then down or up its axis. An L reads as a
  // trace on a board; a curve reads as decoration.
  return `M ${x} ${y} H 50 V 50`
}

function SignalCard({ signal }: { signal: HeroSignal }) {
  const meta = stateMeta[signal.state]

  return (
    <div
      data-signal
      className="signal-card absolute w-[9rem] xl:w-[11.5rem]"
      style={{
        left: `${signal.x}%`,
        top: `${signal.y}%`,
        // Entry direction follows which edge the signal is nearest.
        ['--from-x' as string]: signal.x < 50 ? '-18px' : '18px',
        ['--enter' as string]: `${signal.enter}s`,
        ['--signal-colour' as string]: meta.colour,
      }}
    >
      <div className="signal-card-inner border-l border-steel bg-graphite-deep/80 py-2.5 pr-3 pl-3 backdrop-blur-[2px]">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-mono-xs tracking-[0.08em] text-secondary tnum">
            {signal.stamp}
          </span>
          <span
            aria-hidden="true"
            className="text-[0.5rem]"
            style={{ color: meta.colour }}
          >
            {meta.glyph}
          </span>
        </div>

        <p className="mt-1.5 font-mono text-mono-xs uppercase text-muted">
          {signal.kind}
        </p>

        <p className="mt-2 text-[0.9375rem] leading-tight tracking-[-0.015em] text-warm-white">
          {signal.detail}
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-secondary">{signal.place}</p>

        <p
          className="mt-2.5 font-mono text-mono-xs uppercase"
          style={{ color: meta.colour }}
        >
          {signal.status}
        </p>
      </div>
    </div>
  )
}

export function SignalField({ className = '' }: { className?: string }) {
  const ref = useProximity<HTMLDivElement>()

  // Signals that are moving get light travelling their connector.
  const traced = heroSignals.filter(
    (s) => s.state === 'active' || s.state === 'booked' || s.state === 'new',
  )

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      role="img"
      aria-label={
        'An illustrative field of live opportunity signals — new inquiries, ' +
        'missed calls, open estimates and past customers — each wired to the ' +
        'CloseAgain node, which assigns every one of them a next action.'
      }
    >
      {/* the field's own grid */}
      <div
        aria-hidden="true"
        className="field-grid absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
      />

      {/* connectors */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {heroSignals.map((signal) => (
          <path
            key={signal.id}
            d={connector(signal)}
            fill="none"
            stroke="var(--color-steel)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {traced.map((signal, i) => (
          <path
            key={`trace-${signal.id}`}
            className="trace"
            d={connector(signal)}
            fill="none"
            stroke={stateMeta[signal.state].colour}
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ ['--trace-delay' as string]: `${signal.enter + i * 0.6}s` }}
            opacity={0.9}
          />
        ))}
      </svg>

      {/* the node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center">
          <span
            aria-hidden="true"
            className="node-ring absolute inset-0 rounded-full border border-signal/40"
          />
          <span
            aria-hidden="true"
            className="node-ring absolute inset-0 rounded-full border border-signal/40"
            style={{ ['--ring-delay' as string]: '1.7s' }}
          />
          <span className="relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border border-signal/45 bg-graphite text-signal shadow-[0_0_0_10px_rgba(8,10,9,0.92),0_0_40px_-8px_rgba(183,255,106,0.35)]">
            <Mark className="h-4 w-auto" animated={false} />
          </span>
        </div>

        {/* what the node is doing, said plainly */}
        <p className="mt-3 text-center font-mono text-mono-xs whitespace-nowrap uppercase text-secondary">
          Assigning next actions
        </p>
      </div>

      {heroSignals.map((signal) => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  )
}

/**
 * The mobile field: the same language, recomposed rather than shrunk. Three
 * signals in a readable column, each one showing the next action it was given.
 */
export function SignalStrip({ className = '' }: { className?: string }) {
  const shown = [heroSignals[0], heroSignals[1], heroSignals[5]]

  return (
    <ul className={`space-y-px ${className}`}>
      {shown.map((signal, i) => {
        const meta = stateMeta[signal.state]
        return (
          <li
            key={signal.id}
            className="signal-card flex items-center gap-3 border-l-2 bg-graphite-deep/70 px-3.5 py-3"
            style={{
              borderLeftColor: meta.colour,
              ['--enter' as string]: `${0.3 + i * 0.35}s`,
              ['--from-x' as string]: '-12px',
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="font-mono text-mono-xs uppercase text-secondary">
                {signal.kind} · {signal.stamp}
              </p>
              <p className="mt-1 truncate text-[0.9375rem] tracking-[-0.015em] text-warm-white">
                {signal.detail}
              </p>
            </div>
            <span
              className="shrink-0 font-mono text-mono-xs uppercase"
              style={{ color: meta.colour }}
            >
              {signal.status}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
