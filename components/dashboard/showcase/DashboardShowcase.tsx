'use client'

/**
 * The client dashboard, composed on one screen for the homepage.
 *
 *   <DashboardShowcase active="conversations" />
 *
 * A sidebar with the eight sections and six bounded regions: the KPI row
 * (overview), conversations, a leads table, automation status, upcoming
 * appointments and the trend chart (analytics). The `active` region gets a
 * vermilion ring and a caption, its sidebar item is marked, and the others
 * ease back. Laid out on a 1120×700 canvas that scales to the container's
 * width — use it at 1024px and up; below that, use <DashboardSnippet />.
 *
 * Decorative: `aria-hidden` and `inert`, with nothing focusable. The copy
 * around it explains each area. Numbers come from the demo's sample data
 * (content/demo/showcase-data.ts) and count up once, unless the visitor
 * prefers reduced motion.
 */

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { fmtCurrencyCompact, fmtNumber } from '@/content/demo/format'
import { showcase } from '@/content/demo/showcase-data'
import type { ShowcaseArea, ShowcaseData } from '@/content/demo/types'
import { AREA_LABEL, NAV, Tone, TrendBars, cx } from './parts'

const format = (value: number, kind: ShowcaseData['kpis'][number]['format']) => (kind === 'currency' ? fmtCurrencyCompact(value) : fmtNumber(value))

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts the KPI figures up from zero the first time the showcase comes into view. */
function useCountUp(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const node = root.current
    if (!node || reducedMotion() || !('IntersectionObserver' in window)) return
    const figures = Array.from(node.querySelectorAll<HTMLElement>('[data-count]'))
    const read = (el: HTMLElement) => ({ el, to: Number(el.dataset.count), kind: el.dataset.format as ShowcaseData['kpis'][number]['format'] })
    const items = figures.map(read)
    let frame = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100)
        const eased = 1 - (1 - t) ** 3
        for (const { el, to, kind } of items) el.textContent = format(kind === 'currency' ? Math.round((to * eased) / 100) * 100 : Math.round(to * eased), kind)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const box = node.getBoundingClientRect()
    const inView = box.top < window.innerHeight && box.bottom > 0
    if (inView) {
      run()
      return () => cancelAnimationFrame(frame)
    }
    // Out of view: start from zero so the count is what the visitor sees arrive.
    for (const { el, kind } of items) el.textContent = format(0, kind)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        run()
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      for (const { el, to, kind } of items) el.textContent = format(to, kind)
    }
  }, [root])
}

/** Exact scaling where CSS can't divide lengths: sets --showcase-scale from the container width. */
/** Scales the 1120px canvas to the frame's width, and keeps it fitted as the frame resizes. */
function useFitScale(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const node = root.current
    if (!node) return
    const update = () => {
      if (node.clientWidth > 0) node.style.setProperty('--showcase-scale', String(node.clientWidth / 1120))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [root])
}

/** One bounded region: a ring and caption when active; content clipped to the box so nothing spills. */
function Region({ area, active, panel = true, className, children }: { area: ShowcaseArea; active: ShowcaseArea; panel?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={cx('showcase__region', `showcase__region--${area}`, area === active && 'is-active')}>
      <span className="showcase__tag">{AREA_LABEL[area]}</span>
      <div className={cx('showcase__box', panel && 'ui-panel', className)}>{children}</div>
    </div>
  )
}

