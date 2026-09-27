'use client'

import { useEffect, useRef, useState } from 'react'
import { DashboardShowcase, DashboardSnippet } from '@/components/dashboard/showcase'
import { SectionHead } from '@/components/editorial/blocks'
import { home, type ShowcaseArea } from '@/content/home'

/**
 * The dashboard, one area at a time. On wide screens the dashboard stays in
 * view while the list beside it scrolls; whichever area is at the middle of
 * the window is ringed in the dashboard. On smaller screens each area gets
 * its own readable card under its description.
 *
 * The list is the content; the dashboard art is decorative (aria-hidden).
 */
export function Showcase() {
  const { eyebrow, title, views, note, link } = home.showcase
  const [active, setActive] = useState<ShowcaseArea>(views[0].id)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const node = list.current
    if (!node || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const area = (entry.target as HTMLElement).dataset.area as ShowcaseArea | undefined
          if (entry.isIntersecting && area) setActive(area)
        }
      },
      // A thin band just above the middle of the window.
      { rootMargin: '-42% 0px -52% 0px' },
    )
    node.querySelectorAll('[data-area]').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section tour" aria-labelledby="showcase-title">
      <div className="wrap">
        <SectionHead id="showcase-title" eyebrow={eyebrow} title={title} link={link} />

        <div className="tour__layout">
          {/* On phones the list scrolls sideways, so it takes focus for keyboard scrolling. */}
          <ol className="tour__list" ref={list} tabIndex={0} aria-label="Dashboard areas">
            {views.map((view, i) => (
              <li key={view.id} className="tour__item" data-area={view.id} data-active={view.id === active || undefined}>
                <span className="tour__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="tour__label">{view.label}</h3>
                <p className="tour__body">{view.body}</p>
                <DashboardSnippet area={view.id} className="tour__snippet" />
              </li>
            ))}
          </ol>

          <div className="tour__stage">
            <DashboardShowcase active={active} />
          </div>
        </div>

        <p className="tour__note">
          <span className="ui-sample">Sample data</span>
          <span>{note}</span>
        </p>
      </div>
    </section>
  )
}
