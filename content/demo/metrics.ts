/**
 * Metrics for the demo dashboards. Every figure on a card, chart or table is
 * computed here from the sample records, so a count on a card always matches
 * the list behind it.
 */

import { DAY, DEMO_NOW, TODAY, dayIndex, dayStart } from './time.ts'
import type { Appointment, Automation, Lead, SourceId, StageId } from './types.ts'

export type Window = { days: number; start: number; end: number }

/** The last `days` calendar days including today; `periodsBack` = 1 is the window before it. */
export function windowFor(days: number, periodsBack = 0): Window {
  const lastDay = TODAY - days * periodsBack
  return { days, start: dayStart(lastDay - days + 1), end: dayStart(lastDay + 1) }
}

export const within = (ms: number | undefined, window: Window) =>
  ms !== undefined && ms >= window.start && ms < window.end

export type Summary = {
  newLeads: number
  recovered: number
  /** Two-way conversations: leads whose first reply landed in the window. */
  conversations: number
  /** Appointments booked in the window. */
  appointments: number
  enrolled: number
  responded: number
  /** Share of leads entering follow-up in the window who have replied. */
  responseRate: number
  converted: number
  /** Share of the window's new leads that booked an appointment. */
  conversionRate: number
  /** Estimated value of the window's new and recovered leads that reached qualified and were not lost. */
  pipeline: number
  messagesSent: number
  noShows: number
}

/**
 * A lead reached “qualified” once the team took the conversation over or an
 * appointment was booked. Pipeline counts those leads unless they were lost,
 * so older windows are not penalised for leads that have since moved on.
 */
export function reachedQualified(lead: Lead): boolean {
  if (lead.appointmentId || lead.stage === 'qualified' || lead.stage === 'appointment') return true
  if (lead.stage === 'closed' && lead.outcome === 'won') return true
  if (lead.repliedAt === undefined) return false
  const replied = lead.repliedAt
  return lead.thread.some((message) => message.from === 'team' && message.at > replied)
}

export function summarize(leads: readonly Lead[], appointments: readonly Appointment[], window: Window): Summary {
  const booked = new Set(appointments.map((appointment) => appointment.leadId))
  let newLeads = 0
  let recovered = 0
  let conversations = 0
  let enrolled = 0
  let responded = 0
  let converted = 0
  let pipeline = 0
  let messagesSent = 0
  for (const lead of leads) {
    const isNew = within(lead.createdAt, window)
    const isRecovered = within(lead.recoveredAt, window)
    if (isNew) {
      newLeads++
      if (booked.has(lead.id)) converted++
    }
    if (isRecovered) recovered++
    if (within(lead.repliedAt, window)) conversations++
    if (within(lead.enrolledAt, window)) {
      enrolled++
      if (lead.repliedAt !== undefined) responded++
    }
    if ((isNew || isRecovered) && lead.outcome !== 'lost' && reachedQualified(lead)) {
      pipeline += lead.value
    }
    for (const message of lead.thread) {
      if (message.from === 'closeagain' && within(message.at, window)) messagesSent++
    }
  }
  let booked30 = 0
  let noShows = 0
  for (const appointment of appointments) {
    if (within(appointment.bookedAt, window)) booked30++
    if (appointment.status === 'no-show' && within(appointment.start, window)) noShows++
  }
  return {
    newLeads,
    recovered,
    conversations,
    appointments: booked30,
    enrolled,
    responded,
    responseRate: enrolled ? responded / enrolled : 0,
    converted,
    conversionRate: newLeads ? converted / newLeads : 0,
    pipeline,
    messagesSent,
    noShows,
  }
}

export type DayPoint = {
  day: number
  start: number
  newLeads: number
  recovered: number
  conversations: number
  appointments: number
  sent: number
}

/** One point per calendar day for the last `days` days, today last. */
export function dailySeries(leads: readonly Lead[], appointments: readonly Appointment[], days: number): DayPoint[] {
  const first = TODAY - days + 1
  const points: DayPoint[] = Array.from({ length: days }, (_, i) => ({
    day: first + i,
    start: dayStart(first + i),
    newLeads: 0,
    recovered: 0,
    conversations: 0,
    appointments: 0,
    sent: 0,
  }))
  const slot = (ms: number | undefined) => {
    if (ms === undefined) return -1
    const i = dayIndex(ms) - first
    return i >= 0 && i < days ? i : -1
  }
  for (const lead of leads) {
    let i = slot(lead.createdAt)
    if (i >= 0) points[i].newLeads++
    i = slot(lead.recoveredAt)
    if (i >= 0) points[i].recovered++
    i = slot(lead.repliedAt)
    if (i >= 0) points[i].conversations++
    for (const message of lead.thread) {
      if (message.from !== 'closeagain') continue
      i = slot(message.at)
      if (i >= 0) points[i].sent++
    }
  }
  for (const appointment of appointments) {
    const i = slot(appointment.bookedAt)
    if (i >= 0) points[i].appointments++
  }
  return points
}

/**
 * Appointments booked per new lead over a trailing 7 days, for each of the
 * last `days` days. A flow ratio, so recent days are not penalised for leads
 * that have not had time to book yet.
 */
