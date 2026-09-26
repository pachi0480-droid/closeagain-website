'use client'

/** Month and week calendars for sample appointments. Navigation is by day index in the workspace timezone. */

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { MONTHS_LONG, WEEKDAYS, fmtDate, fmtTime, fmtTimeShort } from '@/content/demo/format'
import { MINUTE, TODAY, atDay, atLocal, dayIndex, localParts } from '@/content/demo/time'
import type { Appointment } from '@/content/demo/types'
import { appointmentStatusLabel } from './labels'
import { Segmented, cx } from './ui'

export type CalendarMode = 'month' | 'week'

const DAY_START = 8
const DAY_END = 19
const HOUR_PX = 44

const firstName = (name: string) => name.split(' ')[0]

export function monthTitle(cursor: number) {
  const { year, month } = localParts(atDay(cursor, 12))
  return `${MONTHS_LONG[month]} ${year}`
}

export function weekStart(cursor: number) {
  return cursor - localParts(atDay(cursor, 12)).weekday
}

export function weekTitle(cursor: number) {
  const start = weekStart(cursor)
  const a = localParts(atDay(start, 12))
  const b = localParts(atDay(start + 6, 12))
  const left = fmtDate(atDay(start, 12))
  const right = a.month === b.month ? `${b.date}` : fmtDate(atDay(start + 6, 12))
  return `${left} – ${right}, ${b.year}`
}

/** Move the cursor by one month or week. */
export function shiftCursor(cursor: number, mode: CalendarMode, delta: number) {
  if (mode === 'week') return cursor + 7 * delta
  const { year, month } = localParts(atDay(cursor, 12))
  const target = new Date(Date.UTC(year, month + delta, 1))
  return dayIndex(atLocal(target.getUTCFullYear(), target.getUTCMonth(), 1, 12))
}

export function CalendarToolbar({
  mode,
  cursor,
  onMode,
  onCursor,
}: {
  mode: CalendarMode
  cursor: number
  onMode: (mode: CalendarMode) => void
  onCursor: (cursor: number) => void
}) {
  return (
    <div className="app-caltools">
      <div className="app-caltools__nav">
        <button type="button" className="ui-btn ui-btn--quiet app-iconbtn" aria-label={`Previous ${mode}`} onClick={() => onCursor(shiftCursor(cursor, mode, -1))}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className="ui-btn ui-btn--quiet app-iconbtn" aria-label={`Next ${mode}`} onClick={() => onCursor(shiftCursor(cursor, mode, 1))}>
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" className="ui-btn ui-btn--quiet" onClick={() => onCursor(TODAY)} disabled={mode === 'week' ? weekStart(cursor) === weekStart(TODAY) : monthTitle(cursor) === monthTitle(TODAY)}>
          Today
        </button>
        <h2 className="app-caltools__title" aria-live="polite">
          {mode === 'month' ? monthTitle(cursor) : weekTitle(cursor)}
        </h2>
      </div>
      <Segmented
        label="Calendar view"
        size="sm"
        value={mode}
        onChange={onMode}
        options={[
          { value: 'month', label: 'Month' },
          { value: 'week', label: 'Week' },
        ]}
      />
    </div>
  )
}

function EventChip({
  appointment,
  selected,
  onSelect,
  showClient,
}: {
  appointment: Appointment
  selected: boolean
  onSelect: (id: string) => void
  showClient?: (appointment: Appointment) => string
}) {
  return (
    <button
      type="button"
      className={cx('app-event', `app-event--${appointment.status}`, selected && 'is-selected')}
      aria-pressed={selected}
      onClick={() => onSelect(appointment.id)}
    >
      <span className="app-event__time">{fmtTimeShort(appointment.start)}</span>
      <span className="app-event__name">{showClient ? showClient(appointment) : firstName(appointment.leadName)}</span>
      <span className="app-sr">
        {`, ${appointment.leadName}, ${appointment.type}, ${appointmentStatusLabel[appointment.status]}`}
      </span>
    </button>
  )
}

