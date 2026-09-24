'use client'

import { useMemo } from 'react'
import { recordThrough } from '@/data/loop'
import { scenarios } from '@/data/scenarios'
import { useScrollVar } from '@/lib/hooks'

/**
 * Recovery engine → product stage.
 *
 * The engine finished with a complete record: seven facts attached to one
 * opportunity. Those rows now converge and compress into the single feed row
 * that sits at the top of the product stage — the record becomes the row an
 * office would actually click on.
 *
 * The surface returns from ink to warm ground at the same time, so the site
 * comes back up into the light as the machinery resolves.
 */
export function Resolve() {
  const rows = useMemo(() => recordThrough(4), [])
  const scenario = scenarios[0]
  const ref = useScrollVar<HTMLDivElement>()
  const half = (rows.length - 1) / 2

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="relative h-[102vh] lg:h-[124vh]"
      style={{ '--p': 0 } as React.CSSProperties}
    >
      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        style={{
          background:
            'color-mix(in oklab, var(--color-ink-raise-2) calc(var(--p) * 100%), var(--color-ink))',
        }}
      >
        <div className="shell w-full">
          <p
            className="font-mono text-mono-xs uppercase"
            style={{
              // Mixed toward the full-strength inks at each end, so the label
              // never lands grey-on-grey in the middle of the transition.
              color:
                'var(--color-chalk-3)',
              opacity: `clamp(0, min(calc((var(--p) + 0.1) * 8), calc((1.2 - var(--p)) * 8)), 1)`,
            }}
          >
            {`One recovered opportunity, on the board`}
          </p>

          {/* --- the record, collapsing ---------------------------- */}
          <div className="relative mt-10 h-[13rem]">
            {rows.map((row, i) => (
              <div
                key={`${row.stage}-${row.label}`}
                className="absolute inset-x-0 flex items-baseline justify-between gap-6 border-b"
                style={{
                  top: `calc(50% + (1 - var(--p)) * ${(i - half) * 34}px)`,
                  borderColor:
                    'color-mix(in oklab, transparent calc(var(--p) * 100%), var(--color-rule-ink))',
                  opacity: `clamp(0, calc((0.78 - var(--p)) * 4), 1)`,
                  paddingBottom: '0.6rem',
                }}
              >
                <span
                  className="font-mono text-mono-xs uppercase"
                  style={{ color: 'var(--color-chalk-3)' }}
                >
                  {row.label}
                </span>
                <span
                  className="tnum text-[0.9375rem]"
                  style={{ color: 'var(--color-chalk)' }}
                >
                  {row.value}
                </span>
              </div>
            ))}

            {/* --- what it becomes ------------------------------- */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
              style={{ opacity: `clamp(0, calc((var(--p) - 0.62) * 4), 1)` }}
            >
              <div className="relative max-w-[30rem] rounded-[10px] border border-rule-ink bg-ink-raise-3 px-4 py-3.5 shadow-[0_18px_40px_-28px_rgba(13,15,14,0.35)]">
                <span className="absolute inset-y-2.5 left-0 w-[2px] rounded-full bg-recover-bright" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.9375rem] text-chalk">
                    {scenario.customer}
                  </span>
                  <span className="tnum font-mono text-mono-sm text-chalk-3">
                    6:47 PM
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-[5px] w-[5px] rounded-full bg-recover-bright" />
                  <span className="text-[0.8125rem] text-chalk-2">
                    AC repair · {scenario.result}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
