'use client'

import { RecoveryPulse } from '@/components/visuals/RecoveryPulse'
import { Illustrative } from '@/components/ui/Disclaimer'
import { loopStages, recordThrough } from '@/data/loop'

/**
 * The recovery engine, as a spatial scene.
 *
 * Five layers arranged in depth, the active one square to the viewer and the
 * rest angled away. Beneath them, one opportunity travels a rail; below that,
 * the same record accumulates as each layer attaches what it knows.
 *
 * Built with CSS 3D transforms rather than WebGL: the scene is five plates and
 * a rail, and a canvas would cost a dependency and a frame budget to draw
 * something the compositor already does for free.
 */
export function RecoveryEngine({ active }: { active: number }) {
  const stage = loopStages[active]
  const rows = recordThrough(active)
  const recovered = stage.state === 'recovered'

  return (
    <div>
      {/* --- the layers, in depth ---------------------------------
          Clipped on a wrapper outside the perspective context, so distant
          plates recede behind a fade instead of extending the page. */}
      <div
        aria-hidden="true"
        className="overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
        }}
      >
        <div className="relative h-[12rem] [perspective:1400px]">
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {loopStages.map((layer, i) => {
            const d = i - active
            const far = Math.abs(d)
            return (
              <div
                key={layer.id}
                className="absolute top-1/2 left-1/2 w-[15rem] -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-[750ms] [transition-timing-function:var(--ease-in-out-quiet)]"
                style={{
                  transform: `translate3d(${d * 178}px, 0, ${-far * 130}px) rotateY(${Math.max(-42, Math.min(42, -d * 34))}deg) scale(${1 - far * 0.06})`,
                  opacity: far > 2 ? 0 : 1 - far * 0.34,
                  zIndex: 20 - far,
                }}
              >
                <div
                  className={`rounded-[12px] border px-5 py-5 transition-colors duration-[750ms] ${
                    d === 0
                      ? 'border-chalk/20 bg-ink-raise shadow-[0_30px_60px_-38px_rgba(0,0,0,0.9)]'
                      : 'border-rule-ink bg-ink-raise/50'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={`tnum font-mono text-mono-xs transition-colors duration-500 ${
                        d === 0 ? 'text-recover-bright' : 'text-chalk-3/70'
                      }`}
                    >
                      {layer.index}
                    </span>
                    <span
                      className={`h-[5px] w-[5px] rounded-full transition-colors duration-500 ${
                        i < active
                          ? 'bg-chalk/40'
                          : i === active
                            ? 'bg-recover-bright'
                            : 'bg-chalk/15'
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-6 text-[1.125rem] tracking-[-0.02em] transition-colors duration-500 ${
                      d === 0 ? 'text-chalk' : 'text-chalk-3'
                    }`}
                  >
                    {layer.title}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] text-chalk-3">{layer.plate}</p>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {/* --- the rail the opportunity travels ---------------------- */}
      <div aria-hidden="true" className="relative mt-2 h-3">
        <div className="rail-sheen-ink absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-px -translate-y-1/2 transition-[width] duration-[750ms] [transition-timing-function:var(--ease-in-out-quiet)]"
          style={{
            width: `${((active + 0.5) / loopStages.length) * 100}%`,
            backgroundImage:
              'linear-gradient(to right, var(--color-dormant-ink), var(--color-engaged-ink) 55%, var(--color-recover-bright))',
          }}
        />
        <span
          className="travel absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${((active + 0.5) / loopStages.length) * 100}%` }}
        >
          <span className="relative block">
            <RecoveryPulse fire={recovered} />
            <span
              className={`relative block h-2.5 w-2.5 rounded-full ring-4 ring-ink transition-colors duration-500 ${
                recovered
                  ? 'bg-recover-bright'
                  : stage.state === 'engaged'
                    ? 'bg-engaged-ink'
                    : 'bg-dormant-ink'
              }`}
            />
          </span>
        </span>
      </div>

      {/* --- the record, accumulating ------------------------------ */}
      <div className="mt-8 rounded-[14px] border border-rule-ink bg-ink-raise/40 px-6 py-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
            The opportunity
          </h3>
          <span className="tnum font-mono text-mono-xs text-chalk-3">
            (352) 555-0148
          </span>
        </div>

        {/* The record fills from the bottom; earlier facts recede upward
            behind a mask rather than reserving all thirteen rows of height. */}
        <div
          className="mt-4 flex max-h-[19rem] flex-col justify-end overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, #000 12%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 12%)',
          }}
        >
          <dl>
            {rows.map((row, i) => (
              <div
                key={`${row.stage}-${row.label}`}
                className="flex items-baseline justify-between gap-6 border-b border-rule-ink-soft py-2.5 last:border-b-0"
                style={{
                  animation: 'feed-in 0.5s var(--ease-out-quiet) both',
                  animationDelay: `${Math.max(0, i - (rows.length - stage.adds.length)) * 70}ms`,
                }}
              >
                <dt className="flex items-baseline gap-3">
                  <span className="tnum font-mono text-[0.625rem] text-chalk-3/60">
                    {row.stage}
                  </span>
                  <span className="font-mono text-mono-xs text-chalk-3 uppercase">
                    {row.label}
                  </span>
                </dt>
                <dd className="tnum text-right text-[0.9375rem] text-chalk">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Illustrative tone="ink" className="mt-3.5">
        Illustrative recovery flow
      </Illustrative>
    </div>
  )
}
