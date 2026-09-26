'use client'

import { Pencil } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { fmtNumber, fmtPercent, fmtTime, fmtUntil } from '@/content/demo/format'
import { automationStats, windowFor } from '@/content/demo/metrics'
import { DAY, DEMO_NOW } from '@/content/demo/time'
import type { Automation } from '@/content/demo/types'
import { AutomationBuilder } from '../AutomationBuilder'
import { useToast, usePending } from '../Toasts'
import { Badge, Metric, PageHeader, Panel, Switch, cx } from '../ui'
import { useAppointments, useAutomations, useClientDemo, useLeads } from './state'

const isAppointmentFlow = (automation: Automation) => automation.templateId === 'tpl-reminder' || automation.templateId === 'tpl-no-show'

export function AutomationsView() {
  const automations = useAutomations()
  const leads = useLeads()
  const appointments = useAppointments()
  const { dispatch } = useClientDemo()
  const notify = useToast()
  const { run, busy } = usePending()
  const [selectedId, setSelectedId] = useState(automations[0]?.id ?? '')

  const period = useMemo(() => windowFor(30), [])
  const rows = useMemo(
    () => automations.map((automation) => ({ automation, stats: automationStats(automation, leads, appointments, period) })),
    [automations, leads, appointments, period],
  )

  const leadRows = rows.filter(({ automation }) => !isAppointmentFlow(automation))
  const enrolled = leadRows.reduce((sum, row) => sum + row.stats.enrolled, 0)
  const replied = leadRows.reduce((sum, row) => sum + row.stats.replied, 0)
  const booked = leadRows.reduce((sum, row) => sum + row.stats.booked, 0)
  const sent = rows.reduce((sum, row) => sum + row.stats.sent, 0)
  const active = automations.filter((automation) => automation.enabled).length
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

  return (
    <>
      <PageHeader title="Automations" description="Campaigns and follow-up sequences running for Juniper Row Realty · performance over the last 30 days" />

      <div className="app-page">
        <div className="app-grid app-grid--metrics app-grid--metrics-5">
          <Metric index={0} label="Running" value={`${active} of ${automations.length}`} note="automations switched on" />
          <Metric index={1} label="Messages sent" value={fmtNumber(sent)} note="by automations, 30 days" />
          <Metric index={2} label="Reply rate" value={fmtPercent(enrolled ? replied / enrolled : 0)} note={`${fmtNumber(replied)} of ${fmtNumber(enrolled)} enrolled leads`} />
          <Metric index={3} label="Appointment rate" value={fmtPercent(enrolled ? booked / enrolled : 0)} note={`${fmtNumber(booked)} booked from sequences`} />
          <Metric
            index={4}
            label="Next scheduled send"
            value={nextSend ? fmtTime(nextSend) : '—'}
            note={nextSend ? `${fmtUntil(nextSend)} · ${queued} queued in 24h` : 'Nothing scheduled'}
          />
        </div>

        <Panel index={1} title="Campaigns and sequences" meta="Switch any automation on or off; choose one to edit its steps." flush>
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
                    Reply rate
                  </th>
                  <th scope="col" className="ui-num">
                    Appt. rate
                  </th>
                  <th scope="col">Next send</th>
                  <th scope="col">
                    <span className="app-sr">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ automation, stats }) => {
                  const appointmentFlow = isAppointmentFlow(automation)
                  return (
                    <tr key={automation.id} className={cx(automation.id === selected.id && 'is-selected')}>
                      <td data-label="Status" className="app-autotable__switch">
                        <Switch checked={automation.enabled} onChange={(next) => toggle(automation, next)} label={`${automation.name}: ${automation.enabled ? 'on' : 'off'}`} />
                      </td>
                      <th scope="row" className="app-wrap">
                        <span className="app-cell-title">
                          {automation.name}{' '}
                          <Badge tone="plain" className="app-typebadge">
                            {automation.type === 'campaign' ? 'Campaign' : 'Sequence'}
                          </Badge>
                        </span>
                        <span className="app-cell-sub">{automation.audience}</span>
                      </th>
                      <td className="ui-num" data-label={appointmentFlow ? 'Appointments' : 'Enrolled'}>
                        {fmtNumber(stats.enrolled)}
                        {automation.type === 'campaign' && automation.audienceSize ? <span className="app-cell-sub">of {fmtNumber(automation.audienceSize)} audience</span> : null}
                      </td>
                      <td className="ui-num" data-label={automation.templateId === 'tpl-reminder' ? 'Confirmed' : automation.templateId === 'tpl-no-show' ? 'Rebooked' : 'Reply rate'}>
                        {stats.enrolled ? fmtPercent(stats.replyRate) : '—'}
                        {automation.templateId === 'tpl-reminder' && stats.enrolled ? <span className="app-cell-sub">confirmed</span> : null}
                        {automation.templateId === 'tpl-no-show' && stats.enrolled ? <span className="app-cell-sub">rebooked</span> : null}
                      </td>
                      <td className="ui-num" data-label="Appt. rate">
                        {appointmentFlow || !stats.enrolled ? '—' : fmtPercent(stats.bookRate)}
                      </td>
                      <td data-label="Next send">
                        {!automation.enabled ? (
                          <span className="app-muted">Paused</span>
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
                        <button
                          type="button"
                          className={cx('ui-btn ui-btn--quiet', automation.id === selected.id && 'is-current')}
                          aria-pressed={automation.id === selected.id}
                          onClick={() => {
                            setSelectedId(automation.id)
                            document.getElementById('automation-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }}
                        >
                          <Pencil aria-hidden="true" size={15} />
                          {automation.id === selected.id ? 'Editing' : 'Edit steps'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="app-grid app-grid--aside">
          <section id="automation-builder" className="ui-panel app-panel app-rise app-builder-panel" aria-label="Automation builder" style={{ '--i': 2 } as CSSProperties}>
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

          <Panel index={3} title="Next scheduled sends" meta="Next 24 hours" flush>
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
