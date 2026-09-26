'use client'

import { useEffect, useRef, useState } from 'react'
import { DashboardPreview } from '@/components/dashboard/DashboardPreview'
import { TextLink } from '@/components/ui/links'
import { home } from '@/content/home'

type ViewId = (typeof home.showcase.views)[number]['id']

/** The preview is laid out at this width and scaled to fit its frame. */
const DESIGN_WIDTH = 1120

/**
 * The dashboard, one area at a time. On wide screens the frame holds still
 * while the list scrolls past it, and whichever item crosses the middle of
 * the viewport becomes the highlighted view. On small screens the same
 * views are real tabs. Scrolling is never taken over.
 */
export function Showcase() {
  const { eyebrow, title, views, link } = home.showcase
  const [active, setActive] = useState<ViewId>('overview')
  const listRef = useRef<HTMLOListElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  // Wide screens: the item at the centre of the viewport chooses the view.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const wide = window.matchMedia('(min-width: 1024px)')
    let observer: IntersectionObserver | null = null

    const attach = () => {
      observer?.disconnect()
      observer = null
      if (!wide.matches) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive((entry.target as HTMLElement).dataset.view as ViewId)
          }
        },
        { rootMargin: '-48% 0px -48% 0px' },
      )
      list.querySelectorAll('[data-view]').forEach((item) => observer?.observe(item))
    }

    attach()
    wide.addEventListener('change', attach)
    return () => {
      observer?.disconnect()
      wide.removeEventListener('change', attach)
    }
  }, [])

  // Scale the fixed-size preview to its frame.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const resize = new ResizeObserver(([entry]) => {
      viewport.style.setProperty('--preview-scale', String(entry.contentRect.width / DESIGN_WIDTH))
    })
    resize.observe(viewport)
    return () => resize.disconnect()
  }, [])

  const activeIndex = views.findIndex((view) => view.id === active)

  return (
    <section className="showcase" aria-labelledby="showcase-title">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="showcase-title" className="showcase__title" data-scroll="rise">
          {title}
        </h2>
      </div>

      <div className="showcase__stage wrap">
        <ol ref={listRef} className="showcase__list">
          {views.map((view, i) => (
            <li
              key={view.id}
              data-view={view.id}
              className={['showcase__item', view.id === active && 'is-active'].filter(Boolean).join(' ')}
            >
              <span className="showcase__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="showcase__label">{view.label}</h3>
              <p className="showcase__body">{view.body}</p>
            </li>
          ))}
        </ol>

        <div className="showcase__sticky">
          <div className="showcase__tabs" role="group" aria-label="Dashboard areas">
            {views.map((view) => (
              <button
                key={view.id}
                type="button"
                aria-pressed={view.id === active}
                className="showcase__tab"
                onClick={() => setActive(view.id)}
              >
                {view.label}
              </button>
            ))}
          </div>

          <div className="showcase__frame ui-frame">
            <div className="ui-frame__bar">
              <span className="ui-frame__dots">
                <span />
                <span />
                <span />
              </span>
              <span className="pv__title">CloseAgain · {views[activeIndex]?.label}</span>
              <span className="ui-sample pv__sample">Sample workspace</span>
            </div>
            <div ref={viewportRef} className="showcase__viewport">
              <div className="showcase__canvas">
                <DashboardPreview view={active} />
              </div>
            </div>
          </div>

          <p className="showcase__caption" aria-live="polite">
            <span className="sr-only">Showing: </span>
            {views[activeIndex]?.label} — {views[activeIndex]?.body}
          </p>
          <TextLink href={link.href} arrow className="showcase__link">
            {link.label}
          </TextLink>
        </div>
      </div>
    </section>
  )
}
