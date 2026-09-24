'use client'

import { useMemo } from 'react'
import { flows } from '@/data/leak-map'
import { useScrollVar } from '@/lib/hooks'

/**
 * Eighteen, to match the Leak Map exactly: this bridge builds the field that
 * section then takes apart. A denser fan reads as hatching rather than as
 * individual opportunities — legibility sets the count, and the count sets the
 * copy.
 */
const LINES = flows.length

/**
 * Hero → Leak Map.
 *
 * The one opportunity we just watched recovered becomes six, then twelve, then
 * the eighteen of a month. Eleven of them stop short of the edge, which is the
 * question the Leak Map answers next.
 *
 * The surface itself carries you from the warm world into the ink one, so the
 * two sections are joined by a transformation rather than a change of
 * background colour. All geometry is CSS driven from a single `--p`, so the
 * whole scene costs one style write per frame and no React render.
 */
export function Multiply() {
  const ref = useScrollVar<HTMLDivElement>()

  // Constant per line — computed once, never per frame.
  const lines = useMemo(
    () =>
      flows.map((flow, i) => {
        const half = (LINES - 1) / 2
        const offset = (i - half) / half // -1 … 1
        return {
          y: offset * 25,
          // first six arrive early, the rest fill in behind them
          enter: i < 6 ? 0.04 + i * 0.03 : i < 12 ? 0.3 + (i - 6) * 0.025 : 0.56 + (i - 12) * 0.022,
          // the eleven that leak stop short, at the gate that stopped them
          reach: flow.stopsAt === null ? 1 : 0.34 + flow.stopsAt * 0.16,
        }
      }),
    [],
  )

  return (
    <section
      ref={ref}
      aria-hidden="true"
      /* Shorter on a phone: a transition worth two viewports of mouse wheel is
         worth about one of thumb. */
      className="relative h-[115vh] lg:h-[200vh]"
      style={{ '--p': 0 } as React.CSSProperties}
    >
      {/* The surface darkens across this section, so the header has to invert
          partway through it rather than at its edge. This sentinel is what the
          header's tone observer sees: it begins where the background is dark
          enough that light chrome would be unreadable. */}
      <div
        data-tone="ink"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%]"
      />
      <div
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
        style={{
          background:
            'color-mix(in oklab, var(--color-ink) calc(var(--p) * 100%), var(--color-paper))',
        }}
      >
        {/* --- the count ------------------------------------------- */}
        <div className="shell relative z-10">
          <div className="relative h-16">
            {/* Windows deliberately run past both ends of the scroll. A window
                that starts at 0 or stops at 1 leaves the first and last label
                mid-fade at exactly the moment it should be legible. */}
            {[
              { label: 'One opportunity', from: -0.15, to: 0.3 },
              { label: 'Six', from: 0.22, to: 0.56 },
              { label: 'Twelve', from: 0.48, to: 0.79 },
              { label: 'Eighteen this month', from: 0.72, to: 1.3 },
            ].map((step) => (
              <p
                key={step.label}
                className="absolute inset-x-0 top-0 text-h2"
                style={{
                  color:
                    'color-mix(in oklab, var(--color-chalk) calc(var(--p) * 100%), var(--color-graphite))',
                  opacity: `clamp(0, min(calc((var(--p) - ${step.from}) * 14), calc((${step.to} - var(--p)) * 14)), 1)`,
                }}
              >
                {step.label}
              </p>
            ))}
          </div>
        </div>

        {/* --- the fan --------------------------------------------- */}
        <div className="relative mt-10 h-[52vh]">
          {lines.map((line, i) => (
            <span
              key={i}
              className="absolute top-1/2 right-0 left-0 h-px origin-left"
              style={{
                background:
                  'color-mix(in oklab, var(--color-chalk) calc(var(--p) * 100%), var(--color-graphite))',
                transform: `translateY(calc(var(--p) * ${line.y}vh)) scaleX(${line.reach})`,
                opacity: `clamp(0, calc((var(--p) - ${line.enter}) * 14), ${line.reach < 1 ? 0.4 : 0.66})`,
              }}
            />
          ))}

          {/* the ones that do not arrive stop short of the edge */}
          <span
            className="absolute inset-y-0 right-0 w-px"
            style={{
              background: 'var(--color-recover-bright)',
              opacity: `clamp(0, calc((var(--p) - 0.72) * 6), 0.5)`,
            }}
          />
        </div>
      </div>
    </section>
  )
}
