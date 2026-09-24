'use client'

import { useMemo } from 'react'

/** Default field. The calculator page runs a much wider one. */
const DEFAULT_COLUMNS = 20
const DEFAULT_ROWS = 6

/**
 * A proportional view of one month of opportunities: what books anyway, what
 * leaks, and what recovery brings back.
 *
 * Marks are ranked column-major, so the leaking share reads as a band down the
 * right-hand side and the recovered share returns from the far edge inward.
 * The numbers beside it are the source of truth — this only makes them felt.
 */
export function RecoveryGrid({
  leakageRate,
  recoveryRate,
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
}: {
  leakageRate: number
  recoveryRate: number
  columns?: number
  rows?: number
}) {
  const MARKS = columns * rows
  const { leaked, recovered } = useMemo(() => {
    const leakedMarks = Math.round(MARKS * (leakageRate / 100))
    return {
      leaked: leakedMarks,
      recovered: Math.round(leakedMarks * (recoveryRate / 100)),
    }
  }, [leakageRate, recoveryRate, MARKS])

  return (
    <div
      aria-hidden="true"
      className="grid w-full grid-flow-col gap-x-1 gap-y-1.5 sm:gap-x-1.5 sm:gap-y-2"
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridAutoColumns: 'minmax(0, 1fr)',
      }}
    >
      {Array.from({ length: MARKS }, (_, i) => {
        // i is already column-major because the grid flows by column.
        const isLeaked = i >= MARKS - leaked
        const isRecovered = i >= MARKS - recovered

        return (
          <span
            key={i}
            className="block aspect-square w-full max-w-[6px] rounded-full transition-all duration-500 [transition-timing-function:var(--ease-out-quiet)]"
            style={{
              // Solid pale = books anyway. Hollow = leaked, still gone.
              // Solid green = recovered.
              backgroundColor: isRecovered
                ? 'var(--color-recover-bright)'
                : isLeaked
                  ? 'transparent'
                  : 'color-mix(in oklab, var(--color-chalk) 40%, transparent)',
              boxShadow:
                isLeaked && !isRecovered
                  ? 'inset 0 0 0 1px var(--color-dormant-ink)'
                  : 'none',
              transitionDelay: `${Math.floor(i / rows) * 7}ms`,
            }}
          />
        )
      })}
    </div>
  )
}
