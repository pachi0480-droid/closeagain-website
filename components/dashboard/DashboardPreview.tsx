'use client'

// Self-contained: the demo stylesheet is not part of the marketing bundle.
import '@/styles/dashboard.css'

/**
 * A still, compact picture of the client dashboard for the marketing site.
 *
 *   <div className="ui-frame">
 *     <DashboardPreview view="overview" />
 *   </div>
 *
 * It renders the app shell (sidebar with the matching item active, top bar)
 * and a condensed version of one view, from the same sample data and chart
 * components as the live demo. It is decorative: `inert` and `aria-hidden`,
 * with no focusable elements. It is laid out on a 1120×700 canvas and scales
 * to the width of its container. Changing `view` crossfades between views
 * (instant under reduced motion).
 */

import {
  CalendarDays,
  ChartLine,
  Check,
  Clock,
  GitBranch,
  Inbox,
  LayoutDashboard,
  LucideProvider,
  MessageSquare,
  MessagesSquare,
  Plug,
  Search,
  Send,
  Settings,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { automationStats, conversionTrend, dailySeries, stageCounts, summarize, windowFor } from '@/content/demo/metrics'
import {
  MONTHS_LONG,
  WEEKDAYS,
  fmtCurrencyCompact,
  fmtDate,
  fmtNumber,
  fmtPercent,
  fmtStamp,
  fmtTimeShort,
  fmtWeekdayDate,
} from '@/content/demo/format'
import { TODAY, atDay, dayIndex, localParts, atLocal } from '@/content/demo/time'
import { workspaceAppointments, workspaceAutomations, workspaceClient, workspaceLeads } from '@/content/demo/workspace'
import { BarList, TimeChart } from './charts'
import { Thread, snippet } from './conversation'
import { describeStep, sourceLabel, stageLabel } from './labels'
import { Avatar, Badge, StageBadge, cx } from './ui'

export type PreviewView = 'overview' | 'conversations' | 'leads' | 'automations' | 'appointments' | 'analytics'

const NAV: Array<{ id: PreviewView | 'integrations' | 'settings'; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'conversations', label: 'Conversations', icon: MessagesSquare },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: ChartLine },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const HEADINGS: Record<PreviewView, { title: string; description: string }> = {
  overview: { title: 'Overview', description: 'Juniper Row Realty · last 30 days' },
  conversations: { title: 'Conversations', description: 'Every inquiry, reply and follow-up in one inbox' },
  leads: { title: 'Leads', description: 'Source, score, status and next action for every lead' },
  automations: { title: 'Automations', description: 'Follow-up sequences and re-engagement campaigns' },
  appointments: { title: 'Appointments', description: 'Showings and consultations booked through follow-up' },
  analytics: { title: 'Analytics', description: 'Follow-up performance, last 30 days' },
}

// ── Data, computed once from the same sample workspace as the live demo ──

const month = windowFor(30)
const current = summarize(workspaceLeads, workspaceAppointments, month)
const series = dailySeries(workspaceLeads, workspaceAppointments, 30)
const labels = series.map((point) => fmtDate(point.start))
const longLabels = series.map((point) => fmtWeekdayDate(point.start))
const conversion = conversionTrend(workspaceLeads, workspaceAppointments, 30)
const averageConversion = conversion.reduce((sum, value) => sum + value, 0) / conversion.length
const conversations = workspaceLeads.filter((lead) => lead.thread.some((message) => message.from === 'lead'))
const featuredThread = workspaceLeads.find((lead) => lead.id === 'jr-a01') ?? conversations[0]

