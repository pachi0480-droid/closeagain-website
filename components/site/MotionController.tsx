'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window { __caMotion?: boolean }
}

const revealTargets = '[data-reveal], [data-scroll], [data-draw="scroll"], .pv-status, [data-chat]'

/** Drawings and conversations wait until they are well in view, so the whole stroke (or exchange) is seen. */
const drawTargets = '[data-draw="scroll"], [data-chat]'

/** Lands (or lifts) a timeline-drawn ribbon's arrowhead; see motion.css. */
const land = (heads: Element[], landed: boolean) => heads.forEach((head) => head.toggleAttribute('data-landed', landed))

/** Pages with a timed ribbon story (the homepage) load the timeline library; others never do. */
const storySelector = '[data-flow], [data-flow-steps]'

/**
 * Motion that always finishes. Content reveals once as it arrives; ribbons
 * draw once they are well in view; the homepage stories play through, start
 * to end, once their section is on screen. Nothing is tied to the scroll
 * position, so no one ever stops scrolling on a half-drawn ribbon.
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
    // Drawings start once their top is about a third of the way up the screen.
    const drawings = watch(Math.round(window.innerHeight * 0.3))
    targets.forEach((target) => {
      const drawing = target.matches(drawTargets)
      const margin = drawing ? window.innerHeight * 0.3 : 24
      // A selected anchor or restored scroll position never leaves content hidden.
      if (target.getBoundingClientRect().top < window.innerHeight - margin) reveal(target)
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

    // Loaded only on pages with a timed ribbon story (the homepage).
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

        // New + Old. The step cards rise as two ribbons run down behind them;
        // then the ribbons curve in, merge and carry on down, the arrowhead
        // lands and the outcome rises in. The ribbon pieces are one measured
        // stroke (each piece's share of it is its length on screen), so the
        // drawing keeps one speed from piece to piece.
        const flows = Array.from(document.querySelectorAll<HTMLElement>('[data-flow]'))
        flows.forEach((flow) => {
          flow.classList.add('flow-ready')
          flow.querySelectorAll(revealTargets).forEach((element) => element.classList.add('is-in'))
          const cards = Array.from(flow.querySelectorAll<HTMLElement>('.path-step'))
          const bands = Array.from(flow.querySelectorAll<HTMLElement>('.paths__band'))
          const branches = Array.from(flow.querySelectorAll<SVGPathElement>('.ribbon__guide--a'))
          const trunks = Array.from(flow.querySelectorAll<SVGPathElement>('.ribbon__guide--b'))
          const heads = Array.from(flow.querySelectorAll<SVGElement>('.ribbon__head'))
          const outcome = flow.querySelector<HTMLElement>('.paths__outcome')

          // Measure the pieces as drawn on this screen.
          const art = Array.from(flow.querySelectorAll<SVGSVGElement>('.paths__merge-art')).find(
            (svg) => svg.getBoundingClientRect().width > 0,
          )
          const length = (path: SVGPathElement | null | undefined) => {
            if (!art || !path) return 0
            const box = art.getBoundingClientRect()
            const view = art.viewBox.baseVal
            const scale = Math.min(box.width / view.width, box.height / view.height)
            try {
              return path.getTotalLength() * scale
            } catch {
              return 0
            }
          }
          const bandLength = bands[0]?.offsetHeight ?? 0
          const branchLength = length(art?.querySelector<SVGPathElement>('.ribbon__guide--a'))
          const trunkLength = length(art?.querySelector<SVGPathElement>('.ribbon__guide--b'))
          const total = bandLength + branchLength + trunkLength
          const f1 = total > 0 && bandLength > 0 ? bandLength / total : 0.5
          const f2 = total > 0 && branchLength > 0 ? (bandLength + branchLength) / total : 0.85
          const clamp01 = gsap.utils.clamp(0, 1)

          const stroke = { p: 0 }
          const render = () => {
            const p = stroke.p
            const band = `scaleY(${clamp01(p / f1)})`
            bands.forEach((element) => { element.style.transform = band })
            const branch = String(1 - clamp01((p - f1) / (f2 - f1)))
            branches.forEach((element) => { element.style.strokeDashoffset = branch })
            // The trunk starts a moment before the branches finish, so the
            // joint where they meet is never an open notch.
            const trunkStart = f2 - 0.025
            const trunk = String(1 - clamp01((p - trunkStart) / (1 - trunkStart)))
            trunks.forEach((element) => { element.style.strokeDashoffset = trunk })
            land(heads, p > 0.985)
          }
          render()
          gsap.set(cards, { opacity: 0, y: 18 })
          if (outcome) gsap.set(outcome, { opacity: 0, y: 28 })

          // Two beats, each played to the end once it is on screen: the
          // cards and the two runs; then the merge, the arrowhead landing and
          // the outcome. If the merge is already in view, they flow straight
          // on as one stroke.
          const run = gsap.utils.clamp(0.9, 1.6, bandLength / 480)
          const join = gsap.utils.clamp(1.0, 1.8, (branchLength + trunkLength) / 520)
          let mergeInView = false
          const timeline = gsap.timeline({ paused: true })
          timeline.to(stroke, { p: f1, duration: run, ease: 'power2.inOut', onUpdate: render }, 0)
          flow.querySelectorAll('.paths__col').forEach((column, c) => {
            const steps = Array.from(column.querySelectorAll('.path-step'))
            steps.forEach((card, i) => {
              // Every card has settled before the run ends (and the merge may wait).
              const at = 0.05 + c * 0.1 + (i / steps.length) * Math.max(0, run - 0.9)
              timeline.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, at)
            })
          })
          timeline.call(() => { if (!mergeInView) timeline.pause() }, undefined, run + 0.02)
          timeline.to(stroke, { p: 1, duration: join, ease: 'power2.inOut', onUpdate: render }, run + 0.05)
          // The outcome follows the arrowhead as it lands.
          if (outcome) timeline.to(outcome, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, run + 0.05 + join * 0.94)

          const finishAll = () => {
            mergeInView = true
            if (timeline.progress() < 1) timeline.progress(1)
          }
          const merge = flow.querySelector('.paths__merge') ?? flow
          cue(flow, 0.82, () => timeline.play(), finishAll)
          cue(
            merge,
            0.75,
            () => {
              mergeInView = true
              if (timeline.paused() && timeline.progress() > 0) timeline.play()
            },
            finishAll,
          )
          resets.push(() => {
            timeline.kill()
            gsap.set([...cards, ...(outcome ? [outcome] : [])], { clearProps: 'opacity,transform' })
            bands.forEach((element) => { element.style.transform = '' })
            ;[...branches, ...trunks].forEach((element) => { element.style.strokeDashoffset = '' })
            land(heads, false)
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
          const rail = story.querySelector<HTMLElement>('.ribbon-band')
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
