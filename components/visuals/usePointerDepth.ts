'use client'

import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Writes pointer position as --px / --py in [-1, 1] on the host element, so
 * children can take a few pixels of parallax via `depth-layer`.
 *
 * Deliberately restrained: nothing chases the cursor, there is no spotlight
 * and no custom cursor. It exists so the foreground feels attached to a scene
 * rather than pasted on top of one. Skipped entirely on touch and under
 * reduced motion.
 */
export function usePointerDepth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0

    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = el.getBoundingClientRect()
        const px = ((e.clientX - r.left) / r.width - 0.5) * 2
        const py = ((e.clientY - r.top) / r.height - 0.5) * 2
        el.style.setProperty('--px', px.toFixed(3))
        el.style.setProperty('--py', py.toFixed(3))
      })
    }

    const onLeave = () => {
      el.style.setProperty('--px', '0')
      el.style.setProperty('--py', '0')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return ref
}
