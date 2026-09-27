'use client'

import { Pencil } from 'lucide-react'
import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { automationReviews } from '@/content/demo/attention'
import { fmtNumber, fmtPercent, fmtTime, fmtUntil } from '@/content/demo/format'
import { automationStats, windowFor, type AutomationStats } from '@/content/demo/metrics'
import { DAY, DEMO_NOW } from '@/content/demo/time'
import type { Automation } from '@/content/demo/types'
import { AutomationBuilder } from '../AutomationBuilder'
import { QueryParams, useReplaceQuery } from '../query'
import { useToast, usePending } from '../Toasts'
import { Badge, Metric, PageHeader, Panel, Segmented, Switch, cx } from '../ui'
import { useAppointments, useAutomations, useClientDemo, useLeads } from './state'

const isAppointmentFlow = (automation: Automation) => automation.templateId === 'tpl-reminder' || automation.templateId === 'tpl-no-show'

type Show = 'all' | 'campaign' | 'sequence' | 'review'

export function AutomationsView() {
  const automations = useAutomations()
  const leads = useLeads()
  const appointments = useAppointments()
  const { dispatch } = useClientDemo()
  const notify = useToast()
  const replaceQuery = useReplaceQuery()
  const { run, busy } = usePending()
  const [selectedId, setSelectedId] = useState(automations[0]?.id ?? '')
  const [show, setShow] = useState<Show>('all')

  const reviews = useMemo(() => new Map(automationReviews(automations, leads).map((review) => [review.automation.id, review.reason])), [automations, leads])

  // Linkable: ?show=review lists what needs a look and opens the first; ?automation=<id> opens one.
  const onQuery = useCallback(
    (params: URLSearchParams) => {
      const requested = params.get('show')
      const id = params.get('automation')
      setShow(requested === 'review' || requested === 'campaign' || requested === 'sequence' ? requested : 'all')
      const first = requested === 'review' ? automationReviews(automations, leads)[0]?.automation.id : undefined
      const target = id && automations.some((automation) => automation.id === id) ? id : first
      if (target) {
        setSelectedId(target)
        requestAnimationFrame(() => document.getElementById(`automation-${target}`)?.scrollIntoView({ block: 'center' }))
      }
    },
    [automations, leads],
  )

  const period = useMemo(() => windowFor(30), [])
  const rows = useMemo(
    () => automations.map((automation) => ({ automation, stats: automationStats(automation, leads, appointments, period) })),
    [automations, leads, appointments, period],
  )

  const leadRows = rows.filter(({ automation }) => !isAppointmentFlow(automation))
  const enrolled = leadRows.reduce((sum, row) => sum + row.stats.enrolled, 0)
  const replied = leadRows.reduce((sum, row) => sum + row.stats.replied, 0)
  const booked = leadRows.reduce((sum, row) => sum + row.stats.booked, 0)
  const campaigns = automations.filter((automation) => automation.type === 'campaign')
  const sequences = automations.filter((automation) => automation.type === 'sequence')
  const nextSends = rows.map((row) => row.stats.nextSend).filter((at): at is number => at !== undefined)
  const nextSend = nextSends.length ? Math.min(...nextSends) : undefined
  const queued = rows.reduce((sum, row) => sum + row.stats.queued, 0)

  const selected = automations.find((automation) => automation.id === selectedId) ?? automations[0]
  const selectedStats = rows.find((row) => row.automation.id === selected.id)?.stats

  const toggle = (automation: Automation, enabled: boolean) => {
    dispatch({ type: 'setAutomationEnabled', id: automation.id, enabled })
    notify({
      title: `${automation.name} ${enabled ? 'turned on' : 'paused'}`,
      detail: enabled ? 'New leads that match will start the sequence.' : 'Scheduled messages are held until you turn it back on.',
      tone: enabled ? 'success' : 'info',
    })
  }

  const visible = rows.filter(
    ({ automation }) => show === 'all' || (show === 'review' ? reviews.has(automation.id) : automation.type === show),
  )
  const groups = (['campaign', 'sequence'] as const)
    .map((type) => ({ type, rows: visible.filter((row) => row.automation.type === type) }))
    .filter((group) => group.rows.length > 0)

  // The next sends across enabled automations, from the sample schedule.
  const upcoming = useMemo(() => {
    const enabled = new Set(automations.filter((automation) => automation.enabled).map((automation) => automation.id))
    const names = new Map(automations.map((automation) => [automation.id, automation.name]))
    return leads
      .filter((lead) => lead.nextAt !== undefined && lead.nextAt > DEMO_NOW && lead.nextAt < DEMO_NOW + DAY && enabled.has(lead.automationId) && (lead.stage === 'new' || lead.stage === 'reengage'))
      .sort((a, b) => (a.nextAt ?? 0) - (b.nextAt ?? 0))
      .slice(0, 7)
      .map((lead) => ({ lead, automation: names.get(lead.automationId) ?? '' }))
  }, [automations, leads])

  const select = (automation: Automation) => {
    setSelectedId(automation.id)
    document.getElementById('automation-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <QueryParams onChange={onQuery} />
      <PageHeader title="Automations" description="Campaigns and follow-up sequences running for Juniper Row Realty · performance over the last 30 days" />

      <div className="app-page">
        <div className="app-grid app-grid--metrics app-grid--metrics-5">
          <Metric
            index={0}
            label="Active campaigns"
            value={`${campaigns.filter((automation) => automation.enabled).length} of ${campaigns.length}`}
            note={`${fmtNumber(rows.filter((row) => row.automation.type === 'campaign').reduce((sum, row) => sum + row.stats.recovered, 0))} older leads recovered`}
          />
          <Metric
            index={1}
            label="Active sequences"
            value={`${sequences.filter((automation) => automation.enabled).length} of ${sequences.length}`}
            note={reviews.size ? `${reviews.size} ${reviews.size === 1 ? 'needs' : 'need'} review` : 'All running'}
          />
          <Metric index={2} label="Replies" value={fmtNumber(replied)} note={`${fmtPercent(enrolled ? replied / enrolled : 0)} of ${fmtNumber(enrolled)} enrolled leads`} />
          <Metric index={3} label="Booked appointments" value={fmtNumber(booked)} note={`${fmtPercent(enrolled ? booked / enrolled : 0)} of enrolled leads`} emphasis />
          <Metric
            index={4}
            label="Next scheduled message"
            value={nextSend ? fmtTime(nextSend) : '—'}
            note={nextSend ? `${fmtUntil(nextSend)} · ${queued} queued in 24h` : 'Nothing scheduled'}
          />
        </div>

        <Panel
          index={1}
          title="Campaigns and sequences"
          meta="Switch any automation on or off; choose one to edit its steps."
          flush
          actions={
            <Segmented
              label="Show automations"
              size="sm"
              value={show}
              onChange={(next) => {
                setShow(next)
                replaceQuery({ show: next === 'all' ? null : next })
              }}
              options={[
                { value: 'all', label: 'All', count: automations.length },
                { value: 'campaign', label: 'Campaigns', count: campaigns.length },
                { value: 'sequence', label: 'Sequences', count: sequences.length },
                { value: 'review', label: 'Needs review', count: reviews.size },
              ]}
            />
          }
        >
          {groups.length === 0 ? (
            <p className="app-panel-note">Nothing needs review — every automation is switched on and sending.</p>
          ) : (
            <div className="app-table-wrap">
              <table className="ui-table app-table app-table--stack app-autotable">
                <caption className="app-sr">Automations and their performance over the last 30 days</caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="app-sr">On or off</span>
                    </th>
                    <th scope="col">Automation</th>
                    <th scope="col" className="ui-num">
                      Enrolled
                    </th>
                    <th scope="col" className="ui-num">
                      Replies
                    </th>
                    <th scope="col" className="ui-num">
                      Booked
                    </th>
                    <th scope="col">Next send</th>
                    <th scope="col">
                      <span className="app-sr">Edit</span>
                    </th>
                  </tr>
                </thead>
                {groups.map((group) => (
                  <tbody key={group.type}>
                    <tr className="app-autotable__group">
                      <th scope="colgroup" colSpan={7}>
                        {group.type === 'campaign' ? 'Campaigns' : 'Sequences'}
                        <span className="app-autotable__groupnote">
                          {group.type === 'campaign' ? 'One-off pushes to a chosen audience' : 'Run for every lead that matches'}
                        </span>
                      </th>
                    </tr>
                    {group.rows.map(({ automation, stats }) => (
                      <AutomationRow
                        key={automation.id}
                        automation={automation}
                        stats={stats}
                        review={reviews.get(automation.id)}
                        selected={automation.id === selected.id}
                        onToggle={(next) => toggle(automation, next)}
                        onEdit={() => select(automation)}
                      />
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          )}
        </Panel>

        <div className="app-grid app-grid--aside">
          <section id="automation-builder" className="ui-panel app-panel app-rise app-builder-panel" aria-label="Automation builder" style={{ '--i': 2 } as CSSProperties}>
            {reviews.get(selected.id) && <p className="app-builder__review">{reviews.get(selected.id)}</p>}
            <AutomationBuilder
              key={selected.id}
              title={selected.name}
              subtitle={`${selected.audience}${selectedStats ? ` · ${fmtNumber(selectedStats.sent)} messages sent in 30 days` : ''}`}
              steps={selected.steps}
              enabled={selected.enabled}
              onToggle={(next) => toggle(selected, next)}
              saving={busy('save')}
              testing={busy('test')}
              onTest={() =>
                run('test', () =>
                  notify({ title: 'Test message queued', detail: `The first message of ${selected.name} went to Dana’s sample inbox only.` }),
                )
              }
              onSave={(steps) =>
                run('save', () => {
                  dispatch({ type: 'saveSteps', id: selected.id, steps })
                  notify({ title: `${selected.name} saved`, detail: `${steps.length} steps. New enrollments use the updated sequence.` })
                })
              }
            />
          </section>

          <Panel index={3} title="Next scheduled messages" meta="Next 24 hours" flush>
            {upcoming.length === 0 ? (
              <p className="app-panel-note">Nothing scheduled in the next 24 hours.</p>
            ) : (
              <ul className="ui-list">
                {upcoming.map(({ lead, automation }) => (
                  <li key={lead.id} className="ui-row app-sendrow">
                    <span className="app-sendrow__time">{fmtUntil(lead.nextAt ?? DEMO_NOW)}</span>
                    <span className="app-sendrow__text">
                      <span className="app-cell-title">{lead.name}</span>
                      <span className="app-cell-sub">
                        {lead.nextAction} · {automation}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}

function AutomationRow({
  automation,
  stats,
  review,
  selected,
  onToggle,
  onEdit,
}: {
  automation: Automation
  stats: AutomationStats
  review?: string
  selected: boolean
  onToggle: (next: boolean) => void
  onEdit: () => void
}) {
  const appointmentFlow = isAppointmentFlow(automation)
  const reminder = automation.templateId === 'tpl-reminder'
  const noShow = automation.templateId === 'tpl-no-show'
  return (
    <tr id={`automation-${automation.id}`} className={cx(selected && 'is-selected', review && 'is-review')}>
      <td data-label="Status" className="app-autotable__switch">
        <Switch checked={automation.enabled} onChange={onToggle} label={`${automation.name}: ${automation.enabled ? 'on' : 'off'}`} />
      </td>
      <th scope="row" className="app-wrap">
        <span className="app-cell-title">
          {automation.name}
          {review && (
            <Badge tone="caution" className="app-typebadge">
              Needs review
            </Badge>
          )}
        </span>
        <span className="app-cell-sub">{automation.audience}</span>
        {automation.type === 'campaign' && automation.audienceSize ? (
          <span className="app-cell-sub">
            {fmtNumber(stats.enrolled)} of {fmtNumber(automation.audienceSize)} in the audience contacted in 30 days
          </span>
        ) : null}
      </th>
      <td className="ui-num" data-label={appointmentFlow ? 'Appointments' : 'Enrolled'}>
        {fmtNumber(stats.enrolled)}
      </td>
      <td className="ui-num" data-label={reminder ? 'Confirmed' : noShow ? 'Rebooked' : 'Replies'}>
        {stats.enrolled ? (
          <>
            {fmtNumber(stats.replied)}
            <span className="app-cell-sub">
              {fmtPercent(stats.replyRate)}
              {reminder ? ' confirmed' : noShow ? ' rebooked' : ''}
            </span>
          </>
        ) : (
          '—'
        )}
      </td>
      <td className="ui-num" data-label="Booked">
        {reminder || !stats.enrolled ? (
          '—'
        ) : (
          <>
            {fmtNumber(stats.booked)}
            <span className="app-cell-sub">{fmtPercent(stats.bookRate)}</span>
          </>
        )}
      </td>
      <td data-label="Next send">
        {!automation.enabled ? (
          <span className="app-muted">{review ? 'Off' : 'Paused'}</span>
        ) : stats.nextSend ? (
          <>
            <span className="app-cell-title app-cell-title--plain">{fmtUntil(stats.nextSend)}</span>
            <span className="app-cell-sub">{stats.queued} in the next 24h</span>
          </>
        ) : (
          <span className="app-muted">When triggered</span>
        )}
      </td>
      <td className="app-autotable__edit">
        <button type="button" className={cx('ui-btn ui-btn--quiet', selected && 'is-current')} aria-pressed={selected} onClick={onEdit}>
          <Pencil aria-hidden="true" size={15} />
          {selected ? 'Editing' : 'Edit steps'}
          <span className="app-sr"> for {automation.name}</span>
        </button>
      </td>
    </tr>
  )
}
