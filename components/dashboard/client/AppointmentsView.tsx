'use client'

import { ArrowRight, BellRing, MapPin, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { todaysAppointments } from '@/content/demo/attention'
import { fmtAgo, fmtDayTime, fmtDuration, fmtNumber, fmtPercent, fmtTime, fmtUntil, fmtWeekdayDate } from '@/content/demo/format'
import { windowFor, within } from '@/content/demo/metrics'
import { DAY, DEMO_NOW, MINUTE, TODAY, dayIndex } from '@/content/demo/time'
import type { Appointment, AppointmentStatus } from '@/content/demo/types'
import { workspaceAppointments } from '@/content/demo/workspace'
import { CalendarToolbar, MonthGrid, WeekGrid, type CalendarMode } from '../Calendar'
import { appointmentStatusLabel } from '../labels'
import { QueryParams } from '../query'
import { useToast, usePending } from '../Toasts'
import { Badge, EmptyState, Metric, PageHeader, Panel, Switch, cx, type BadgeTone } from '../ui'
import { useAppointments, useAutomations, useClientDemo, useLeads } from './state'

export const statusTone: Record<AppointmentStatus, BadgeTone> = {
  scheduled: 'default',
  confirmed: 'ink',
  completed: 'positive',
  'no-show': 'red',
  cancelled: 'cold',
}

export function AppointmentsView() {
  const appointments = useAppointments()
  const leads = useLeads()
  const automations = useAutomations()
  const { state, dispatch } = useClientDemo()
  const notify = useToast()
  const { run, busy } = usePending()
  const [mode, setMode] = useState<CalendarMode>('month')
  const [cursor, setCursor] = useState(TODAY)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focus, setFocus] = useState<'today' | 'no-shows' | null>(null)
  const todayRef = useRef<HTMLDivElement>(null)
  const noShowRef = useRef<HTMLDivElement>(null)

  // Linkable views: ?day=today opens this week on today; ?show=no-shows jumps to the misses.
  const onQuery = useCallback((params: URLSearchParams) => {
    if (params.get('day') === 'today') {
      setMode('week')
      setCursor(TODAY)
      setSelectedId(todaysAppointments(workspaceAppointments).find((item) => item.start > DEMO_NOW)?.id ?? todaysAppointments(workspaceAppointments)[0]?.id ?? null)
      setFocus('today')
    } else if (params.get('show') === 'no-shows') {
      setFocus('no-shows')
    } else {
      setFocus(null)
    }
  }, [])

  useEffect(() => {
    const target = focus === 'today' ? todayRef.current : focus === 'no-shows' ? noShowRef.current : null
    target?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [focus])

  const leadById = useMemo(() => new Map(leads.map((lead) => [lead.id, lead])), [leads])
  const reminderAutomation = automations.find((automation) => automation.templateId === 'tpl-reminder')
  const noShowAutomation = automations.find((automation) => automation.templateId === 'tpl-no-show')
  const remindersOn = reminderAutomation?.enabled ?? false

  const month = windowFor(30)
  const upcoming = appointments
    .filter((appointment) => appointment.start > DEMO_NOW && (appointment.status === 'scheduled' || appointment.status === 'confirmed'))
    .sort((a, b) => a.start - b.start)
  const nextWeek = upcoming.filter((appointment) => appointment.start < DEMO_NOW + 7 * DAY)
  const booked30 = appointments.filter((appointment) => within(appointment.bookedAt, month)).length
  const held = appointments.filter((appointment) => within(appointment.start, month) && (appointment.status === 'completed' || appointment.status === 'no-show'))
  const shows = held.filter((appointment) => appointment.status === 'completed').length
  const noShows = appointments
    .filter((appointment) => appointment.status === 'no-show' && within(appointment.start, month))
    .sort((a, b) => b.start - a.start)

  const selected = appointments.find((appointment) => appointment.id === selectedId) ?? null
  const today = todaysAppointments(appointments)

  const followUpSent = (appointment: Appointment) => {
    if (state.followUps[appointment.id]) return true
    const lead = leadById.get(appointment.leadId)
    return Boolean(lead?.thread.some((message) => message.via === noShowAutomation?.id && message.at > appointment.start))
  }
  const rebooked = (appointment: Appointment) =>
    appointments.find((other) => other.leadId === appointment.leadId && other.bookedAt > appointment.start && other.id !== appointment.id)

  const select = (id: string) => {
    setSelectedId(id)
    const appointment = appointments.find((item) => item.id === id)
    if (appointment && mode === 'week') setCursor(dayIndex(appointment.start))
  }

  const setStatus = (appointment: Appointment, status: AppointmentStatus) => {
    dispatch({ type: 'setAppointmentStatus', id: appointment.id, status })
    notify({ title: `${appointment.leadName}: ${appointmentStatusLabel[status].toLowerCase()}`, detail: `${appointment.type} · ${fmtDayTime(appointment.start)}` })
  }

  const sendFollowUp = (appointment: Appointment) =>
    run(`follow-${appointment.id}`, () => {
      dispatch({ type: 'sendFollowUp', appointmentId: appointment.id })
      notify({ title: `Follow-up queued for ${appointment.leadName}`, detail: 'A “sorry we missed you” text offering new times.' })
    })

  const reminderRows = upcoming.slice(0, 8).map((appointment) => {
    const lead = leadById.get(appointment.leadId)
    const at = appointment.start - DAY
    const sent = at <= DEMO_NOW && Boolean(lead?.thread.some((message) => message.via === reminderAutomation?.id && message.at >= at - 60 * MINUTE))
    return { appointment, at, sent, on: state.reminders[appointment.id] ?? true }
  })

  return (
    <>
      <QueryParams onChange={onQuery} />
      <PageHeader title="Appointments" description="Showings and consultations booked through follow-up · all times Eastern">
        <Link href="/demo/automations" className="ui-btn ui-btn--quiet">
          <BellRing aria-hidden="true" />
          Reminder settings
        </Link>
      </PageHeader>

      <div className="app-page">
        <div className="app-grid app-grid--metrics app-grid--metrics-4">
          <Metric index={0} label="Upcoming · 7 days" value={fmtNumber(nextWeek.length)} note={nextWeek[0] ? `Next: ${nextWeek[0].leadName}, ${fmtUntil(nextWeek[0].start)}` : 'Nothing booked'} />
          <Metric index={1} label="Booked · 30 days" value={fmtNumber(booked30)} note="From follow-up conversations" />
          <Metric index={2} label="Show rate · 30 days" value={held.length ? fmtPercent(shows / held.length) : '—'} note={`${shows} of ${held.length} held appointments`} />
          <Metric index={3} label="No-shows · 30 days" value={fmtNumber(noShows.length)} note={`${noShows.filter((item) => rebooked(item)).length} rebooked since`} />
        </div>

        <div className="app-grid app-grid--aside">
          <Panel index={1} className="app-calpanel">
            <CalendarToolbar mode={mode} cursor={cursor} onMode={setMode} onCursor={setCursor} />
            {mode === 'month' ? (
              <MonthGrid
                cursor={cursor}
                appointments={appointments}
                selectedId={selectedId}
                onSelect={select}
                onDay={(day) => {
                  setCursor(day)
                  setMode('week')
                }}
              />
            ) : (
              <WeekGrid cursor={cursor} appointments={appointments} selectedId={selectedId} onSelect={select} />
            )}
            <ul className="app-calkey" aria-label="Status key">
              {(['confirmed', 'scheduled', 'completed', 'no-show', 'cancelled'] as const).map((status) => (
                <li key={status}>
                  <span className={`app-calkey__swatch app-event--${status}`} aria-hidden="true" />
                  {appointmentStatusLabel[status]}
                </li>
              ))}
            </ul>
          </Panel>

          <div className="app-stack-col">
            <div ref={todayRef} className={cx('app-focus', focus === 'today' && 'is-focused')}>
              <Panel index={2} title="Today" meta={`${fmtWeekdayDate(DEMO_NOW)} · ${today.length === 1 ? '1 appointment' : `${today.length} appointments`}`} flush>
                {today.length === 0 ? (
                  <p className="app-panel-note">No appointments today.</p>
                ) : (
                  <ul className="ui-list">
                    {today.map((appointment) => (
                      <li key={appointment.id}>
                        <button
                          type="button"
                          className="ui-row ui-row--interactive app-apptrow app-apptrow--today"
                          onClick={() => select(appointment.id)}
                          aria-pressed={appointment.id === selectedId}
                        >
                          <span className="app-apptrow__time">{fmtTime(appointment.start)}</span>
                          <span className="app-apptrow__text">
                            <span className="app-apptrow__top">
                              <span className="app-cell-title">{appointment.leadName}</span>
                              <Badge tone={statusTone[appointment.status]}>{appointmentStatusLabel[appointment.status]}</Badge>
                            </span>
                            <span className="app-cell-sub">
                              {appointment.type} · {appointment.location} · {appointment.host.split(' ')[0]}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>
            <Panel index={3} title={selected ? selected.type : 'Appointment details'} meta={selected ? fmtDayTime(selected.start) : 'Choose an appointment on the calendar'}>
              {selected ? (
                <div className="app-apptdetail">
                  <div className="app-apptdetail__status">
                    <Badge tone={statusTone[selected.status]}>{appointmentStatusLabel[selected.status]}</Badge>
                    <span className="ui-meta">Booked {fmtAgo(selected.bookedAt)}</span>
                  </div>
                  <ul className="app-apptdetail__facts">
                    <li>
                      <UserRound aria-hidden="true" size={16} />
                      <span>
                        <span className="app-cell-title">{selected.leadName}</span>
                        <span className="app-cell-sub">{leadById.get(selected.leadId)?.interest}</span>
                      </span>
                    </li>
                    <li>
                      <MapPin aria-hidden="true" size={16} />
                      <span>
                        <span className="app-cell-title app-cell-title--plain">{selected.location}</span>
                        <span className="app-cell-sub">
                          {fmtTime(selected.start)} – {fmtTime(selected.start + selected.durationMin * MINUTE)} · {fmtDuration(selected.durationMin)} · with {selected.host}
                        </span>
                      </span>
                    </li>
                  </ul>
                  <div className="app-apptdetail__actions">
                    {selected.status === 'scheduled' && (
                      <button type="button" className="ui-btn" onClick={() => setStatus(selected, 'confirmed')}>
                        Mark confirmed
                      </button>
                    )}
                    {selected.status === 'completed' && (
                      <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setStatus(selected, 'no-show')}>
                        Mark as no-show
                      </button>
                    )}
                    {selected.status === 'no-show' && (
                      <button type="button" className="ui-btn ui-btn--quiet" onClick={() => setStatus(selected, 'completed')}>
                        Mark as held
                      </button>
                    )}
                    <Link href="/demo/conversations" className="app-textlink" onClick={() => dispatch({ type: 'select', leadId: selected.leadId })}>
                      Open conversation
                      <ArrowRight aria-hidden="true" size={15} />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="app-panel-note app-panel-note--flush">Select an appointment to see who it’s with, where, and what happens next.</p>
              )}
            </Panel>

            <Panel index={4} title="Upcoming" meta="Next 7 days" flush>
              {nextWeek.length === 0 ? (
                <p className="app-panel-note">Nothing booked for the next 7 days.</p>
              ) : (
                <ul className="ui-list">
                  {nextWeek.slice(0, 6).map((appointment) => (
                    <li key={appointment.id}>
                      <button type="button" className="ui-row ui-row--interactive app-apptrow" onClick={() => select(appointment.id)} aria-pressed={appointment.id === selectedId}>
                        <span className="app-apptrow__text">
                          <span className="app-apptrow__top">
                            <span className="app-cell-title">{appointment.leadName}</span>
                            <Badge tone={statusTone[appointment.status]}>{appointmentStatusLabel[appointment.status]}</Badge>
                          </span>
                          <span className="app-cell-sub">
                            {fmtUntil(appointment.start).replace(/^in /, 'In ')} · {appointment.type} · {appointment.host.split(' ')[0]}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>

        <div className="app-grid app-grid--halves">
          <div ref={noShowRef} className={cx('app-focus', focus === 'no-shows' && 'is-focused')}>
          <Panel index={5} title="No-shows" meta={`Last 30 days · ${noShowAutomation?.enabled ? `${noShowAutomation.name} is on` : 'No-show follow-up is paused'}`} flush>
            {noShows.length === 0 ? (
              <EmptyState title="No missed appointments">Every appointment in the last 30 days was held or rescheduled.</EmptyState>
            ) : (
              <ul className="ui-list">
                {noShows.map((appointment) => {
                  const again = rebooked(appointment)
                  const sent = followUpSent(appointment)
                  return (
                    <li key={appointment.id} className="ui-row app-noshow">
                      <span className="app-noshow__text">
                        <button type="button" className="app-rowlink" onClick={() => select(appointment.id)}>
                          <span className="app-cell-title">{appointment.leadName}</span>
                        </button>
                        <span className="app-cell-sub">
                          Missed {appointment.type.toLowerCase()} · {fmtDayTime(appointment.start)}
                        </span>
                      </span>
                      {again ? (
                        <Badge tone="positive">Rebooked {fmtDayTime(again.start).replace(', ', ' · ')}</Badge>
                      ) : sent ? (
                        <Badge tone="plain">Follow-up sent</Badge>
                      ) : (
                        <button
                          type="button"
                          className="ui-btn ui-btn--quiet"
                          disabled={busy(`follow-${appointment.id}`)}
                          aria-busy={busy(`follow-${appointment.id}`)}
                          onClick={() => sendFollowUp(appointment)}
                        >
                          {busy(`follow-${appointment.id}`) ? 'Sending…' : 'Send follow-up'}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
          </div>

          <Panel
            index={6}
            title="Follow-up reminders"
            meta={remindersOn ? 'Sent the day before each appointment' : `${reminderAutomation?.name ?? 'Reminders'} is paused`}
            flush
          >
            {reminderRows.length === 0 ? (
              <p className="app-panel-note">No upcoming appointments need reminders.</p>
            ) : (
              <ul className="ui-list">
                {reminderRows.map(({ appointment, at, sent, on }) => (
                  <li key={appointment.id} className="ui-row app-reminder">
                    <span className="app-reminder__text">
                      <span className="app-cell-title">{appointment.leadName}</span>
                      <span className="app-cell-sub">
                        {sent ? `Reminder sent ${fmtAgo(at)}` : `Reminder ${fmtUntil(at)}`} · {appointment.type} {fmtDayTime(appointment.start)}
                      </span>
                    </span>
                    {sent ? (
                      <Badge tone="plain">Sent</Badge>
                    ) : (
                      <Switch
                        checked={remindersOn && on}
                        disabled={!remindersOn}
                        label={`Reminder for ${appointment.leadName}`}
                        onChange={(next) => {
                          dispatch({ type: 'setReminder', appointmentId: appointment.id, on: next })
                          notify({ title: `Reminder ${next ? 'on' : 'off'} for ${appointment.leadName}`, tone: next ? 'success' : 'info' })
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!remindersOn && <p className="app-panel-note">Turn {reminderAutomation?.name ?? 'the reminder sequence'} back on in Automations to send reminders.</p>}
          </Panel>
        </div>
      </div>
    </>
  )
}
