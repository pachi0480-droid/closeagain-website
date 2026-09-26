'use client'

import { ArrowRight, Inbox } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { fmtCurrencyCompact, fmtDate, fmtDayTime, fmtNumber, fmtPercent, fmtStamp, fmtTime, fmtWeekdayDate } from '@/content/demo/format'
import { automationStats, dailySeries, summarize, windowFor } from '@/content/demo/metrics'
import { DAY, DEMO_NOW } from '@/content/demo/time'
import { TimeChart, Sparkline } from '../charts'
import { snippet } from '../conversation'
import { priorLabel, rangeLabel, rangeOptions, useRange, type RangeDays } from '../hooks'
import { QuickFind } from '../QuickFind'
import { Avatar, Badge, EmptyState, Metric, PageHeader, Panel, Segmented, StageBadge, cx, deltaOf, pointsDelta } from '../ui'
import { useAppointments, useAutomations, useClientDemo, useLeads, useTasks } from './state'

export function OverviewView() {
  const router = useRouter()
  const { dispatch } = useClientDemo()
  const leads = useLeads()
  const appointments = useAppointments()
  const automations = useAutomations()
  const tasks = useTasks()
  const { range, loading, change } = useRange(30)

  const current = useMemo(() => summarize(leads, appointments, windowFor(range)), [leads, appointments, range])
  const previous = useMemo(() => (range === 90 ? null : summarize(leads, appointments, windowFor(range, 1))), [leads, appointments, range])
  const series = useMemo(() => dailySeries(leads, appointments, range), [leads, appointments, range])

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

  const period = windowFor(range)
  const campaignRows = automations.map((automation) => ({ automation, stats: automationStats(automation, leads, appointments, period) }))

  return (
    <>
      <PageHeader title="Overview" description={`Juniper Row Realty · ${fmtWeekdayDate(DEMO_NOW)}, ${fmtTime(DEMO_NOW)} ET`}>
        <QuickFind
          label="Find a lead or conversation"
          placeholder="Find a lead…"
          items={leads.map((lead) => ({ id: lead.id, title: lead.name, sub: lead.interest, meta: fmtStamp(lead.lastContactAt), keywords: lead.tags.join(' ') }))}
          onPick={(item) => openConversation(item.id)}
        />
        <Segmented
          label="Date range"
          options={rangeOptions}
          value={`${range}` as `${RangeDays}`}
          onChange={(value) => change(Number(value) as RangeDays)}
        />
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
          <Metric
            index={1}
            label="Active conversations"
            value={fmtNumber(active)}
            note={`${unread} waiting on a reply`}
            loading={loading}
          />
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

        <div className="app-grid app-grid--main">
          <Panel
            index={1}
            title="Lead activity"
            meta={`New and recovered leads per day, ${rangeLabel(range)}`}
            className={cx(loading && 'is-refreshing')}
          >
            <TimeChart
              summary={`Lead activity, ${rangeLabel(range)}: ${current.newLeads} new leads and ${current.recovered} recovered leads.`}
              labels={series.map((point) => fmtDate(point.start))}
              longLabels={series.map((point) => fmtWeekdayDate(point.start))}
              height={330}
              series={[
                { id: 'new', label: 'New leads', values: series.map((point) => point.newLeads), tone: 'ink', area: true },
                { id: 'recovered', label: 'Recovered', values: series.map((point) => point.recovered), tone: 'accent', area: true },
              ]}
            />
          </Panel>

          <Panel
            index={2}
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

        <div className="app-grid app-grid--split">
          <Panel
            index={3}
            title="Follow-up tasks"
            meta={`${doneCount} of ${tasks.length} done today`}
            flush
            actions={
              <span className="ui-track app-task-progress" aria-hidden="true">
                <span style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
              </span>
            }
          >
            <TaskList tasks={orderedTasks} onToggle={(taskId) => dispatch({ type: 'toggleTask', taskId })} onOpen={openConversation} />
          </Panel>

          <Panel
            index={4}
            title="Campaign performance"
            meta={rangeLabel(range)}
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
              <table className="ui-table app-table app-table--stack">
                <caption className="app-sr">Campaign performance, {rangeLabel(range)}</caption>
                <thead>
                  <tr>
                    <th scope="col">Automation</th>
                    <th scope="col" className="ui-num">
                      Enrolled
                    </th>
                    <th scope="col" className="ui-num">
                      Replied
                    </th>
                    <th scope="col" className="ui-num">
                      Booked
                    </th>
                    <th scope="col" className="ui-num">
                      Recovered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaignRows.map(({ automation, stats }) => {
                    const reminder = automation.templateId === 'tpl-reminder'
                    return (
                      <tr key={automation.id}>
                        <th scope="row">
                          <span className="app-cell-title">{automation.name}</span>
                          <span className="app-cell-sub">
                            <span className={cx('app-status-dot', automation.enabled ? 'is-on' : 'is-off')} aria-hidden="true" />
                            {automation.type === 'campaign' ? 'Campaign' : 'Sequence'} · {automation.enabled ? 'Active' : 'Paused'}
                          </span>
                        </th>
                        <td className="ui-num" data-label="Enrolled">
                          {fmtNumber(stats.enrolled)}
                        </td>
                        <td className="ui-num" data-label={reminder ? 'Confirmed' : 'Replied'}>
                          {stats.enrolled ? fmtPercent(stats.replyRate) : '—'}
                          {reminder && stats.enrolled ? <span className="app-cell-sub">confirmed</span> : null}
                        </td>
                        <td className="ui-num" data-label="Booked">
                          {reminder ? '—' : fmtNumber(stats.booked)}
                        </td>
                        <td className="ui-num" data-label="Recovered">
                          {stats.recovered ? <span className="app-num-red">{fmtNumber(stats.recovered)}</span> : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

/** A trailing average, so a stat tile's sparkline shows the trend rather than daily noise. */
function rolling(values: number[], size = 7): number[] {
  return values.map((_, index) => {
    const from = Math.max(0, index - size + 1)
    const slice = values.slice(from, index + 1)
    return slice.reduce((sum, value) => sum + value, 0) / slice.length
  })
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
    <ul className="ui-list app-tasks">
      {tasks.map((task) => {
        const overdue = !task.done && task.due < DEMO_NOW
        return (
          <li key={task.id} className={cx('ui-row app-task', task.done && 'is-done')}>
            <input
              type="checkbox"
              id={`task-${task.id}`}
              className="app-check"
              checked={task.done}
              onChange={() => onToggle(task.id)}
            />
            <label htmlFor={`task-${task.id}`} className="app-task__text">
              <span className="app-task__title">{task.title}</span>
              <span className="app-task__detail">
                <span className={cx('app-task__due', overdue && 'is-overdue')}>
                  {task.done ? 'Done' : overdue ? `Overdue · ${fmtTime(task.due)}` : fmtDayTime(task.due)}
                </span>
                {' · '}
                {task.detail}
              </span>
            </label>
            <span className="app-task__side">
              {task.priority === 'high' && !task.done && <Badge tone="red">High</Badge>}
              <button type="button" className="app-task__open" onClick={() => onOpen(task.leadId)}>
                Open
                <span className="app-sr"> conversation for {task.title}</span>
              </button>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