export function DashboardShowcase({ active, className }: { active: ShowcaseArea; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  useCountUp(root)
  useFitScale(root)
  const { workspace, kpis, conversations, leads, automations, running, appointments, trend, unread } = showcase

  return (
    <div ref={root} className={cx('showcase', className)} data-active={active} aria-hidden="true" inert>
      <div className="showcase__canvas ui">
        <div className="showcase__side">
          <span className="showcase__wordmark">CloseAgain</span>
          <span className="showcase__ws">
            <span className="showcase__mark">{workspace.mark}</span>
            <span className="showcase__wstext">
              <span className="showcase__wsname">{workspace.name}</span>
              <span className="showcase__wsmeta">{workspace.meta}</span>
            </span>
          </span>
          <ul className="showcase__nav">
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id} className={cx('showcase__navitem', item.id === active && 'is-active')}>
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{item.label}</span>
                  {item.id === 'conversations' && <span className="showcase__count">{unread}</span>}
                </li>
              )
            })}
          </ul>
          <span className="showcase__user">
            <span className="ui-avatar ui-avatar--sm">DW</span>
            <span className="showcase__wstext">
              <span className="showcase__wsname">{workspace.user}</span>
              <span className="showcase__wsmeta">{workspace.role}</span>
            </span>
          </span>
        </div>

        <div className="showcase__main">
          <div className="showcase__top">
            <div>
              <p className="showcase__title">{workspace.name}</p>
              <p className="showcase__sub">{workspace.date} · last 30 days</p>
            </div>
            <span className="ui-sample">Sample workspace</span>
          </div>

          <div className="showcase__grid">
            <Region area="overview" active={active} panel={false} className="showcase__kpis">
              {kpis.map((kpi) => (
                <div key={kpi.id} className={cx('ui-panel showcase__kpi', kpi.id === 'recovered' && 'is-emphasis')}>
                  <span className="ui-label showcase__kpilabel">{kpi.label}</span>
                  <span className="showcase__kpivalue" data-count={kpi.value} data-format={kpi.format}>
                    {format(kpi.value, kpi.format)}
                  </span>
                  <span className="showcase__kpinote">
                    {kpi.delta && <span className={cx('ui-delta', kpi.up ? 'ui-delta--up' : 'ui-delta--down')}>{kpi.delta}</span>} {kpi.delta ? 'vs prior 30d' : kpi.note}
                  </span>
                </div>
              ))}
            </Region>

            <Region area="analytics" active={active}>
              <div className="showcase__head">
                <span className="showcase__h">Performance trend</span>
                <span className="showcase__legend">
                  <span className="showcase__key" /> New
                  <span className="showcase__key showcase__key--red" /> Recovered
                </span>
              </div>
              <p className="showcase__meta">
                {fmtNumber(trend.newTotal)} new and {fmtNumber(trend.recoveredTotal)} recovered leads, per day
              </p>
              <TrendBars trend={trend} height={118} />
            </Region>

            <Region area="conversations" active={active}>
              <div className="showcase__head">
                <span className="showcase__h">Conversations</span>
                <span className="showcase__meta">{unread} unread</span>
              </div>
              <ul className="showcase__rows">
                {conversations.slice(0, 3).map((row) => (
                  <li key={row.id} className="showcase__conv">
                    <span className={cx('ui-avatar', row.recovered && 'ui-avatar--red')}>{row.initials}</span>
                    <span className="showcase__convbody">
                      <span className="showcase__convtop">
                        <span className={cx('showcase__name', row.unread && 'is-unread')}>{row.name}</span>
                        <Tone tone={row.tone}>{row.stage}</Tone>
                      </span>
                      <span className="showcase__snippet">
                        {row.prefix && <span className="showcase__prefix">{row.prefix}</span>}
                        {row.text}
                      </span>
                    </span>
                    <span className="showcase__time">
                      {row.time}
                      {row.unread && <span className="ui-dot" />}
                    </span>
                  </li>
                ))}
              </ul>
            </Region>

            <Region area="leads" active={active}>
              <div className="showcase__head">
                <span className="showcase__h">Leads</span>
                <span className="showcase__meta">Sorted by last contact</span>
              </div>
              <table className="ui-table showcase__table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Next action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 4).map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <span className="showcase__name">{lead.name}</span>
                      </td>
                      <td>
                        <Tone tone={lead.tone}>{lead.status}</Tone>
                      </td>
                      <td>
                        <span className="showcase__score">
                          {lead.score}
                          <span className="ui-track">
                            <span style={{ width: `${lead.score}%` }} />
                          </span>
                        </span>
                      </td>
                      <td className="showcase__next">{lead.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Region>

            <Region area="automations" active={active}>
              <div className="showcase__head">
                <span className="showcase__h">Automations</span>
                <span className="showcase__meta">
                  {running.on} of {running.of} on
                </span>
              </div>
              <ul className="showcase__rows">
                {automations.slice(0, 3).map((row) => (
                  <li key={row.id} className="showcase__auto">
                    <span className={cx('showcase__switch', row.enabled && 'is-on')} />
                    <span className="showcase__autobody">
                      <span className="showcase__name">{row.name}</span>
                      <span className="showcase__cellsub">
                        {row.replyRate} · {row.next}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Region>

            <Region area="appointments" active={active}>
              <div className="showcase__head">
                <span className="showcase__h">Upcoming</span>
                <span className="showcase__meta">Next 7 days</span>
              </div>
              <ul className="showcase__rows">
                {appointments.slice(0, 3).map((row) => (
                  <li key={row.id} className="showcase__appt">
                    <span className="showcase__date">
                      <span>{row.weekday}</span>
                      <b>{row.date}</b>
                    </span>
                    <span className="showcase__autobody">
                      <span className="showcase__name">{row.name}</span>
                      <span className="showcase__cellsub">
                        {row.time} · {row.type}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Region>
          </div>
        </div>
      </div>
    </div>
  )
}
