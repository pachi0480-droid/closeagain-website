'use client'

import { ArrowRight, ArrowUpRight, CalendarCheck, Inbox, MessageSquare, PhoneMissed, RotateCcw, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { leadActivity, type ActivityKind } from '@/content/demo/activity'
import { automationReviews } from '@/content/demo/attention'
import {
  fmtAgo,
  fmtCurrency,
  fmtCurrencyCompact,
  fmtDate,
  fmtDayTime,
  fmtNumber,
  fmtPercent,
  fmtStamp,
  fmtTime,
  fmtUntil,
  fmtWeekdayDate,
} from '@/content/demo/format'
import { automationStats, dailySeries, recoveredOpportunities, summarize, windowFor } from '@/content/demo/metrics'
import { kits } from '@/content/demo/kits'
import { DAY, DEMO_NOW } from '@/content/demo/time'
import { workspaceClient } from '@/content/demo/workspace'
import { TimeChart, Sparkline, rolling } from '../charts'
import { snippet } from '../conversation'
import { priorLabel, rangeLabel, rangeOptions, useRange, type RangeDays } from '../hooks'
import { sourceLabel } from '../labels'
import { QuickFind } from '../QuickFind'
import { Avatar, Badge, EmptyState, Metric, PageHeader, Panel, Segmented, StageBadge, cx, deltaOf, pointsDelta } from '../ui'
import { NeedsAttention } from './NeedsAttention'
import { useAppointments, useAttention, useAutomations, useClientDemo, useLeads, useTasks } from './state'

const kit = kits[workspaceClient.kit]

export function OverviewView() {
  const router = useRouter()
  const { dispatch } = useClientDemo()
  const leads = useLeads()
  const appointments = useAppointments()
  const automations = useAutomations()
  const tasks = useTasks()
  const attention = useAttention()
  const { range, loading, change } = useRange(30)

  const period = useMemo(() => windowFor(range), [range])
  const current = useMemo(() => summarize(leads, appointments, period), [leads, appointments, period])
  const previous = useMemo(() => (range === 90 ? null : summarize(leads, appointments, windowFor(range, 1))), [leads, appointments, range])
  const series = useMemo(() => dailySeries(leads, appointments, range), [leads, appointments, range])
  const recovered = useMemo(() => recoveredOpportunities(leads, period), [leads, period])
  const activity = useMemo(() => leadActivity(leads, appointments, 8), [leads, appointments])

  const unread = leads.filter((lead) => lead.unread).length
  const active = leads.filter((lead) => lead.stage === 'active').length
  const upcoming = appointments.filter(
    (appointment) => appointment.start > DEMO_NOW && appointment.start < DEMO_NOW + 7 * DAY && (appointment.status === 'scheduled' || appointment.status === 'confirmed'),
  ).length
  const vs = priorLabel(range)
  const delta = (now: number, before: number | undefined) => (before === undefined ? undefined : deltaOf(now, before, vs))

  const openConversation = (leadId: string) => {
    dispatch({ type: 'select', leadId })
    router.push('/demo/conversations')
  }

  const recent = leads.filter((lead) => lead.thread.some((message) => message.from === 'lead')).slice(0, 6)
  const openTasks = tasks.filter((task) => !task.done)
  const doneCount = tasks.length - openTasks.length
  const orderedTasks = [...openTasks.sort((a, b) => a.due - b.due), ...tasks.filter((task) => task.done)]

  const reviews = new Map(automationReviews(automations, leads).map((review) => [review.automation.id, review.reason]))
  const automationRows = automations.map((automation) => ({ automation, stats: automationStats(automation, leads, appointments, period) }))
  const running = automations.filter((automation) => automation.enabled).length

  const labels = series.map((point) => fmtDate(point.start))
  const longLabels = series.map((point) => fmtWeekdayDate(point.start))
  const inflow = series.map((point) => point.newLeads + point.recovered)

  return (
    <>
      <PageHeader title="Overview" description={`Juniper Row Realty · ${fmtWeekdayDate(DEMO_NOW)}, ${fmtTime(DEMO_NOW)} ET`}>
        <QuickFind
          label="Find a lead or conversation"
          placeholder="Find a lead…"
          items={leads.map((lead) => ({ id: lead.id, title: lead.name, sub: lead.interest, meta: fmtStamp(lead.lastContactAt), keywords: lead.tags.join(' ') }))}
          onPick={(item) => openConversation(item.id)}
        />
        <Segmented label="Date range" options={rangeOptions} value={`${range}` as `${RangeDays}`} onChange={(value) => change(Number(value) as RangeDays)} />
        <Link href="/demo/conversations" className="ui-btn">
          <Inbox aria-hidden="true" />
          Open inbox
          {unread > 0 && <span className="app-btn-count">{unread}</span>}
        </Link>
      </PageHeader>

      <div className="app-page" aria-busy={loading}>
        <div className="app-grid app-grid--metrics">
          <Metric
            index={0}
            label="New leads"
            value={fmtNumber(current.newLeads)}
            delta={delta(current.newLeads, previous?.newLeads)}
            note={range === 90 ? rangeLabel(range) : undefined}
            loading={loading}
            chart={<Sparkline values={rolling(series.map((point) => point.newLeads))} tone="ink" />}
          />
          <Metric index={1} label="Active conversations" value={fmtNumber(active)} note={`${unread} waiting on a reply`} loading={loading} />
          <Metric
            index={2}
            label="Recovered leads"
            value={fmtNumber(current.recovered)}
            delta={delta(current.recovered, previous?.recovered)}
            note={range === 90 ? rangeLabel(range) : undefined}
            loading={loading}
            emphasis
            chart={<Sparkline values={rolling(series.map((point) => point.recovered))} tone="accent" />}
          />
          <Metric
            index={3}
            label="Appointments"
            value={fmtNumber(current.appointments)}
            delta={delta(current.appointments, previous?.appointments)}
            note={`${upcoming} in the next 7 days`}
            loading={loading}
          />
          <Metric
            index={4}
            label="Conversion rate"
            value={fmtPercent(current.conversionRate)}
            delta={previous ? pointsDelta(current.conversionRate, previous.conversionRate, vs) : undefined}
            note="New lead → appointment"
            loading={loading}
          />
          <Metric
            index={5}
            label="Pipeline influenced"
            value={fmtCurrencyCompact(current.pipeline)}
            delta={delta(current.pipeline, previous?.pipeline)}
            note="Est. commission"
            loading={loading}
          />
        </div>

        <NeedsAttention items={attention} index={1} />

        <div className="app-grid app-grid--main">
          <Panel
            index={2}
            title="Performance trend"
            meta={`New and recovered leads per day, ${rangeLabel(range)}`}
            className={cx(loading && 'is-refreshing')}
            actions={
              <Link href="/demo/analytics" className="app-textlink">
                Analytics
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            }
          >
            <TimeChart
              summary={`Leads per day, ${rangeLabel(range)}: ${current.newLeads} new and ${current.recovered} recovered.`}
              labels={labels}
              longLabels={longLabels}
              height={300}
              kind="columns"
              yLabel="Leads per day"
              totalLabel="In total"
              endLabels={false}
              series={[
                { id: 'new', label: 'New leads', values: series.map((point) => point.newLeads), tone: 'ink', stack: 'leads' },
                { id: 'recovered', label: 'Recovered', values: series.map((point) => point.recovered), tone: 'accent', stack: 'leads' },
                { id: 'average', label: '7-day average', values: rolling(inflow), tone: 'muted', mark: 'line', dashed: true },
              ]}
              format={(value) => (Number.isInteger(value) ? fmtNumber(value) : fmtNumber(value, 1))}
            />
          </Panel>

          <Panel
            index={3}
            title="Recent conversations"
            meta={`${unread} unread`}
            flush
            actions={
              <Link href="/demo/conversations" className="app-textlink">
                View all
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            }
          >
            {recent.length === 0 ? (
              <EmptyState title="No conversations yet" />
            ) : (
              <ul className="ui-list">
                {recent.map((lead) => {
                  const { prefix, text } = snippet(lead)
                  return (
                    <li key={lead.id}>
                      <Link
                        href="/demo/conversations"
                        className={cx('ui-row ui-row--interactive app-recent', lead.unread && 'is-unread')}
                        onClick={() => dispatch({ type: 'select', leadId: lead.id })}
                      >
                        <Avatar name={lead.name} tone={lead.recoveredAt ? 'red' : undefined} />
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
                          {lead.unread && (
                            <span className="app-conv__dot app-recent__dot">
                              <span className="app-sr">Unread</span>
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="app-grid app-grid--thirds">
          <Panel
            index={4}
            title="Follow-up tasks"
            meta={`${doneCount} of ${tasks.length} done today`}
            flush
            className="app-tasks-panel"
            actions={
              <span className="ui-track app-task-progress" aria-hidden="true">
                <span style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
              </span>
            }
          >
            <TaskList tasks={orderedTasks} onToggle={(taskId) => dispatch({ type: 'toggleTask', taskId })} onOpen={openConversation} />
          </Panel>

          <Panel
            index={5}
            title="Recovered opportunities"
            meta={`${fmtNumber(recovered.leads.length)} came back · ${fmtCurrencyCompact(recovered.value)} ${kit.valueLabel.toLowerCase()}`}
            flush
            className={cx(loading && 'is-refreshing')}
            actions={
              <Link href="/demo/leads?show=recovered" className="app-textlink">
                All
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            }
          >
            {recovered.leads.length === 0 ? (
              <EmptyState title="Nothing recovered yet">Older leads that reply to a re-engagement message show up here.</EmptyState>
            ) : (
              <ul className="ui-list">
                {recovered.leads.slice(0, 6).map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href="/demo/conversations"
                      className="ui-row ui-row--interactive app-opp"
                      onClick={() => dispatch({ type: 'select', leadId: lead.id })}
                    >
                      <Avatar name={lead.name} tone="red" />
                      <span className="app-opp__body">
                        <span className="app-opp__top">
                          <span className="app-opp__name">{lead.name}</span>
                          <span className="app-opp__value">{fmtCurrency(lead.value)}</span>
                        </span>
                        <span className="app-opp__sub">
                          <StageBadge stage={lead.stage} outcome={lead.outcome} short />
                          <span className="app-opp__when">Back {fmtAgo(lead.recoveredAt ?? lead.lastContactAt)}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel index={6} title="Lead activity" meta="Newest first · last 7 days" flush>
            {activity.length === 0 ? (
              <EmptyState title="A quiet week">New inquiries, replies and bookings appear here as they happen.</EmptyState>
            ) : (
              <ol className="app-feed">
                {activity.map((event) => {
                  const Icon = activityIcon[event.kind]
                  return (
                    <li key={event.id}>
                      <button type="button" className="app-feed__item" onClick={() => openConversation(event.leadId)}>
                        <span className={cx('app-feed__icon', `is-${event.kind}`)} aria-hidden="true">
                          <Icon size={15} />
                        </span>
                        <span className="app-feed__text">
                          <span className="app-feed__line">{activityLine(event.kind, event.lead)}</span>
                          <span className="app-feed__detail">
                            {event.kind === 'booked' && event.appointment
                              ? `${event.appointment.type} · ${fmtDayTime(event.appointment.start)}`
                              : event.body
                                ? `“${event.body}”`
                                : sourceLabel[event.source]}
                          </span>
                        </span>
                        <span className="app-feed__time">{fmtAgo(event.at)}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </Panel>
        </div>

        <Panel
          index={7}
          title="Automation status"
          meta={`${running} of ${automations.length} running · ${rangeLabel(range)}`}
          flush
          className={cx(loading && 'is-refreshing')}
          actions={
            <Link href="/demo/automations" className="app-textlink">
              Automations
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          }
        >
          <div className="app-table-wrap">
            <table className="ui-table app-table app-table--stack app-statustable">
              <caption className="app-sr">Automation status and performance, {rangeLabel(range)}</caption>
              <thead>
                <tr>
                  <th scope="col">Automation</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="ui-num">
                    Enrolled
                  </th>
                  <th scope="col" className="ui-num">
                    Replies
                  </th>
                  <th scope="col" className="ui-num">
                    Booked
                  </th>
                  <th scope="col" className="ui-num">
                    Recovered
                  </th>
                  <th scope="col">Next send</th>
                </tr>
              </thead>
              <tbody>
                {automationRows.map(({ automation, stats }) => {
                  const reminder = automation.templateId === 'tpl-reminder'
                  const review = reviews.get(automation.id)
                  return (
                    <tr key={automation.id}>
                      <th scope="row">
                        <Link href={`/demo/automations?automation=${automation.id}`} className="app-rowlink">
                          <span className="app-cell-title">{automation.name}</span>
                        </Link>
                        <span className="app-cell-sub">{automation.type === 'campaign' ? 'Campaign' : 'Sequence'}</span>
                      </th>
                      <td data-label="Status">
                        {review ? (
                          <Badge tone="caution">{automation.enabled ? 'Needs review' : stats.sent || stats.enrolled ? 'Paused' : 'Draft · off'}</Badge>
                        ) : (
                          <Badge tone="positive">Running</Badge>
                        )}
                      </td>
                      <td className="ui-num" data-label="Enrolled">
                        {fmtNumber(stats.enrolled)}
                      </td>
                      <td className="ui-num" data-label={reminder ? 'Confirmed' : 'Replies'}>
                        {stats.enrolled ? (
                          <>
                            {fmtNumber(stats.replied)}
                            <span className="app-cell-sub">{fmtPercent(stats.replyRate)}{reminder ? ' confirmed' : ''}</span>
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="ui-num" data-label="Booked">
                        {reminder ? '—' : fmtNumber(stats.booked)}
                      </td>
                      <td className="ui-num" data-label="Recovered">
                        {stats.recovered ? <span className="app-num-red">{fmtNumber(stats.recovered)}</span> : '—'}
                      </td>
                      <td data-label="Next send">
                        {!automation.enabled ? (
                          <span className="app-muted">Off</span>
                        ) : stats.nextSend ? (
                          <>
                            <span className="app-cell-title app-cell-title--plain">{fmtUntil(stats.nextSend)}</span>
                            <span className="app-cell-sub">{stats.queued} queued · 24h</span>
                          </>
                        ) : (
                          <span className="app-muted">When triggered</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  )
}

const activityIcon: Record<ActivityKind, LucideIcon> = {
  inquiry: Inbox,
  'missed-call': PhoneMissed,
  reply: MessageSquare,
  recovered: RotateCcw,
  booked: CalendarCheck,
}

function activityLine(kind: ActivityKind, lead: string) {
  switch (kind) {
    case 'inquiry':
      return (
        <>
          New inquiry from <strong>{lead}</strong>
        </>
      )
    case 'missed-call':
      return (
        <>
          Missed call from <strong>{lead}</strong>, texted back
        </>
      )
    case 'reply':
      return (
        <>
          <strong>{lead}</strong> replied
        </>
      )
    case 'recovered':
      return (
        <>
          <strong>{lead}</strong> came back
        </>
      )
    case 'booked':
      return (
        <>
          <strong>{lead}</strong> booked
        </>
      )
  }
}

function TaskList({
  tasks,
  onToggle,
  onOpen,
}: {
  tasks: Array<ReturnType<typeof useTasks>[number]>
  onToggle: (taskId: string) => void
  onOpen: (leadId: string) => void
}) {
  return (
    <ul className="ui-list app-tasks" id="tasks">
      {tasks.map((task) => {
        const overdue = !task.done && task.due < DEMO_NOW
        return (
          <li key={task.id} className={cx('ui-row app-task', task.done && 'is-done')}>
            <input type="checkbox" id={`task-${task.id}`} className="app-check" checked={task.done} onChange={() => onToggle(task.id)} />
            <label htmlFor={`task-${task.id}`} className="app-task__text">
              <span className="app-task__title">{task.title}</span>
              <span className="app-task__detail">
                {task.priority === 'high' && !task.done && <span className="app-task__flag">High priority · </span>}
                <span className={cx('app-task__due', overdue && 'is-overdue')}>
                  {task.done ? 'Done' : overdue ? `Overdue · ${fmtTime(task.due)}` : fmtDayTime(task.due)}
                </span>
                {' · '}
                {task.detail}
              </span>
            </label>
            <button type="button" className="app-tool app-task__go" onClick={() => onOpen(task.leadId)} aria-label={`Open the conversation for: ${task.title}`}>
              <ArrowUpRight aria-hidden="true" size={16} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