export function conversionTrend(leads: readonly Lead[], appointments: readonly Appointment[], days: number): number[] {
  const series = dailySeries(leads, appointments, days + 6)
  const out: number[] = []
  for (let i = 6; i < series.length; i++) {
    let created = 0
    let booked = 0
    for (let j = i - 6; j <= i; j++) {
      created += series[j].newLeads
      booked += series[j].appointments
    }
    out.push(created ? booked / created : 0)
  }
  return out
}

export const STAGES: StageId[] = ['new', 'active', 'qualified', 'appointment', 'closed', 'reengage']

export function stageCounts(leads: readonly Lead[]): Record<StageId, number> {
  const counts: Record<StageId, number> = { new: 0, active: 0, qualified: 0, appointment: 0, closed: 0, reengage: 0 }
  for (const lead of leads) counts[lead.stage]++
  return counts
}

export type SourceRow = { source: SourceId; leads: number; replied: number; booked: number; replyRate: number; bookRate: number }

/** Leads that entered follow-up in the window, grouped by where they came from. */
export function sourcePerformance(leads: readonly Lead[], appointments: readonly Appointment[], window: Window): SourceRow[] {
  const booked = new Set(appointments.map((appointment) => appointment.leadId))
  const rows = new Map<SourceId, SourceRow>()
  for (const lead of leads) {
    if (!within(lead.enrolledAt, window)) continue
    const row = rows.get(lead.source) ?? { source: lead.source, leads: 0, replied: 0, booked: 0, replyRate: 0, bookRate: 0 }
    row.leads++
    if (lead.repliedAt !== undefined) row.replied++
    if (booked.has(lead.id)) row.booked++
    rows.set(lead.source, row)
  }
  return [...rows.values()]
    .map((row) => ({ ...row, replyRate: row.leads ? row.replied / row.leads : 0, bookRate: row.leads ? row.booked / row.leads : 0 }))
    .sort((a, b) => b.leads - a.leads)
}

export type AutomationStats = {
  enrolled: number
  replied: number
  replyRate: number
  booked: number
  bookRate: number
  recovered: number
  sent: number
  /** Next automated send, if one is scheduled. */
  nextSend?: number
  /** Sends scheduled in the next 24 hours. */
  queued: number
}

/**
 * Performance per automation over a window. Lead-enrolling automations count
 * their leads; reminder and no-show sequences count the appointments they
 * act on. Messages count by the automation that sent them.
 */
export function automationStats(
  automation: Automation,
  leads: readonly Lead[],
  appointments: readonly Appointment[],
  window: Window,
): AutomationStats {
  let sent = 0
  for (const lead of leads) {
    for (const message of lead.thread) {
      if (message.via === automation.id && within(message.at, window)) sent++
    }
  }
  const horizon = DEMO_NOW + DAY

  if (automation.templateId === 'tpl-reminder') {
    const inWindow = appointments.filter((appointment) => within(appointment.start, window))
    const confirmed = inWindow.filter((appointment) => appointment.status === 'confirmed' || appointment.status === 'completed').length
    const upcoming = appointments
      .filter((appointment) => appointment.start - DAY > DEMO_NOW && (appointment.status === 'scheduled' || appointment.status === 'confirmed'))
      .map((appointment) => appointment.start - DAY)
      .sort((a, b) => a - b)
    return {
      enrolled: inWindow.length,
      replied: confirmed,
      replyRate: inWindow.length ? confirmed / inWindow.length : 0,
      booked: 0,
      bookRate: 0,
      recovered: 0,
      sent,
      ...(automation.enabled && upcoming[0] ? { nextSend: upcoming[0] } : {}),
      queued: automation.enabled ? upcoming.filter((at) => at < horizon).length : 0,
    }
  }

  if (automation.templateId === 'tpl-no-show') {
    const noShows = appointments.filter((appointment) => appointment.status === 'no-show' && within(appointment.start, window))
    const rebooked = noShows.filter((noShow) =>
      appointments.some((other) => other.leadId === noShow.leadId && other.bookedAt > noShow.start),
    ).length
    return {
      enrolled: noShows.length,
      replied: rebooked,
      replyRate: noShows.length ? rebooked / noShows.length : 0,
      booked: rebooked,
      bookRate: noShows.length ? rebooked / noShows.length : 0,
      recovered: 0,
      sent,
      queued: 0,
    }
  }

  const booked = new Set(appointments.map((appointment) => appointment.leadId))
  let enrolled = 0
  let replied = 0
  let bookedCount = 0
  let recovered = 0
  let nextSend: number | undefined
  let queued = 0
  for (const lead of leads) {
    if (lead.automationId !== automation.id) continue
    if (within(lead.enrolledAt, window)) {
      enrolled++
      if (lead.repliedAt !== undefined) replied++
      if (booked.has(lead.id)) bookedCount++
    }
    if (within(lead.recoveredAt, window)) recovered++
    if (automation.enabled && lead.nextAt !== undefined && lead.nextAt > DEMO_NOW && (lead.stage === 'new' || lead.stage === 'reengage')) {
      if (nextSend === undefined || lead.nextAt < nextSend) nextSend = lead.nextAt
      if (lead.nextAt < horizon) queued++
    }
  }
  return {
    enrolled,
    replied,
    replyRate: enrolled ? replied / enrolled : 0,
    booked: bookedCount,
    bookRate: enrolled ? bookedCount / enrolled : 0,
    recovered,
    sent,
    ...(nextSend !== undefined ? { nextSend } : {}),
    queued,
  }
}
