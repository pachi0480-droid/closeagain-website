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

const revealTargets = ['[data-reveal]', '[data-scroll]', '[data-draw="scroll"]', '.pv-status']
  .map((selector) => `${selector}:not(.is-in)`)
  .join(',')

/**
 * One observer for every one-time reveal on the page.
 *
 * Elements marked `data-reveal` or `data-scroll` (a short rise), ribbons with
 * `data-draw="scroll"` (drawn along their curve) and status swaps get `.is-in`
 * once they approach the viewport, and are never hidden again — scrolling
 * back up does not replay anything. Anything already scrolled past is shown
 * at once, so a fast scroll or a restored position never finds a gap.
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

    const targets = document.querySelectorAll<Element>(revealTargets)
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
      // Revealed the moment any part is in view: nothing can be stranded at the
      // bottom edge of a page that cannot scroll any further.
      { rootMargin: '0px', threshold: 0 },
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
