'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { clients } from '@/content/demo/clients'
import { fmtDayTime, fmtNumber, fmtPercent } from '@/content/demo/format'
import { windowFor, within } from '@/content/demo/metrics'
import { allAppointments, clientShort } from '@/content/demo/operator'
import { DAY, DEMO_NOW, TODAY } from '@/content/demo/time'
import type { AppointmentStatus } from '@/content/demo/types'
import { BarList } from '../charts'
import { CalendarToolbar, MonthGrid, WeekGrid, type CalendarMode } from '../Calendar'
import { statusTone } from '../client/AppointmentsView'
import { appointmentStatusLabel } from '../labels'
import { Badge, Metric, PageHeader, Panel, SelectField } from '../ui'

export function OperatorAppointments() {
  const [client, setClient] = useState('all')
  const [status, setStatus] = useState<'all' | AppointmentStatus>('all')
  const [mode, setMode] = useState<CalendarMode>('month')
  const [cursor, setCursor] = useState(TODAY)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const scoped = useMemo(
    () => allAppointments.filter((appointment) => (client === 'all' || appointment.clientId === client) && (status === 'all' || appointment.status === status)),
    [client, status],
  )
  const month = windowFor(30)
  const upcoming = scoped
    .filter((appointment) => appointment.start > DEMO_NOW && appointment.start < DEMO_NOW + 7 * DAY && (appointment.status === 'scheduled' || appointment.status === 'confirmed'))
    .sort((a, b) => a.start - b.start)
  const inMonth = allAppointments.filter((appointment) => (client === 'all' || appointment.clientId === client) && within(appointment.start, month))
  const held = inMonth.filter((appointment) => appointment.status === 'completed' || appointment.status === 'no-show')
  const noShows = held.filter((appointment) => appointment.status === 'no-show').length
  const booked = allAppointments.filter((appointment) => (client === 'all' || appointment.clientId === client) && within(appointment.bookedAt, month)).length
  const selected = scoped.find((appointment) => appointment.id === selectedId) ?? null

  const byClient = clients
    .map((item) => {
      const list = allAppointments.filter((appointment) => appointment.clientId === item.id && within(appointment.start, month) && (appointment.status === 'completed' || appointment.status === 'no-show'))
      const misses = list.filter((appointment) => appointment.status === 'no-show').length
      return { id: item.id, name: item.short, held: list.length, rate: list.length ? misses / list.length : 0 }
    })
    .filter((row) => row.held > 0)
    .sort((a, b) => b.rate - a.rate)

  const label = (appointment: (typeof allAppointments)[number]) => `${clientShort(appointment.clientId)} · ${appointment.leadName.split(' ')[0]}`

  return (
    <>
      <PageHeader title="Appointments" description="Every client’s booked appointments · all times Eastern">
        <SelectField label="Client" hideLabel value={client} onChange={setClient} options={[{ value: 'all', label: 'All clients' }, ...clients.map((item) => ({ value: item.id, label: item.name }))]} />
        <SelectField
          label="Status"
          hideLabel
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'All statuses' }, ...(Object.keys(appointmentStatusLabel) as AppointmentStatus[]).map((value) => ({ value, label: appointmentStatusLabel[value] }))]}
        />
      </PageHeader>
      <div className="app-page">
        <div className="app-grid app-grid--metrics app-grid--metrics-4">
          <Metric index={0} label="Upcoming · 7 days" value={fmtNumber(upcoming.length)} note={client === 'all' ? 'All clients' : clientShort(client)} />
          <Metric index={1} label="Booked · 30 days" value={fmtNumber(booked)} />
          <Metric index={2} label="Show rate · 30 days" value={held.length ? fmtPercent(1 - noShows / held.length) : '—'} note={`${held.length - noShows} of ${held.length} held`} />
          <Metric index={3} label="No-shows · 30 days" value={fmtNumber(noShows)} />
        </div>
        <div className="app-grid app-grid--aside">
          <Panel index={1} className="app-calpanel">
            <CalendarToolbar mode={mode} cursor={cursor} onMode={setMode} onCursor={setCursor} />
            {mode === 'month' ? (
              <MonthGrid
                cursor={cursor}
                appointments={scoped}
                selectedId={selectedId}
                onSelect={setSelectedId}
                label={label}
                onDay={(day) => {
                  setCursor(day)
                  setMode('week')
                }}
              />
            ) : (
              <WeekGrid cursor={cursor} appointments={scoped} selectedId={selectedId} onSelect={setSelectedId} label={label} />
            )}
          </Panel>
          <div className="app-stack-col">
            <Panel index={2} title={selected ? selected.leadName : 'Appointment details'} meta={selected ? `${clientShort(selected.clientId)} · ${fmtDayTime(selected.start)}` : 'Choose one on the calendar'}>
              {selected ? (
                <div className="app-apptdetail">
                  <div className="app-apptdetail__status">
                    <Badge tone={statusTone[selected.status]}>{appointmentStatusLabel[selected.status]}</Badge>
                    <span className="ui-meta">
                      {selected.type} · with {selected.host}
                    </span>
                  </div>
                  <p className="ui-meta">{selected.location}</p>
                  <Link href={`/demo/operator/clients/${selected.clientId}`} className="app-textlink">
                    Open {clientShort(selected.clientId)}
                  </Link>
                </div>
              ) : (
                <p className="app-panel-note app-panel-note--flush">Appointments show each client’s short name first.</p>
              )}
            </Panel>
            <Panel index={3} title="No-show rate by client" meta="Held appointments, last 30 days">
              <BarList
                label="No-show rate by client"
                max={Math.max(0.25, ...byClient.map((row) => row.rate))}
                format={(value) => fmtPercent(value)}
                rows={byClient.map((row) => ({ id: row.id, label: row.name, sub: `${row.held} held`, value: row.rate, highlight: false }))}
                stacked
              />
            </Panel>
          </div>
        </div>
      </div>
    </>
  )
}
