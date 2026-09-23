'use client'

import { StatusTag } from '@/components/ui/StatusDot'
import type { LoopStage as Stage } from '@/data/loop'

/** The five-node track with one opportunity travelling along it. */
export function LoopTrack({
  stages,
  active,
  className = '',
}: {
  stages: Stage[]
  active: number
  className?: string
}) {
  const state = stages[active].state

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* the track */}
      <div className="relative h-px w-full bg-chalk/12">
        <div
          className="absolute inset-y-0 left-0 origin-left transition-[width] duration-700 [transition-timing-function:var(--ease-out-quiet)]"
          style={{
            width: `${((active + 0.5) / stages.length) * 100}%`,
            backgroundImage:
              'linear-gradient(to right, var(--color-dormant-ink), var(--color-engaged-ink) 55%, var(--color-recover-bright))',
          }}
        />
        {stages.map((stage, i) => (
          <span
            key={stage.id}
            className={`absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-[3px] ring-ink transition-colors duration-500 ${
              i < active
                ? 'bg-chalk/45'
                : i === active
                  ? state === 'recovered'
                    ? 'bg-recover-bright'
                    : state === 'engaged'
                      ? 'bg-engaged-ink'
                      : 'bg-dormant-ink'
                  : 'bg-chalk/15'
            }`}
            style={{ left: `${((i + 0.5) / stages.length) * 100}%` }}
          />
        ))}
      </div>

      {/* the opportunity, moving */}
      <div
        className="absolute -top-[2.1rem] -translate-x-1/2 transition-[left] duration-700 [transition-timing-function:var(--ease-in-out-quiet)]"
        style={{ left: `${((active + 0.5) / stages.length) * 100}%` }}
      >
        <span
          className={`block rounded-[5px] border px-2 py-1 font-mono text-mono-xs whitespace-nowrap uppercase transition-colors duration-700 ${
            state === 'recovered'
              ? 'border-recover-bright/45 bg-recover-deep/50 text-recover-bright'
              : state === 'engaged'
                ? 'border-engaged-ink/40 bg-engaged-ink/10 text-engaged-ink'
                : 'border-chalk/15 bg-chalk/5 text-dormant-ink'
          }`}
        >
          (352) 555-0148
        </span>
      </div>

      {/* stage numbers under the track */}
      <div className="relative mt-4 h-4">
        {stages.map((stage, i) => (
          <span
            key={stage.id}
            className={`tnum absolute -translate-x-1/2 font-mono text-mono-xs transition-colors duration-500 ${
              i === active ? 'text-chalk' : 'text-chalk-3/60'
            }`}
            style={{ left: `${((i + 0.5) / stages.length) * 100}%` }}
          >
            {stage.index}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * The operational read-out for a stage. All stages are rendered and stacked so
 * the panel has a fixed height and nothing reflows as the scroll advances.
 */
export function LoopReadout({
  stages,
  active,
}: {
  stages: Stage[]
  active: number
}) {
  return (
    <div className="relative">
      {stages.map((stage, i) => (
        <div
          key={stage.id}
          aria-hidden={i !== active}
          className={`transition-all duration-500 [transition-timing-function:var(--ease-out-quiet)] ${
            i === active
              ? 'relative translate-y-0 opacity-100'
              : 'pointer-events-none absolute inset-0 translate-y-2 opacity-0'
          }`}
        >
          <dl>
            {stage.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-6 border-b border-rule-ink-soft py-4 last:border-b-0"
              >
                <dt className="font-mono text-mono-xs text-chalk-3 uppercase">
                  {row.label}
                </dt>
                <dd className="tnum text-right text-[0.9375rem] text-chalk">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

export function LoopStatus({ stage }: { stage: Stage }) {
  const label =
    stage.state === 'recovered'
      ? 'Recovered'
      : stage.state === 'engaged'
        ? 'In recovery'
        : 'Slipping'

  return (
    <StatusTag
      state={stage.state}
      label={label}
      tone="ink"
      pulse={stage.state === 'engaged'}
    />
  )
}