export function DashboardPreview({ view, className }: { view: PreviewView; className?: string }) {
  const [layers, setLayers] = useState<{ current: PreviewView; previous: PreviewView | null }>({ current: view, previous: null })
  // Remember the outgoing view for the length of the crossfade.
  if (layers.current !== view) setLayers({ current: view, previous: layers.current })

  const heading = HEADINGS[layers.current]

  return (
    <div className={cx('ui app-preview', className)} inert aria-hidden="true">
      <LucideProvider size={15} strokeWidth={1.5}>
        <div className="app-preview__canvas">
          <div className="app-preview__sidebar">
            <span className="app-wordmark">CloseAgain</span>
            <span className="app-preview__workspace">
              <span className="app-workspace__mark">JR</span>
              <span className="app-workspace__text">
                <span className="app-workspace__name">{workspaceClient.name}</span>
                <span className="app-workspace__meta">Scale plan · {workspaceClient.location}</span>
              </span>
            </span>
            <span className="app-preview__nav">
              {NAV.map((item) => {
                const Icon = item.icon
                return (
                  <span key={item.id} className={cx('app-nav__link', item.id === layers.current && 'is-active')}>
                    <Icon className="app-nav__icon" />
                    <span className="app-nav__label">{item.label}</span>
                    {item.id === 'conversations' && <span className="app-nav__count">{conversations.filter((lead) => lead.unread).length}</span>}
                    {item.id === 'integrations' && <span className="app-nav__alert" />}
                  </span>
                )
              })}
            </span>
            <span className="app-preview__user">
              <span className="ui-avatar ui-avatar--sm">DW</span>
              <span className="app-user__text">
                <span className="app-user__name">Dana Whitfield</span>
                <span className="app-user__role">Owner · Broker</span>
              </span>
            </span>
          </div>

          <div className="app-preview__main">
            <span className="app-preview__notice">
              <span className="ui-sample">Sample workspace</span>
              <span>Demo data</span>
            </span>
            <div className="app-preview__topbar">
              <span className="app-preview__titles">
                <span className="app-preview__title">{heading.title}</span>
                <span className="app-desc">{heading.description}</span>
              </span>
              <span className="app-preview__controls">
                <span className="app-preview__search">
                  <Search />
                  Find a lead…
                </span>
                <span className="ui-tabs app-segmented">
                  <span className="ui-tab">7 days</span>
                  <span className="ui-tab is-on">30 days</span>
                  <span className="ui-tab">90 days</span>
                </span>
                <span className="ui-btn">
                  <Inbox />
                  Open inbox
                </span>
              </span>
            </div>
            <div className="app-preview__stage">
              {layers.previous && (
                <div
                  key={layers.previous}
                  className="app-preview__layer is-leaving"
                  onAnimationEnd={() => setLayers((state) => ({ ...state, previous: null }))}
                >
                  <PreviewBody view={layers.previous} />
                </div>
              )}
              <div key={layers.current} className="app-preview__layer is-entering">
                <PreviewBody view={layers.current} />
              </div>
            </div>
          </div>
        </div>
      </LucideProvider>
    </div>
  )
}

function Card({ title, meta, children, className, flush = false }: { title?: string; meta?: string; children: ReactNode; className?: string; flush?: boolean }) {
  return (
    <div className={cx('ui-panel app-preview__card', className)}>
      {title && (
        <div className="ui-panel__head">
          <span className="app-panel__titles">
            <span className="ui-panel__title">{title}</span>
            {meta && <span className="ui-meta">{meta}</span>}
          </span>
        </div>
      )}
      <div className={flush ? '' : 'ui-panel__body'}>{children}</div>
    </div>
  )
}

function Stat({ label, value, note, emphasis }: { label: string; value: string; note: string; emphasis?: boolean }) {
  return (
    <div className={cx('ui-panel app-metric app-preview__stat', emphasis && 'app-metric--emphasis')}>
      <span className="ui-label">{label}</span>
      <span className="ui-metric app-metric__value">{value}</span>
      <span className="ui-meta">{note}</span>
    </div>
  )
}

function Rows({ count }: { count: number }) {
  return (
    <span className="app-preview__rows">
      {conversations.slice(0, count).map((lead) => {
        const { prefix, text } = snippet(lead)
        return (
          <span key={lead.id} className={cx('ui-row app-recent', lead.unread && 'is-unread')}>
            <Avatar name={lead.name} size="sm" tone={lead.recoveredAt ? 'red' : undefined} />
            <span className="app-recent__body">
              <span className="app-recent__top">
                <span className="app-recent__name">{lead.name}</span>
                <StageBadge stage={lead.stage} outcome={lead.outcome} short />
              </span>
              <span className="app-recent__snippet">
                {prefix && <span className="app-conv__prefix">{prefix}</span>}
                {text}
              </span>
            </span>
            <span className="app-recent__side">
              <span className="app-recent__time">{fmtStamp(lead.lastContactAt)}</span>
              {lead.unread && <span className="app-conv__dot app-recent__dot" />}
            </span>
          </span>
        )
      })}
    </span>
  )
}

