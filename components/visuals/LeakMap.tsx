'use client'

import { useMemo } from 'react'
import { Illustrative } from '@/components/ui/Disclaimer'
import {
  LEAK_STAGES,
  MAP,
  bookedPath,
  flows,
  laneY,
  lostPath,
  recoveredPath,
  stageX,
} from '@/data/leak-map'

/**
 * The Leak Map: eighteen opportunities crossing from interest to revenue.
 *
 * Six make it on their own and converge into a bundle at the right — revenue
 * collecting. Twelve stop at a gate and fall out of the flow. Turning
 * CloseAgain on reconnects seven of those twelve; five stay lost, which is the
 * honest version and also the more convincing one.
 *
 * Drawn as one SVG rather than a grid of cards, because the subject is
 * movement and where it stops.
 */
export function LeakMap({ on, drawn }: { on: boolean; drawn: boolean }) {
  const { booked, lost } = useMemo(() => {
    const b = flows.filter((f) => f.stopsAt === null)
    const l = flows.filter((f) => f.stopsAt !== null)
    return { booked: b, lost: l }
  }, [])

  // Recovered runs join the bundle after the ones that booked unaided.
  const recovered = lost.filter((f) => f.recoverable)
  const bundleSize = booked.length + recovered.length

  return (
    <figure className="m-0">
      <div className="stage-ink hairline-top relative overflow-hidden rounded-[16px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: on ? 1 : 0,
            background:
              'radial-gradient(52% 70% at 88% 50%, color-mix(in oklab, var(--color-recover) 20%, transparent), transparent 70%)',
          }}
        />

        <svg
          viewBox={`0 0 ${MAP.w} ${MAP.h}`}
          className="relative block w-full"
          role="img"
          aria-label={`Illustrative flow of ${flows.length} opportunities from interest to revenue. ${booked.length} book without help and ${lost.length} stop along the way. With CloseAgain, ${recovered.length} of those ${lost.length} are reconnected and ${lost.length - recovered.length} remain lost.`}
        >
          {/* --- stage gates ------------------------------------------- */}
          {stageX.map((x, i) => (
            <g key={LEAK_STAGES[i]}>
              <line
                x1={x}
                y1={26}
                x2={x}
                y2={MAP.h - 40}
                stroke="rgb(244 242 237 / 0.13)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={16}
                textAnchor={i === 0 ? 'start' : i === stageX.length - 1 ? 'end' : 'middle'}
                className="fill-chalk-3 font-mono"
                style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}
              >
                {LEAK_STAGES[i].toUpperCase()}
              </text>
            </g>
          ))}

          {/* --- opportunities that leak ------------------------------- */}
          {lost.map((flow, i) => {
            const stop = flow.stopsAt as number
            const path = lostPath(flow.lane, stop)
            const reconnected = on && flow.recoverable
            return (
              <g key={`lost-${flow.lane}`}>
                <path
                  d={path}
                  fill="none"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  className="path-draw transition-[stroke,opacity] duration-[900ms]"
                  data-drawn={drawn}
                  stroke={reconnected ? 'rgb(108 110 105 / 0.22)' : 'rgb(108 110 105 / 0.55)'}
                  style={
                    {
                      '--len': 1200,
                      '--draw-delay': `${i * 55}ms`,
                      opacity: reconnected ? 0.4 : 1,
                    } as React.CSSProperties
                  }
                />
                {/* the break */}
                <circle
                  cx={stageX[stop]}
                  cy={laneY(flow.lane)}
                  r="3"
                  fill="var(--color-ink)"
                  strokeWidth="1"
                  className="transition-[stroke] duration-700"
                  stroke={reconnected ? 'var(--color-recover-bright)' : 'var(--color-dormant-ink)'}
                />
              </g>
            )
          })}

          {/* --- reason labels, one per distinct gate ------------------ */}
          {lost.map((flow, i) => {
            if (i % 2 !== 0) return null
            const stop = flow.stopsAt as number
            return (
              <text
                key={`label-${flow.lane}`}
                x={stageX[stop] + 118}
                y={laneY(flow.lane) + 78}
                className="fill-dormant-ink font-mono transition-opacity duration-700"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: drawn ? (on && flow.recoverable ? 0.25 : 0.85) : 0,
                  transitionDelay: `${700 + i * 40}ms`,
                }}
              >
                {flow.reason?.toUpperCase()}
              </text>
            )
          })}

          {/* --- opportunities that book unaided ---------------------- */}
          {booked.map((flow, i) => (
            <path
              key={`booked-${flow.lane}`}
              d={bookedPath(flow.lane, i, bundleSize)}
              fill="none"
              stroke="rgb(244 242 237 / 0.72)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="path-draw"
              data-drawn={drawn}
              style={{ '--len': 1400, '--draw-delay': `${i * 65}ms` } as React.CSSProperties}
            />
          ))}

          {/* --- what CloseAgain reconnects --------------------------- */}
          {recovered.map((flow, i) => (
            <path
              key={`rec-${flow.lane}`}
              d={recoveredPath(flow.lane, flow.stopsAt as number, booked.length + i, bundleSize)}
              fill="none"
              stroke="var(--color-recover-bright)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="path-draw"
              data-drawn={on && drawn}
              style={
                {
                  '--len': 1000,
                  '--draw-delay': `${i * 90}ms`,
                  opacity: on ? 0.95 : 0,
                  transition: 'opacity 500ms var(--ease-out-quiet)',
                } as React.CSSProperties
              }
            />
          ))}

          {/* --- revenue: the bundle arrives somewhere -------------- */}
          <g
            className="transition-opacity duration-[900ms]"
            style={{ opacity: drawn ? 1 : 0, transitionDelay: '900ms' }}
          >
            <line
              x1={MAP.right}
              y1={26}
              x2={MAP.right}
              y2={MAP.h - 40}
              stroke="var(--color-recover-bright)"
              strokeWidth="1"
              opacity="0.28"
            />
            <rect
              x={MAP.right - 2}
              y={MAP.h / 2 - (bundleSize * 13) / 2 - 10}
              width="4"
              height={bundleSize * 13 + 20}
              rx="2"
              fill="var(--color-recover-bright)"
              className="transition-all duration-700"
              style={{ opacity: on ? 1 : 0.75 }}
            />
          </g>
        </svg>

        {/* --- key -------------------------------------------------- */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 border-t border-rule-ink px-5 py-4 sm:px-7">
          <Key tone="chalk" label={`${booked.length} book anyway`} />
          <Key tone="dormant" label={`${lost.length} stop somewhere`} />
          <Key
            tone="recover"
            label={`${recovered.length} reconnected`}
            dim={!on}
          />
          <span className="ml-auto font-mono text-mono-xs text-chalk-3 uppercase">
            {lost.length - recovered.length} still lost
          </span>
        </div>
      </div>

      <figcaption className="mt-3.5">
        <Illustrative>
          Illustrative flow · the shape of the problem, not measured results
        </Illustrative>
      </figcaption>
    </figure>
  )
}

function Key({
  tone,
  label,
  dim = false,
}: {
  tone: 'chalk' | 'dormant' | 'recover'
  label: string
  dim?: boolean
}) {
  const colour =
    tone === 'recover'
      ? 'var(--color-recover-bright)'
      : tone === 'dormant'
        ? 'var(--color-dormant-ink)'
        : 'rgb(244 242 237 / 0.55)'

  return (
    <span
      className="flex items-center gap-2 transition-opacity duration-500"
      style={{ opacity: dim ? 0.35 : 1 }}
    >
      <span className="h-px w-5" style={{ backgroundColor: colour }} />
      <span className="font-mono text-mono-xs text-chalk-2 uppercase">{label}</span>
    </span>
  )
}
