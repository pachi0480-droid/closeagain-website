'use client'

import { useState } from 'react'
import { Illustrative } from '@/components/ui/Disclaimer'
import { LIFECYCLE, capabilities } from '@/data/capabilities'

/**
 * Coverage map: the path a job takes from demand to the board, with each
 * capability drawn across the stages it acts on.
 *
 * This is the one picture that answers "what does it actually cover" without
 * a paragraph. Hovering a bar dims the rest so the span reads clearly.
 */
export function LifecycleMap() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="on-ink overflow-hidden rounded-[14px] border border-rule-ink bg-ink px-5 py-6 text-chalk sm:px-8 sm:py-8">
      <div className="pointer-events-none -mx-8 -mt-8 mb-8 h-px bg-gradient-to-r from-transparent via-chalk/12 to-transparent" />

      {/* --- the lifecycle itself ------------------------------------- */}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-mono-xs text-chalk-3 uppercase">
          The path a job takes
        </h3>
        <span className="font-mono text-mono-xs text-recover-bright uppercase">
          Booked
        </span>
      </div>

      {/* stage labels: a scrollable strip on small screens rather than
          five columns of unreadable text */}
      <div className="-mx-5 mt-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="min-w-[38rem] sm:min-w-0">
          <div
            className="grid gap-x-2"
            style={{ gridTemplateColumns: `repeat(${LIFECYCLE.length}, minmax(0, 1fr))` }}
          >
            {LIFECYCLE.map((stage, i) => (
              <div key={stage} className="border-l border-rule-ink pl-3">
                <span className="tnum font-mono text-mono-xs text-chalk-3/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-1 text-[0.8125rem] leading-tight text-chalk-2">
                  {stage}
                </p>
              </div>
            ))}
          </div>

          {/* --- capability spans ------------------------------------ */}
          <div className="relative mt-6 border-t border-rule-ink pt-2">
            {/* column guides, on the same grid as the stage labels so a bar's
                start and end read against the stage it belongs to */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid gap-x-2"
              style={{ gridTemplateColumns: `repeat(${LIFECYCLE.length}, minmax(0, 1fr))` }}
            >
              {LIFECYCLE.map((stage) => (
                <div key={stage} className="border-l border-rule-ink-soft" />
              ))}
            </div>

            <ul className="relative">
            {capabilities.map((capability) => {
              const dimmed = active !== null && active !== capability.id
              const [start, end] = capability.span
              const full = start === 1 && end === LIFECYCLE.length

              return (
                <li
                  key={capability.id}
                  onMouseEnter={() => setActive(capability.id)}
                  onMouseLeave={() => setActive(null)}
                  className="group py-2"
                >
                  <div
                    className="grid items-center gap-x-2"
                    style={{
                      gridTemplateColumns: `repeat(${LIFECYCLE.length}, minmax(0, 1fr))`,
                    }}
                  >
                    <div
                      style={{ gridColumn: `${start} / ${end + 1}` }}
                      className={`flex items-center gap-2.5 rounded-[6px] border px-3 py-2 transition-all duration-400 [transition-timing-function:var(--ease-out-quiet)] ${
                        dimmed
                          ? 'border-rule-ink bg-chalk/[0.02] opacity-45'
                          : full
                            ? 'border-chalk/15 bg-chalk/[0.05]'
                            : 'border-recover-bright/25 bg-recover-deep/35'
                      }`}
                    >
                      <span
                        className={`h-[5px] w-[5px] shrink-0 rounded-full ${
                          full ? 'bg-chalk-3' : 'bg-recover-bright'
                        }`}
                      />
                      <span className="truncate text-[0.8125rem] text-chalk">
                        {capability.name}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule-ink pt-5">
        <span className="flex items-center gap-2">
          <span className="h-[5px] w-[5px] rounded-full bg-recover-bright" />
          <span className="font-mono text-mono-xs text-chalk-3 uppercase">
            Acts on this stage
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-[5px] w-[5px] rounded-full bg-chalk-3" />
          <span className="font-mono text-mono-xs text-chalk-3 uppercase">
            Runs across all of them
          </span>
        </span>
      </div>

      <Illustrative tone="ink" className="mt-5">
        Illustrative coverage · capability depth set with pilot operators
      </Illustrative>
    </div>
  )
}
