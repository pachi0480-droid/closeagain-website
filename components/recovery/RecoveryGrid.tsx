'use client'

import { useMemo } from 'react'

const COLUMNS = 20
const ROWS = 6
const MARKS = COLUMNS * ROWS

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
}: {
  leakageRate: number
  recoveryRate: number
}) {
  const { leaked, recovered } = useMemo(() => {
    const leakedMarks = Math.round(MARKS * (leakageRate / 100))
    return {
      leaked: leakedMarks,
      recovered: Math.round(leakedMarks * (recoveryRate / 100)),
    }
  }, [leakageRate, recoveryRate])

  return (
    <div
      aria-hidden="true"
      className="grid grid-flow-col grid-rows-6 gap-x-2 gap-y-2.5 sm:gap-x-2.5"
    >
      {Array.from({ length: MARKS }, (_, i) => {
        // i is already column-major because the grid flows by column.
        const isLeaked = i >= MARKS - leaked
        const isRecovered = i >= MARKS - recovered

        return (
          <span
            key={i}
            className="block h-[6px] w-[6px] rounded-full transition-all duration-500 [transition-timing-function:var(--ease-out-quiet)]"
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
              transitionDelay: `${Math.floor(i / ROWS) * 9}ms`,
            }}
          />
        )
      })}
    </div>
  )
}
