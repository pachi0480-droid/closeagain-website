'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window { __caMotion?: boolean }
}

const revealTargets = '[data-reveal], [data-scroll], .pv-status, [data-chat], [data-lift], [data-moment]'

/** Conversations and product views wait until they are well in view, so the whole exchange (or rise) is seen. */
const drawTargets = '[data-chat], [data-lift], [data-moment]'

/** Pages with a timed story (the homepage) load the timeline library; others never do. */
const storySelector = '[data-flow], [data-flow-steps]'

/**
 * Motion that always finishes. Content reveals once as it arrives;
 * conversations and product views play once they are well in view; the
 * homepage stories play through, start to end, once their section is on
 * screen. Nothing is tied to the scroll position, so nothing is ever left
 * half-played.
 */
export function MotionController() {
  const pathname = usePathname()

  useEffect(() => {
    window.__caMotion = true
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const targets = Array.from(document.querySelectorAll<Element>(revealTargets))
    const reveal = (target: Element) => target.classList.add('is-in')
    if (media.matches || !('IntersectionObserver' in window)) {
      targets.forEach(reveal)
      return
    }
    const watch = (margin: number) => {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            reveal(entry.target)
            observer.unobserve(entry.target)
          }
        }
      }, { rootMargin: `0px 0px -${margin}px 0px`, threshold: 0 })
      return observer
    }
    const content = watch(24)
    // Conversations and views start once their top is about a third of the way up the screen.
    const drawings = watch(Math.round(window.innerHeight * 0.3))
    // How far the page can still scroll: something near the end of a short
    // page may never rise as high as the drawing line.
    const scrollLeft = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
    targets.forEach((target) => {
      const top = target.getBoundingClientRect().top
      const drawing = target.matches(drawTargets) && top - scrollLeft < window.innerHeight * 0.7
      const margin = drawing ? window.innerHeight * 0.3 : 24
      // A selected anchor or restored scroll position never leaves content hidden.
      if (top < window.innerHeight - margin) reveal(target)
      else (drawing ? drawings : content).observe(target)
    })

    const onFocus = (event: FocusEvent) => {
      const target = event.target as Element | null
      target?.closest('[data-reveal]')?.classList.add('is-in')
    }
    document.addEventListener('focusin', onFocus)
    return () => {
      content.disconnect()
      drawings.disconnect()
      document.removeEventListener('focusin', onFocus)
    }
  }, [pathname])

  useEffect(() => {
    if (!document.querySelector(storySelector)) return
    let disposed = false
    let cleanup: (() => void) | undefined

    // Loaded only on pages with a timed story (the homepage).
    import('gsap').then(({ gsap }) => {
      if (disposed) return
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const resets: Array<() => void> = []

        /**
         * Plays each story once its section is on screen. Checked on every
         * scroll (and at setup, and after the browser restores a scroll
         * position), so a story already on screen plays at once, and one the
         * visitor has passed — a reload lower down, a jump to the end — is
         * shown finished: scrolling back up never finds an empty section.
         */
        type Cue = { element: Element; start: number; play: () => void; finish: () => void; done: boolean }
        const cues: Cue[] = []
        const cue = (element: Element, start: number, play: () => void, finish: () => void) =>
          cues.push({ element, start, play, finish, done: false })
        let frame = 0
        const stopWatching = () => {
          window.removeEventListener('scroll', schedule)
          window.removeEventListener('resize', schedule)
        }
        const check = () => {
          frame = 0
          for (const item of cues) {
            if (item.done) continue
            const box = item.element.getBoundingClientRect()
            if (box.bottom < 0) {
              item.done = true
              item.finish()
            } else if (box.top < window.innerHeight * item.start) {
              item.done = true
              item.play()
            }
          }
          if (cues.every((item) => item.done)) stopWatching()
        }
        function schedule() {
          if (!frame) frame = requestAnimationFrame(check)
        }

        // New + Old. Each column's three steps arrive in turn; then both
        // replies fly into one inbox from their own columns, the count pops,
        // and the outcome rises in. If the inbox is not on screen yet when the
        // columns finish, the story waits for it.
        const flows = Array.from(document.querySelectorAll<HTMLElement>('[data-flow]'))
        flows.forEach((flow) => {
          flow.classList.add('flow-ready')
          flow.querySelectorAll(revealTargets).forEach((element) => element.classList.add('is-in'))
          const columns = Array.from(flow.querySelectorAll<HTMLElement>('.paths__col'))
          const cards = Array.from(flow.querySelectorAll<HTMLElement>('.path-step'))
          const replies = Array.from(flow.querySelectorAll<HTMLElement>('.path-step--reply'))
          const inbox = flow.querySelector<HTMLElement>('.paths__inbox')
          const rows = Array.from(flow.querySelectorAll<HTMLElement>('.paths__inbox-row'))
          const count = flow.querySelector<HTMLElement>('.paths__inbox-count')
          const outcome = flow.querySelector<HTMLElement>('.paths__outcome')

          // Where each row starts: part of the way back toward its column's reply.
          const from = rows.map((row, i) => {
            const card = replies[i]
            if (!card) return { x: 0, y: 0 }
            const a = card.getBoundingClientRect()
            const b = row.getBoundingClientRect()
            return { x: (a.left + a.width / 2 - (b.left + b.width / 2)) * 0.7, y: (a.top - b.top) * 0.3 }
          })

          gsap.set(cards, { opacity: 0, y: 18 })
          if (inbox) gsap.set(inbox, { opacity: 0, y: 34, scale: 0.97 })
          rows.forEach((row, i) => gsap.set(row, { opacity: 0, x: from[i].x, y: from[i].y, scale: 0.9 }))
          if (count) gsap.set(count, { opacity: 0, scale: 0.6 })
          if (outcome) gsap.set(outcome, { opacity: 0, y: 28 })

          let inboxInView = false
          const timeline = gsap.timeline({ paused: true })
          columns.forEach((column, c) => {
            column.querySelectorAll('.path-step').forEach((card, i) => {
              timeline.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.05 + c * 0.12 + i * 0.3)
            })
          })
          const settled = 1.25
          timeline.call(() => { if (!inboxInView) timeline.pause() }, undefined, settled)
          if (inbox) timeline.to(inbox, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }, settled + 0.05)
          replies.forEach((card, i) => {
            timeline.to(card, { scale: 1.035, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }, settled + 0.2 + i * 0.16)
          })
          rows.forEach((row, i) => {
            timeline.to(row, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1, ease: 'expo.out' }, settled + 0.3 + i * 0.16)
          })
          if (count) timeline.to(count, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2.2)' }, settled + 0.85)
          if (outcome) timeline.to(outcome, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, settled + 0.95)

          const finishAll = () => {
            inboxInView = true
            if (timeline.progress() < 1) timeline.progress(1)
          }
          cue(flow, 0.82, () => timeline.play(), finishAll)
          cue(
            inbox ?? flow,
            0.85,
            () => {
              inboxInView = true
              if (timeline.paused() && timeline.progress() > 0) timeline.play()
            },
            finishAll,
          )
          resets.push(() => {
            timeline.kill()
            gsap.set([...cards, ...rows, ...(inbox ? [inbox] : []), ...(count ? [count] : []), ...(outcome ? [outcome] : [])], {
              clearProps: 'opacity,transform',
            })
            flow.classList.remove('flow-ready')
          })
        })

        // From lead to customer: when the card is on screen, the morning plays
        // out — each event completes in turn, the rail runs on to it, and the
        // status keeps up.
        const stories = Array.from(document.querySelectorAll<HTMLElement>('[data-flow-steps]'))
        stories.forEach((story) => {
          const statuses = (story.dataset.flowSteps ?? '').split('|')
          const events = Array.from(story.querySelectorAll<HTMLElement>('[data-flow-step]'))
          const rail = story.querySelector<HTMLElement>('.flow__rail')
          const status = story.querySelector<HTMLElement>('[data-flow-status]')
          const tones = events.map((event) => (event.className.match(/flow__event--(\w+)/)?.[1] ?? 'ink'))
          let shown = -1
          const show = (count: number) => {
            if (count === shown) return
            shown = count
            events.forEach((event, i) => event.toggleAttribute('data-pending', i >= count))
            if (!status) return
            const index = Math.max(0, count - 1)
            if (status.textContent !== statuses[index]) {
              status.textContent = statuses[index] ?? ''
              status.animate?.(
                [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
                { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
              )
            }
            status.dataset.tone = tones[index]
          }
          show(0)
          if (rail) {
            rail.dataset.progress = ''
            gsap.set(rail, { scaleY: 0, transformOrigin: '50% 0' })
          }

          const step = 0.62
          const timeline = gsap.timeline({ paused: true })
          events.forEach((_, i) => {
            const at = 0.15 + i * step
            if (rail && i > 0) {
              timeline.to(rail, { scaleY: i / (events.length - 1), duration: step * 0.85, ease: 'power2.inOut' }, at - step * 0.85)
            }
            timeline.call(() => show(i + 1), undefined, at)
          })

          cue(story, 0.72, () => timeline.play(), () => { timeline.progress(1) })
          resets.push(() => {
            timeline.kill()
            events.forEach((event) => event.removeAttribute('data-pending'))
            if (rail) {
              gsap.set(rail, { clearProps: 'transform,transformOrigin' })
              delete rail.dataset.progress
            }
          })
        })

        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        check()
        // Catch a scroll position the browser restores after load.
        const late = window.setTimeout(schedule, 400)
        return () => {
          window.clearTimeout(late)
          cancelAnimationFrame(frame)
          stopWatching()
          resets.forEach((reset) => reset())
        }
      })
      cleanup = () => media.revert()
    }).catch(() => {
      // The one-time CSS reveals remain a complete fallback if the enhancement cannot load.
    })
    return () => { disposed = true; cleanup?.() }
  }, [pathname])

  useEffect(() => {
    const root = document.documentElement
    let frame = 0
    const update = () => {
      frame = 0
      root.toggleAttribute('data-scrolled', window.scrollY > 24)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return null
}
