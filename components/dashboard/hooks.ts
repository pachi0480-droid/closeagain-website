'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type RangeDays = 7 | 30 | 90

export const rangeOptions: ReadonlyArray<{ value: `${RangeDays}`; label: string }> = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
]

/**
 * A date range whose panels “load” briefly after a change, so the new window
 * reads as fresh data. Under 400ms, and nothing is fetched.
 */
export function useRange(initial: RangeDays = 30) {
  const [range, setRange] = useState<RangeDays>(initial)
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const change = useCallback(
    (next: RangeDays) => {
      if (next === range) return
      setRange(next)
      setLoading(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setLoading(false), 360)
    },
    [range],
  )

  return { range, loading, change }
}

export const rangeLabel = (range: RangeDays) => `last ${range} days`
export const priorLabel = (range: RangeDays) => `vs prior ${range}d`

/** Filters that reset the page to the first page whenever they change. */
export function usePaged<T>(items: readonly T[], pageSize: number) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(page, pages - 1)
  return {
    page: current,
    setPage,
    rows: items.slice(current * pageSize, (current + 1) * pageSize),
  }
}
