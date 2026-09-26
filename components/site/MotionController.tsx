'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    __caMotion?: boolean
  }
}

/**
 * One observer for every one-time reveal on the page.
 *
 * Elements marked `data-reveal` (a short rise and fade) or `data-draw="scroll"`
 * (a ribbon drawing along its curve) get `.is-in` once they approach the
 * viewport, and are never hidden again. Anything already scrolled past — a
 * deep link, a restored position — is revealed immediately.
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

    const targets = document.querySelectorAll<HTMLElement>(
      '[data-reveal]:not(.is-in), [data-draw="scroll"]:not(.is-in)',
    )
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

  return null
}