function PreviewBody({ view }: { view: PreviewView }) {
  switch (view) {
    case 'overview':
      return (
        <div className="app-preview__grid">
          <div className="app-preview__stats">
            <Stat label="New leads" value={fmtNumber(current.newLeads)} note="Last 30 days" />
            <Stat label="Recovered leads" value={fmtNumber(current.recovered)} note="Older leads that replied" emphasis />
            <Stat label="Appointments" value={fmtNumber(current.appointments)} note="Booked from follow-up" />
            <Stat label="Pipeline influenced" value={fmtCurrencyCompact(current.pipeline)} note="Est. commission" />
          </div>
          <div className="app-preview__split">
            <Card title="Lead activity" meta="New and recovered leads per day">
              <TimeChart
                interactive={false}
                summary="Lead activity"
                labels={labels}
                longLabels={longLabels}
                height={210}
                series={[
                  { id: 'new', label: 'New leads', values: series.map((point) => point.newLeads), tone: 'ink', area: true },
                  { id: 'recovered', label: 'Recovered', values: series.map((point) => point.recovered), tone: 'accent', area: true },
                ]}
              />
            </Card>
            <Card title="Recent conversations" meta={`${conversations.filter((lead) => lead.unread).length} unread`} flush>
              <Rows count={5} />
            </Card>
          </div>
        </div>
      )

    case 'conversations':
      return (
        <div className="ui-panel app-preview__inbox">
          <span className="app-preview__convlist">
            {conversations.slice(0, 6).map((lead) => {
              const { prefix, text } = snippet(lead)
              return (
                <span key={lead.id} className={cx('app-conv', lead.id === featuredThread.id && 'is-selected', lead.unread && 'is-unread')}>
                  <Avatar name={lead.name} size="sm" tone={lead.recoveredAt ? 'red' : undefined} />
                  <span className="app-conv__body">
                    <span className="app-conv__top">
                      <span className="app-conv__name">{lead.name}</span>
                      <span className="app-conv__time">{fmtStamp(lead.lastContactAt)}</span>
                    </span>
                    <span className="app-conv__snippet">
                      {prefix && <span className="app-conv__prefix">{prefix}</span>}
                      {text}
                    </span>
                  </span>
                </span>
              )
            })}
          </span>
          <span className="app-preview__thread">
            <span className="app-threadpane__head">
              <span className="app-threadpane__who">
                <Avatar name={featuredThread.name} />
                <span className="app-threadpane__titles">
                  <span className="app-threadpane__name">{featuredThread.name}</span>
                  <span className="ui-meta">{featuredThread.interest}</span>
                </span>
                <StageBadge stage={featuredThread.stage} outcome={featuredThread.outcome} />
              </span>
              <span className="ui-btn ui-btn--quiet">
                <Check />
                Mark as handled
              </span>
            </span>
            <span className="app-preview__messages">
              <Thread lead={{ ...featuredThread, thread: featuredThread.thread.slice(-5) }} />
            </span>
          </span>
        </div>
      )

    case 'leads':
      return (
        <div className="ui-panel app-preview__table">
          <table className="ui-table app-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Source</th>
                <th>Score</th>
                <th>Status</th>
                <th>Last contact</th>
              </tr>
            </thead>
            <tbody>
              {workspaceLeads.slice(0, 9).map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <span className="app-leadcell">
                      <Avatar name={lead.name} size="sm" tone={lead.recoveredAt ? 'red' : undefined} />
                      <span className="app-leadcell__text">
                        <span className="app-cell-title">{lead.name}</span>
                        <span className="app-cell-sub">{lead.interest}</span>
                      </span>
                    </span>
                  </td>
                  <td>{sourceLabel[lead.source]}</td>
                  <td>
                    <span className="app-score">
                      <span className="app-score__num">{lead.score}</span>
                      <span className="ui-track app-score__track">
                        <span style={{ width: `${lead.score}%`, background: lead.score >= 80 ? 'var(--ink)' : lead.score >= 50 ? 'var(--ink-3)' : 'var(--line-strong)' }} />
                      </span>
                    </span>
                  </td>
                  <td>
                    <StageBadge stage={lead.stage} outcome={lead.outcome} short />
                  </td>
                  <td>{fmtStamp(lead.lastContactAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'automations': {
      const flow = workspaceAutomations[0]
      const icons: Record<string, LucideIcon> = { trigger: Zap, wait: Clock, message: MessageSquare, condition: GitBranch, action: Send }
      return (
        <div className="app-preview__split app-preview__split--even">
          <Card title="Campaigns and sequences" meta="Last 30 days" flush>
            <span className="app-preview__rows">
              {workspaceAutomations.slice(0, 6).map((automation) => {
                const stats = automationStats(automation, workspaceLeads, workspaceAppointments, month)
                return (
                  <span key={automation.id} className="ui-row app-preview__auto">
                    <span className={cx('app-switch app-preview__switch', automation.enabled && 'is-on')}>
                      <span className="app-switch__thumb" />
                    </span>
                    <span className="app-recent__body">
                      <span className="app-cell-title">{automation.name}</span>
                      <span className="app-cell-sub">{automation.audience}</span>
                    </span>
                    <span className="app-preview__autostat">{stats.enrolled ? fmtPercent(stats.replyRate) : '—'}</span>
                  </span>
                )
              })}
            </span>
          </Card>
          <Card title={flow.name} meta="Automation builder">
            <span className="app-preview__flow">
              {flow.steps.slice(0, 6).map((step, index) => {
                const Icon = icons[step.kind]
                return (
                  <span key={step.id} className={cx('app-step', `app-step--${step.kind}`)}>
                    <span className="app-step__rail">
                      <span className="app-step__icon">
                        <Icon />
                      </span>
                    </span>
                    <span className="app-step__card">
                      <span className="ui-label">
                        {index + 1}. {step.kind}
                      </span>
                      <span className="app-step__text">{describeStep(step)}</span>
                    </span>
                  </span>
                )
              })}
            </span>
          </Card>
        </div>
      )
    }

    case 'appointments':
      return (
        <div className="app-preview__split">
          <Card>
            <MiniMonth />
          </Card>
          <Card title="Upcoming" meta="Next 7 days" flush>
            <span className="app-preview__rows">
              {workspaceAppointments
                .filter((appointment) => dayIndex(appointment.start) >= TODAY && (appointment.status === 'confirmed' || appointment.status === 'scheduled'))
                .slice(0, 6)
                .map((appointment) => (
                  <span key={appointment.id} className="ui-row app-preview__appt">
                    <span className="app-recent__body">
                      <span className="app-cell-title">{appointment.leadName}</span>
                      <span className="app-cell-sub">
                        {fmtWeekdayDate(appointment.start)} · {fmtTimeShort(appointment.start)} · {appointment.type}
                      </span>
                    </span>
                    <Badge tone={appointment.status === 'confirmed' ? 'ink' : 'default'}>{appointment.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}</Badge>
                  </span>
                ))}
            </span>
          </Card>
        </div>
      )

    case 'analytics': {
      const counts = stageCounts(workspaceLeads)
      return (
        <div className="app-preview__grid">
          <div className="app-preview__stats">
            <Stat label="Conversations" value={fmtNumber(current.conversations)} note="Two-way, 30 days" />
            <Stat label="Recovered leads" value={fmtNumber(current.recovered)} note="Older leads that replied" emphasis />
            <Stat label="Response rate" value={fmtPercent(current.responseRate)} note="Leads who replied" />
            <Stat label="Conversion rate" value={fmtPercent(current.conversionRate)} note="Lead → appointment" />
          </div>
          <div className="app-preview__split">
            <Card title="Conversion trend" meta="Appointments per new lead, trailing 7 days">
              <TimeChart
                interactive={false}
                summary="Conversion trend"
                labels={labels}
                longLabels={longLabels}
                height={210}
                integer={false}
                endLabels={false}
                format={(value) => fmtPercent(value)}
                reference={{ value: averageConversion, label: `Average ${fmtPercent(averageConversion)}` }}
                series={[{ id: 'conversion', label: 'Conversion', values: conversion, tone: 'ink' }]}
              />
            </Card>
            <Card title="Pipeline" meta="Leads by stage">
              <BarList
                stacked
                label="Leads by stage"
                rows={(['new', 'active', 'qualified', 'appointment'] as const).map((stage) => ({
                  id: stage,
                  label: stageLabel[stage],
                  value: counts[stage],
                  highlight: false,
                }))}
              />
            </Card>
          </div>
        </div>
      )
    }
  }
}

function MiniMonth() {
  const { year, month: monthIndex } = localParts(atDay(TODAY, 12))
  const first = dayIndex(atLocal(year, monthIndex, 1, 12))
  const start = first - localParts(atDay(first, 12)).weekday
  const byDay = new Map<number, typeof workspaceAppointments>()
  for (const appointment of workspaceAppointments) {
    const day = dayIndex(appointment.start)
    byDay.set(day, [...(byDay.get(day) ?? []), appointment])
  }
  return (
    <span className="app-preview__month">
      <span className="app-caltools__title">
        {MONTHS_LONG[monthIndex]} {year}
      </span>
      <span className="app-preview__monthgrid">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="app-month__weekday">
            {weekday}
          </span>
        ))}
        {Array.from({ length: 35 }, (_, index) => {
          const day = start + index
          const parts = localParts(atDay(day, 12))
          const events = (byDay.get(day) ?? []).slice(0, 2)
          return (
            <span key={day} className={cx('app-month__day', parts.month !== monthIndex && 'is-outside', day === TODAY && 'is-today')}>
              <span className="app-month__date">{parts.date}</span>
              {events.map((appointment) => (
                <span key={appointment.id} className={cx('app-event', `app-event--${appointment.status}`)}>
                  <span className="app-event__time">{fmtTimeShort(appointment.start)}</span>
                  <span className="app-event__name">{appointment.leadName.split(' ')[0]}</span>
                </span>
              ))}
            </span>
          )
        })}
      </span>
    </span>
  )
}
