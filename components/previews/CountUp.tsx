'use client'

import { useEffect, useRef } from 'react'

const format = (n: number, suffix: string) => `${n.toLocaleString('en-US')}${suffix}`

/**
 * A number that counts up once, the first time it scrolls into view.
 *
 * The server renders the final value, so it is correct without JavaScript
 * and for reduced-motion visitors. A number already on screen when the page
 * loads is left alone rather than reset.
 */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.textContent = format(0, suffix)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 900)
          const eased = 1 - Math.pow(1 - t, 3)
          el.textContent = format(Math.round(value * eased), suffix)
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      el.textContent = format(value, suffix)
    }
  }, [value, suffix])

  return <span ref={ref}>{format(value, suffix)}</span>
}
