'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** Keeps a callback in a ref without touching refs during render. */
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

/** True once the element has entered the viewport. Never flips back. */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  options: { rootMargin?: string; threshold?: number; onEnter?: () => void } = {},
) {
  const { rootMargin = '0px 0px -12% 0px', threshold = 0.15, onEnter } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const enterRef = useLatest(onEnter)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // An element that is already above the viewport when the observer
        // attaches — a deep link, a restored scroll position, a back
        // navigation — must reveal immediately. It will never intersect on
        // its own, and leaving it at opacity 0 hides real content.
        const scrolledPast = entry.boundingClientRect.bottom <= 0
        if (!entry.isIntersecting && !scrolledPast) return
        setInView(true)
        enterRef.current?.()
        observer.disconnect()
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold, enterRef])

  return { ref, inView }
}

/**
 * Scroll progress of an element through the viewport, 0 to 1, sampled on
 * rAF-throttled scroll. Used by the sticky recovery loop.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0

    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)))
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return { ref, progress }
}

/** Reads the OS motion preference and keeps up with changes to it. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    const frame = requestAnimationFrame(() => setReduced(query.matches))
    query.addEventListener('change', onChange)
    return () => {
      cancelAnimationFrame(frame)
      query.removeEventListener('change', onChange)
    }
  }, [])

  return reduced
}

/** Window scroll offset in pixels, rAF-throttled. Used by the header. */
export function useScrollOffset() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setOffset(window.scrollY)
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return offset
}

/**
 * Steps through a sequence on a timer, pausing while the element is offscreen
 * so the hero is not animating in a tab nobody is looking at.
 */
export function useSequence(
  length: number,
  options: {
    stepMs?: number
    holdMs?: number
    enabled?: boolean
    onComplete?: () => void
  } = {},
) {
  const { stepMs = 900, holdMs = 3600, enabled = true, onComplete } = options
  const [rawStep, setRawStep] = useState(0)
  const [active, setActive] = useState(true)
  const ref = useRef<HTMLDivElement | null>(null)
  const completeRef = useLatest(onComplete)

  // With motion disabled the sequence is simply shown in its final state.
  const step = enabled ? rawStep : length

  // Pause when offscreen.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!enabled || !active) return

    if (rawStep >= length) {
      completeRef.current?.()
      const restart = window.setTimeout(() => setRawStep(0), holdMs)
      return () => window.clearTimeout(restart)
    }

    const next = window.setTimeout(() => setRawStep((s) => s + 1), stepMs)
    return () => window.clearTimeout(next)
  }, [rawStep, length, stepMs, holdMs, enabled, active, completeRef])

  const restart = useCallback(() => setRawStep(0), [])

  return { ref, step, restart }
}

/**
 * Which kind of surface is currently passing under the header.
 *
 * Sections tagged `data-tone="ink"` are observed against a thin strip at the
 * top of the viewport the height of the header, so the chrome can invert
 * rather than sitting as a pale bar over a dark section.
 */
export function useSurfaceTone(headerHeight = 76) {
  const [tone, setTone] = useState<'light' | 'ink'>('light')

  useEffect(() => {
    const sections = document.querySelectorAll('[data-tone="ink"]')
    if (sections.length === 0) return

    const intersecting = new Set<Element>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target)
          else intersecting.delete(entry.target)
        }
        setTone(intersecting.size > 0 ? 'ink' : 'light')
      },
      {
        // Collapse the root to a band the height of the header.
        rootMargin: `0px 0px -${Math.max(0, window.innerHeight - headerHeight)}px 0px`,
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [headerHeight])

  return tone
}
