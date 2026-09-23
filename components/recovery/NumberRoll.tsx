'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Tweens to a new value instead of snapping. Used only on the calculator's
 * headline figure, where the change is the point.
 */
export function useTweenedNumber(target: number, duration = 420) {
  const reduced = usePrefersReducedMotion()
  const [tweened, setTweened] = useState(target)
  const latest = useRef(target)

  useEffect(() => {
    if (reduced) return

    const from = latest.current
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const value = from + (target - from) * easeOut(t)
      latest.current = value
      setTweened(value)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  return reduced ? target : tweened
}
