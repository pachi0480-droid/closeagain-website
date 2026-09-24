'use client'

import { useMemo } from 'react'
import { useScrollVar } from '@/lib/hooks'

const LINES = 18

/**
 * Leak Map → Recovery Engine.
 *
 * The month collapses back to one. Seventeen of the eighteen fade, the view
 * pushes in on the one that broke at Contact, and it resolves into the
 * labelled opportunity the engine then takes apart — so the thing going
 * through the machinery is visibly one of the eleven that leaked.
 */
export function Converge() {
  const ref = useScrollVar<HTMLDivElement>()
  const chosen = 7

  const lines = useMemo(
    () =>
      Array.from({ length: LINES }, (_, i) => {
        const half = (LINES - 1) / 2
        const offset = (i - half) / half
        return { y: offset * 34, mine: i === chosen }
      }),
    [],
  )

  return (
    <section
      ref={ref}
      data-tone="ink"
      className="relative h-[102vh] bg-ink lg:h-[124vh]"
      style={{ '--p': 0 } as React.CSSProperties}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* --- the field, collapsing --------------------------------- */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center"
          style={{
            transform: 'scale(calc(1 + var(--p) * 1.6))',
            transformOrigin: '62% 50%',
          }}
        >
          <div className="relative h-full w-full">
            {lines.map((line, i) => (
              <span
                key={i}
                className="absolute right-0 left-0 h-px"
                style={{
                  top: `calc(50% + ${line.y}vh)`,
                  background: line.mine
                    ? 'var(--color-dormant-ink)'
                    : 'rgb(237 234 228 / 0.3)',
                  // everything but the chosen one leaves
                  opacity: line.mine
                    ? 1
                    : `clamp(0, calc(1 - var(--p) * 2.2), 1)`,
                  // the chosen one stops where it broke
                  transform: line.mine ? 'scaleX(0.62)' : 'none',
                  transformOrigin: 'left center',
                }}
              />
            ))}

            {/* the break on the chosen path */}
            <span
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dormant-ink bg-ink"
              style={{ top: `calc(50% + ${lines[chosen].y}vh)`, left: '62%' }}
            />
          </div>
        </div>

        {/* --- what it resolves into --------------------------------- */}
        <div className="shell relative z-10">
          <div
            className="max-w-[34rem]"
            style={{
              opacity: `clamp(0, calc((var(--p) - 0.45) * 3.4), 1)`,
              transform: `translateY(calc((1 - clamp(0, calc((var(--p) - 0.45) * 3.4), 1)) * 14px))`,
            }}
          >
            <p className="font-mono text-mono-xs text-chalk-3 uppercase">
              One of the eleven
            </p>
            <p className="tnum mt-4 font-mono text-[1.375rem] text-chalk">
              (352) 555-0148
            </p>
            <p className="mt-2 text-lede text-chalk-2">
              Missed call at 6:42 PM. Stopped at Contact. This is the one we
              follow through the system.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
