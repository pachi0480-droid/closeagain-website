'use client'

import { useEffect, useRef } from 'react'

/**
 * Eases the industry ticker to a stop under the pointer or keyboard focus,
 * and back up to speed afterwards, instead of freezing mid-motion. It also
 * rests the loop while the ticker is off screen. Without script (or with
 * reduced motion, where there is no loop) the CSS in home.css applies.
 */
export function TickerEase() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ticker = ref.current?.closest<HTMLElement>('.ticker')
    const track = ticker?.querySelector<HTMLElement>('.ticker__track')
    const loop = track?.getAnimations().find((animation) => (animation as CSSAnimation).animationName === 'ticker-run')
    if (!ticker || !loop) return

    ticker.dataset.eased = ''
    let rate = 1
    let target = 1
    let frame = 0
    let last = 0

    // Exponential approach: about a third of a second to stop or resume.
    const step = (now: number) => {
      const dt = last ? now - last : 16
      last = now
      rate = target + (rate - target) * Math.exp(-dt / 110)
      if (Math.abs(target - rate) < 0.004) rate = target
      loop.playbackRate = rate
      frame = rate === target ? 0 : requestAnimationFrame(step)
    }
    const easeTo = (value: number) => {
      target = value
      if (!frame) {
        last = 0
        frame = requestAnimationFrame(step)
      }
    }

    // Keyboard focus: glide the focused name to the start of the clear area,
    // so it is never half-faded at an edge while it is the one in focus.
    let glide = 0
    const bringIntoView = (link: HTMLElement) => {
      const viewport = ticker.querySelector<HTMLElement>('.ticker__viewport')
      const duration = Number(loop.effect?.getComputedTiming().duration)
      const from = Number(loop.currentTime)
      if (!viewport || !track || !duration || Number.isNaN(from)) return
      const box = viewport.getBoundingClientRect()
      const delta = link.getBoundingClientRect().left - (box.left + box.width * 0.12)
      let to = from + (delta / (track.scrollWidth / 2)) * duration
      if (to < 0) to += duration
      const start = performance.now()
      cancelAnimationFrame(glide)
      const run = (now: number) => {
        const t = Math.min(1, (now - start) / 480)
        loop.currentTime = from + (to - from) * (1 - (1 - t) ** 3)
        if (t < 1) glide = requestAnimationFrame(run)
      }
      glide = requestAnimationFrame(run)
    }

    const hold = () => easeTo(0)
    const focused = (event: FocusEvent) => {
      hold()
      if (event.target instanceof HTMLElement && event.target.matches('.ticker__link')) bringIntoView(event.target)
    }
    const release = () => {
      // Stay still while either the pointer or focus is still inside.
      if (!ticker.matches(':hover') && !ticker.contains(document.activeElement)) easeTo(1)
    }
    const released = () => window.setTimeout(release, 0)

    ticker.addEventListener('pointerenter', hold)
    ticker.addEventListener('pointerleave', release)
    ticker.addEventListener('focusin', focused)
    ticker.addEventListener('focusout', released)

    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loop.play()
      else loop.pause()
    })
    seen.observe(ticker)

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(glide)
      seen.disconnect()
      ticker.removeEventListener('pointerenter', hold)
      ticker.removeEventListener('pointerleave', release)
      ticker.removeEventListener('focusin', focused)
      ticker.removeEventListener('focusout', released)
      loop.playbackRate = 1
      delete ticker.dataset.eased
    }
  }, [])

  return <span ref={ref} hidden />
}
