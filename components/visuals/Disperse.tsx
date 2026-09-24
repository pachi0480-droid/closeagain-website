'use client'

import { useMemo } from 'react'
import { defaultInputs } from '@/lib/calculator'
import { useScrollVar } from '@/lib/hooks'

const COLS = 24
const ROWS = 7
const MARKS = COLS * ROWS

/**
 * Product stage → calculator.
 *
 * The feed you have been reading — a handful of opportunity rows — multiplies
 * and disperses into the marker field the calculator runs on. The rows become
 * the model: same objects, a month of them instead of six, sized down to
 * something you can count.
 *
 * The leak band arrives already shaped by the calculator's own defaults, so
 * what the field settles into is exactly what the next section opens with.
 */
export function Disperse() {
  const ref = useScrollVar<HTMLDivElement>()

  const marks = useMemo(() => {
    const leaked = Math.round(MARKS * (defaultInputs.leakageRate / 100))
    const recovered = Math.round(leaked * (defaultInputs.recoveryRate / 100))

    return Array.from({ length: MARKS }, (_, i) => {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      // where it ends: its own cell in the field
      const endX = (col / COLS) * 100
      const endY = (row / (ROWS - 1)) * 100
      // where it starts: one of six stacked rows on the left, feed-shaped
      const startX = 2
      const startY = ((row % ROWS) / (ROWS - 1)) * 100
      // the first column arrives as the rows you were just reading
      const isSeed = col === 0
      return {
        endX,
        endY,
        dx: endX - startX,
        dy: endY - startY,
        isSeed,
        enter: isSeed ? 0 : 0.16 + (col / COLS) * 0.5,
        leaked: i >= MARKS - leaked,
        recovered: i >= MARKS - recovered,
      }
    })
  }, [])

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="relative h-[102vh] lg:h-[120vh]"
      style={{ '--p': 0 } as React.CSSProperties}
    >
      {/* the header inverts once the surface is dark enough to need it */}
      <div
        data-tone="ink"
        className="pointer-events-none absolute inset-x-0 top-[44%] bottom-0"
      />

      <div
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        style={{
          background:
            'color-mix(in oklab, var(--color-ink) calc(var(--p) * 100%), var(--color-limestone))',
        }}
      >
        <div className="shell w-full">
          <p
            className="font-mono text-mono-xs uppercase"
            style={{
              // Mixed toward the full-strength inks at each end: mixing two
              // mid-tones leaves the label grey-on-grey halfway through.
              color:
                'color-mix(in oklab, var(--color-chalk) calc(var(--p) * 100%), var(--color-graphite))',
            }}
          >
            One month, at your numbers
          </p>

          <div className="relative mt-10 h-[15rem]">
            {marks.map((mark, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  // percentage arithmetic inside calc resolves against the
                  // container, unlike a percentage translate
                  left: `calc(${mark.endX}% - (1 - var(--p)) * ${mark.dx}%)`,
                  top: `calc(${mark.endY}% - (1 - var(--p)) * ${mark.dy}%)`,
                  // A feed row at the start, a marker at the end. The width
                  // falls off quadratically while the position spreads
                  // linearly, so the rows resolve into countable marks early
                  // instead of staying a smear of overlapping bars.
                  width: `calc(0.55% + (1 - var(--p)) * (1 - var(--p)) * 7%)`,
                  height: `calc(6px + (1 - var(--p)) * (1 - var(--p)) * 5px)`,
                  backgroundColor: mark.recovered
                    ? 'var(--color-recover-bright)'
                    : mark.leaked
                      ? 'transparent'
                      : 'color-mix(in oklab, var(--color-chalk) calc(20% + var(--p) * 22%), var(--color-graphite-3))',
                  boxShadow: mark.leaked && !mark.recovered
                    ? 'inset 0 0 0 1px var(--color-dormant-ink)'
                    : 'none',
                  opacity: `clamp(0, calc((var(--p) - ${mark.enter}) * 9), 1)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
