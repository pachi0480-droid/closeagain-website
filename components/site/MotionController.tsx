'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    __caMotion?: boolean
  }
}

const supportsScrollTimelines = () =>
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()') && CSS.supports('animation-timeline: scroll()')

/**
 * One observer for every one-time reveal on the page.
 *
 * Elements marked `data-reveal` (a short rise and fade) or `data-draw="scroll"`
 * (a ribbon drawing along its curve) get `.is-in` once they approach the
 * viewport and are never hidden again. Scroll-linked pieces (`data-scroll`,
 * `data-draw="linked"`) are animated by the browser itself where scroll-driven
 * animation exists; elsewhere they fall back to the same one-time reveal.
 *
 * Content is only ever hidden while `html.js-reveal` is set, which the boot
 * script adds and removes again if this component never runs.
 */
export function MotionController() {
  const pathname = usePathname()

  useEffect(() => {
    window.__caMotion = true
    const root = document.documentElement
    if (!root.classList.contains('js-reveal')) return

    const selectors = ['[data-reveal]:not(.is-in)', '[data-draw="scroll"]:not(.is-in)']
    if (!supportsScrollTimelines()) {
      selectors.push('[data-scroll]:not(.is-in)', '[data-draw="linked"]:not(.is-in)')
    }
    const targets = document.querySelectorAll<Element>(selectors.join(','))
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [pathname])

  // The frosted sticky header, for browsers without scroll-driven animation.
  useEffect(() => {
    if (supportsScrollTimelines()) return
    const root = document.documentElement
    let frame = 0
    let scrolled = false
    const update = () => {
      frame = 0
      const next = window.scrollY > 24
      if (next !== scrolled) {
        scrolled = next
        root.toggleAttribute('data-scrolled', next)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return null
}
