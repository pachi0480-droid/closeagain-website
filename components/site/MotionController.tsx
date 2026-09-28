'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window { __caMotion?: boolean }
}

const revealTargets = '[data-reveal], [data-scroll], [data-draw="scroll"], [data-draw="scrub"], .pv-status'

/** Lands (or lifts) a scroll-drawn ribbon's arrowhead; see motion.css. */
const land = (heads: Element[], landed: boolean) => heads.forEach((head) => head.toggleAttribute('data-landed', landed))

/** Pages with a scroll-driven ribbon story load the timeline library; others never do. */
const storySelector = '[data-flow], [data-flow-steps], [data-draw="scrub"], .trail'

/** Native scrolling, readable content, and scoped timelines with full route cleanup. */
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
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          reveal(entry.target)
          observer.unobserve(entry.target)
        }
      }
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0 })
    targets.forEach((target) => {
      // A selected anchor or restored scroll position never leaves content hidden.
      if (target.getBoundingClientRect().top < window.innerHeight - 24) reveal(target)
      else observer.observe(target)
    })

    const onFocus = (event: FocusEvent) => {
      const target = event.target as Element | null
      target?.closest('[data-reveal]')?.classList.add('is-in')
    }
    document.addEventListener('focusin', onFocus)
    return () => {
      observer.disconnect()
      document.removeEventListener('focusin', onFocus)
    }
  }, [pathname])

  useEffect(() => {
    if (!document.querySelector(storySelector)) return
    let disposed = false
    let cleanup: (() => void) | undefined

    // Loaded only on pages with a connected ribbon story.
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger)
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const flows = Array.from(document.querySelectorAll<HTMLElement>('[data-flow]'))
        flows.forEach((flow) => {
          flow.classList.add('flow-ready')
          flow.querySelectorAll(revealTargets).forEach((element) => element.classList.add('is-in'))
          const bands = flow.querySelectorAll('.paths__band')
          const branches = flow.querySelectorAll('.ribbon__guide--a')
          const trunk = flow.querySelectorAll('.ribbon__guide--b')
          const columns = Array.from(flow.querySelectorAll('.paths__col'))
          const heads = Array.from(flow.querySelectorAll<SVGElement>('.ribbon__head'))
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: flow, start: 'top 78%', end: 'bottom 65%', scrub: 0.4, invalidateOnRefresh: true },
            // The merged ribbon's arrowhead lands as the trunk finishes.
            onUpdate: () => land(heads, timeline.progress() > 0.97),
          })
          timeline.fromTo(bands, { scaleY: 0 }, { scaleY: 1, duration: 1.65 }, 0)
          columns.forEach((column) => {
            column.querySelectorAll('.path-step').forEach((card, i) => {
              timeline.fromTo(card, { y: 12 }, { y: 0, duration: 0.45 }, i * 0.5)
            })
          })
          timeline.fromTo(branches, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.85 }, 1.65)
          timeline.fromTo(trunk, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35 }, 2.43)
        })

        // Long supporting-page rails now track reading progress, not a fixed 850ms timer.
        const rails = Array.from(document.querySelectorAll<HTMLElement>('.trail__band'))
        rails.forEach((rail) => {
          rail.classList.add('is-in')
          rail.dataset.progress = ''
          rail.style.setProperty('--p', '0')
          gsap.fromTo(rail, { scaleY: 0 }, {
            scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: rail.parentElement, start: 'top 76%', end: 'bottom 58%', scrub: 0.3 },
            // The end band's arrowhead counter-scales with this (motion.css).
            onUpdate() { rail.style.setProperty('--p', this.progress().toFixed(3)) },
          })
        })
        // Ribbons that draw in step with reading: the weave, the loop.
        const scrubbed = Array.from(document.querySelectorAll<SVGSVGElement>('.ribbon[data-draw="scrub"]'))
        scrubbed.forEach((ribbon) => {
          ribbon.classList.add('is-in')
          ribbon.dataset.progress = ''
          const heads = Array.from(ribbon.querySelectorAll<SVGElement>('.ribbon__head'))
          gsap.fromTo(ribbon.querySelectorAll('.ribbon__guide'), { strokeDashoffset: 1 }, {
            strokeDashoffset: 0, ease: 'none',
            scrollTrigger: { trigger: ribbon.parentElement ?? ribbon, start: 'top 80%', end: 'center 45%', scrub: 0.5 },
            onUpdate() { land(heads, this.progress() > 0.97) },
          })
        })

        // From lead to customer: events complete in order as the card scrolls
        // through, the rail follows, and the status keeps up.
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
            if (status) {
              const index = Math.max(0, count - 1)
              status.textContent = statuses[index] ?? ''
              status.dataset.tone = tones[index]
            }
          }
          if (rail) rail.dataset.progress = ''
          ScrollTrigger.create({
            trigger: story,
            start: 'top 72%',
            end: 'bottom 62%',
            scrub: 0.3,
            onUpdate: (self) => {
              show(Math.min(events.length, Math.floor(self.progress * events.length + 0.6)))
              if (rail) rail.style.transform = `scaleY(${self.progress})`
            },
            onRefresh: (self) => {
              show(Math.min(events.length, Math.floor(self.progress * events.length + 0.6)))
              if (rail) rail.style.transform = `scaleY(${self.progress})`
            },
          })
        })

        let active = true
        document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh() })
        return () => {
          active = false
          flows.forEach((flow) => flow.classList.remove('flow-ready'))
          rails.forEach((rail) => { delete rail.dataset.progress; rail.style.removeProperty('--p') })
          scrubbed.forEach((ribbon) => { delete ribbon.dataset.progress })
          document.querySelectorAll('.ribbon__head[data-landed]').forEach((head) => head.removeAttribute('data-landed'))
          stories.forEach((story) => {
            story.querySelectorAll('[data-flow-step]').forEach((event) => event.removeAttribute('data-pending'))
            const rail = story.querySelector<HTMLElement>('.ribbon-band')
            if (rail) { rail.style.transform = ''; delete rail.dataset.progress }
          })
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
