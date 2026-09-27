'use client'

import { useEffect } from 'react'

export const introStorageKey = 'ca:intro'

/**
 * Records that the homepage entrance has played, once it has finished, so
 * returning to the homepage in the same session (back button, client
 * navigation, reload) shows the settled composition instead of replaying it.
 */
export function IntroMark() {
  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.intro === 'seen') return
    const timer = window.setTimeout(() => {
      root.dataset.intro = 'seen'
      try {
        sessionStorage.setItem(introStorageKey, '1')
      } catch {
        // Storage can be unavailable (private modes). The entrance may then
        // replay on a later full load, which is harmless.
      }
    }, 2400)
    return () => window.clearTimeout(timer)
  }, [])

  return null
}
