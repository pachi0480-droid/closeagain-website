// The showcase's own small stylesheet: the demo's large dashboard.css never loads on the homepage.
import '@/styles/showcase.css'

/**
 * One area of the client dashboard as a compact, readable card for phones and
 * tablets (under 1024px), where the full <DashboardShowcase /> would be too
 * small to read. Unscaled: primary text at 15–16px, meta at 13px or more.
 *
 *   <DashboardSnippet area="leads" />
 *
 * Decorative (`aria-hidden`, `inert`, nothing focusable); the copy beside it
 * explains the area. Same sample numbers as the demo.
 */

import { fmtCurrencyCompact, fmtNumber } from '@/content/demo/format'
import { showcase } from '@/content/demo/showcase-data'
import type { ShowcaseArea } from '@/content/demo/types'
import { Tone, TrendBars, cx } from './parts'

const TITLE: Record<ShowcaseArea, string> = {
  overview: 'Last 30 days',
  conversations: 'Conversations',
  leads: 'Leads',
  automations: 'Automations',
  appointments: 'Upcoming',
  analytics: 'Performance trend',
}

export function DashboardSnippet({ area, className }: { area: ShowcaseArea; className?: string }) {
  return (
    <div className={cx('ui ui-panel showcase-snippet', `showcase-snippet--${area}`, className)} aria-hidden="true" inert>
      <div className="showcase-snippet__head">
        <span className="showcase-snippet__title">{TITLE[area]}</span>
        <span className="ui-sample">Sample data</span>
      </div>
      <div className="showcase-snippet__body">
        <SnippetBody area={area} />
      </div>
    </div>
  )
}

function SnippetBody({ area }: { area: ShowcaseArea }) {
  const { kpis, conversations, leads, automations, running, appointments, trend, unread } = showcase
  switch (area) {
    case 'overview':
      return (
        <ul className="showcase-snippet__kpis">
          {kpis
            .filter((kpi) => kpi.id !== 'active')
            .map((kpi) => (
              <li key={kpi.id} className={cx(kpi.id === 'recovered' && 'is-emphasis')}>
                <span className="showcase-snippet__label">{kpi.label}</span>
                <span className="showcase-snippet__value">{kpi.format === 'currency' ? fmtCurrencyCompact(kpi.value) : fmtNumber(kpi.value)}</span>
                <span className={cx('showcase-snippet__delta', kpi.up ? 'is-up' : 'is-down')}>{kpi.delta} vs prior 30d</span>
              </li>
            ))}
        </ul>
      )
    case 'conversations':
      return (
        <ul className="showcase-snippet__rows">
          {conversations.slice(0, 2).map((row) => (
            <li key={row.id} className="showcase-snippet__row">
              <span className={cx('ui-avatar', row.recovered && 'ui-avatar--red')}>{row.initials}</span>
              <span className="showcase-snippet__text">
                <span className="showcase-snippet__top">
                  <span className="showcase-snippet__tags">
                    <span className="showcase-snippet__name">{row.name}</span>
                    <Tone tone={row.tone}>{row.stage}</Tone>
                  </span>
                  <span className="showcase-snippet__meta">
                    {row.unread ? 'Unread · ' : ''}
                    {row.time}
                  </span>
                </span>
                <span className="showcase-snippet__line">
                  {row.prefix && <span className="showcase-snippet__prefix">{row.prefix}</span>}
                  {row.text}
                </span>
              </span>
            </li>
          ))}
          <li className="showcase-snippet__foot">{unread} waiting on a reply</li>
        </ul>
      )
    case 'leads':
      return (
        <ul className="showcase-snippet__rows">
          {leads.slice(0, 3).map((lead) => (
            <li key={lead.id} className="showcase-snippet__row">
              <span className="showcase-snippet__text">
                <span className="showcase-snippet__top">
                  <span className="showcase-snippet__name">{lead.name}</span>
                  <Tone tone={lead.tone}>{lead.status}</Tone>
                </span>
                <span className="showcase-snippet__meta">
                  Score {lead.score} · Next: {lead.next}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )
    case 'automations':
      return (
        <ul className="showcase-snippet__rows">
          {automations.slice(0, 3).map((row) => (
            <li key={row.id} className="showcase-snippet__row">
              <span className={cx('showcase__switch', row.enabled && 'is-on')} />
              <span className="showcase-snippet__text">
                <span className="showcase-snippet__name">{row.name}</span>
                <span className="showcase-snippet__meta">
                  {row.type} · {row.replyRate} · {row.next}
                </span>
              </span>
            </li>
          ))}
          <li className="showcase-snippet__foot">
            {running.on} of {running.of} automations running
          </li>
        </ul>
      )
    case 'appointments':
      return (
        <ul className="showcase-snippet__rows">
          {appointments.slice(0, 3).map((row) => (
            <li key={row.id} className="showcase-snippet__row">
              <span className="showcase__date showcase-snippet__date">
                <span>{row.weekday}</span>
                <b>{row.date}</b>
              </span>
              <span className="showcase-snippet__text">
                <span className="showcase-snippet__name">{row.name}</span>
                <span className="showcase-snippet__meta">
                  {row.when}, {row.time} · {row.type}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )
    case 'analytics':
      return (
        <div className="showcase-snippet__chart">
          <p className="showcase-snippet__line">
            {fmtNumber(trend.newTotal)} new and {fmtNumber(trend.recoveredTotal)} recovered leads
          </p>
          <p className="showcase-snippet__meta showcase-snippet__legend">
            <span className="showcase__key" /> New
            <span className="showcase__key showcase__key--red" /> Recovered · per day
          </p>
          <TrendBars trend={trend} height={96} />
        </div>
      )
  }
}