export function MonthGrid({
  cursor,
  appointments,
  selectedId,
  onSelect,
  onDay,
  label,
}: {
  cursor: number
  appointments: Appointment[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDay: (day: number) => void
  label?: (appointment: Appointment) => string
}) {
  const { year, month } = localParts(atDay(cursor, 12))
  const first = dayIndex(atLocal(year, month, 1, 12))
  const gridStart = first - localParts(atDay(first, 12)).weekday
  const lastDate = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const weeks = Math.ceil((localParts(atDay(first, 12)).weekday + lastDate) / 7)
  const byDay = new Map<number, Appointment[]>()
  for (const appointment of appointments) {
    const day = dayIndex(appointment.start)
    const list = byDay.get(day) ?? []
    list.push(appointment)
    byDay.set(day, list)
  }

  return (
    <table className="app-month">
      <caption className="app-sr">Appointments in {monthTitle(cursor)}</caption>
      <thead>
        <tr>
          {WEEKDAYS.map((weekday) => (
            <th key={weekday} scope="col" className="app-month__weekday">
              {weekday}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
      {Array.from({ length: weeks }, (_, week) => (
        <tr key={week}>
          {Array.from({ length: 7 }, (_, weekday) => {
            const day = gridStart + week * 7 + weekday
            const parts = localParts(atDay(day, 12))
            const inMonth = parts.month === month
            const events = (byDay.get(day) ?? []).sort((a, b) => a.start - b.start)
            const shown = events.slice(0, 3)
            return (
              <td key={day} className={cx('app-month__day', !inMonth && 'is-outside', day === TODAY && 'is-today', day < TODAY && 'is-past')}>
                <span className="app-month__date">
                  <span className="app-sr">{fmtDate(atDay(day, 12))}</span>
                  <span aria-hidden="true">{parts.date}</span>
                </span>
                <div className="app-month__events">
                  {shown.map((appointment) => (
                    <EventChip key={appointment.id} appointment={appointment} selected={appointment.id === selectedId} onSelect={onSelect} showClient={label} />
                  ))}
                  {events.length > shown.length && (
                    <button type="button" className="app-month__more" onClick={() => onDay(day)}>
                      +{events.length - shown.length} more
                    </button>
                  )}
                </div>
                {events.length > 0 && (
                  <span className="app-month__dots" aria-hidden="true">
                    {events.slice(0, 4).map((appointment) => (
                      <span key={appointment.id} className={`app-month__dot app-month__dot--${appointment.status}`} />
                    ))}
                  </span>
                )}
              </td>
            )
          })}
        </tr>
      ))}
      </tbody>
    </table>
  )
}

/** Side-by-side columns for overlapping appointments within a day. */
function layoutDay(events: Appointment[]) {
  const sorted = [...events].sort((a, b) => a.start - b.start || b.durationMin - a.durationMin)
  const placed: Array<{ appointment: Appointment; col: number; cols: number }> = []
  let cluster: typeof placed = []
  let columns: number[] = []
  let clusterEnd = -Infinity
  const close = () => {
    for (const item of cluster) item.cols = columns.length
    cluster = []
    columns = []
  }
  for (const appointment of sorted) {
    const end = appointment.start + appointment.durationMin * MINUTE
    if (appointment.start >= clusterEnd) {
      close()
      clusterEnd = -Infinity
    }
    let col = columns.findIndex((columnEnd) => columnEnd <= appointment.start)
    if (col === -1) {
      col = columns.length
      columns.push(end)
    } else {
      columns[col] = end
    }
    const item = { appointment, col, cols: 1 }
    cluster.push(item)
    placed.push(item)
    clusterEnd = Math.max(clusterEnd, end)
  }
  close()
  return placed
}

export function WeekGrid({
  cursor,
  appointments,
  selectedId,
  onSelect,
  label,
}: {
  cursor: number
  appointments: Appointment[]
  selectedId: string | null
  onSelect: (id: string) => void
  label?: (appointment: Appointment) => string
}) {
  const start = weekStart(cursor)
  const days = Array.from({ length: 7 }, (_, i) => start + i)
  const hours = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i)

  return (
    <>
      <div className="app-week" style={{ '--hour': `${HOUR_PX}px` } as CSSProperties}>
        <div className="app-week__corner" aria-hidden="true" />
        {days.map((day) => {
          const parts = localParts(atDay(day, 12))
          return (
            <div key={day} className={cx('app-week__dayhead', day === TODAY && 'is-today')}>
              <span className="app-week__weekday">{WEEKDAYS[parts.weekday]}</span>
              <span className="app-week__date">{parts.date}</span>
            </div>
          )
        })}
        <div className="app-week__hours" aria-hidden="true">
          {hours.map((hour) => (
            <span key={hour} style={{ top: `${(hour - DAY_START) * HOUR_PX}px` }}>
              {hour % 12 === 0 ? 12 : hour % 12}
              {hour < 12 ? 'am' : 'pm'}
            </span>
          ))}
        </div>
        {days.map((day) => {
          const events = appointments.filter((appointment) => dayIndex(appointment.start) === day)
          return (
            <div key={day} className={cx('app-week__col', day === TODAY && 'is-today')} aria-label={fmtDate(atDay(day, 12))} role="group">
              {hours.map((hour) => (
                <span key={hour} className="app-week__line" style={{ top: `${(hour - DAY_START) * HOUR_PX}px` }} aria-hidden="true" />
              ))}
              {layoutDay(events).map(({ appointment, col, cols }) => {
                const { hour, minute } = localParts(appointment.start)
                const top = ((hour - DAY_START) * 60 + minute) * (HOUR_PX / 60)
                const height = Math.max(26, appointment.durationMin * (HOUR_PX / 60) - 3)
                return (
                  <button
                    key={appointment.id}
                    type="button"
                    className={cx(
                      'app-week__event',
                      `app-event--${appointment.status}`,
                      appointment.id === selectedId && 'is-selected',
                      cols > 2 && 'is-narrow',
                      height < 40 && 'is-short',
                    )}
                    style={{
                      top: `${Math.max(0, top)}px`,
                      height: `${height}px`,
                      left: `calc(${(col / cols) * 100}% + 2px)`,
                      width: `calc(${100 / cols}% - 4px)`,
                    }}
                    aria-pressed={appointment.id === selectedId}
                    onClick={() => onSelect(appointment.id)}
                  >
                    <span className="app-week__time">
                      {fmtTimeShort(appointment.start)}–{fmtTimeShort(appointment.start + appointment.durationMin * MINUTE)}
                    </span>
                    <span className="app-week__name">{label ? label(appointment) : appointment.leadName}</span>
                    <span className="app-week__type">{appointment.type}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
      <Agenda days={days} appointments={appointments} selectedId={selectedId} onSelect={onSelect} label={label} />
    </>
  )
}

/** The week as a list, for narrow screens. */
function Agenda({
  days,
  appointments,
  selectedId,
  onSelect,
  label,
}: {
  days: number[]
  appointments: Appointment[]
  selectedId: string | null
  onSelect: (id: string) => void
  label?: (appointment: Appointment) => string
}) {
  return (
    <ol className="app-agenda">
      {days.map((day) => {
        const events = appointments.filter((appointment) => dayIndex(appointment.start) === day).sort((a, b) => a.start - b.start)
        const parts = localParts(atDay(day, 12))
        return (
          <li key={day} className={cx('app-agenda__day', day === TODAY && 'is-today')}>
            <p className="app-agenda__date">
              {WEEKDAYS[parts.weekday]} {parts.date}
            </p>
            {events.length === 0 ? (
              <p className="app-agenda__none">No appointments</p>
            ) : (
              <ul className="app-agenda__list">
                {events.map((appointment) => (
                  <li key={appointment.id}>
                    <button
                      type="button"
                      className={cx('app-agenda__event', `app-event--${appointment.status}`, appointment.id === selectedId && 'is-selected')}
                      aria-pressed={appointment.id === selectedId}
                      onClick={() => onSelect(appointment.id)}
                    >
                      <span className="app-agenda__time">{fmtTime(appointment.start)}</span>
                      <span className="app-agenda__text">
                        <span className="app-cell-title">{label ? label(appointment) : appointment.leadName}</span>
                        <span className="app-cell-sub">
                          {appointment.type} · {appointmentStatusLabel[appointment.status]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}
