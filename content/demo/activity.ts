/**
 * Recent lead activity for the client overview: new inquiries, missed calls
 * answered by text, replies, older leads coming back, and bookings — read
 * straight from the sample threads and appointments, newest first.
 */

import { DAY, DEMO_NOW } from './time.ts'
import type { Appointment, Channel, Lead, SourceId } from './types.ts'

export type ActivityKind = 'inquiry' | 'missed-call' | 'reply' | 'recovered' | 'booked'

export type ActivityEvent = {
  id: string
  kind: ActivityKind
  at: number
  leadId: string
  lead: string
  source: SourceId
  channel: Channel
  /** What was said, for inquiries and replies. */
  body?: string
  /** What was booked, for bookings. */
  appointment?: { type: string; start: number }
}

export function leadActivity(
  leads: readonly Lead[],
  appointments: readonly Appointment[],
  limit = 8,
  days = 7,
): ActivityEvent[] {
  const since = DEMO_NOW - days * DAY
  const events: ActivityEvent[] = []
  const byId = new Map(leads.map((lead) => [lead.id, lead]))

  for (const lead of leads) {
    if (lead.lastContactAt < since) continue
    lead.thread.forEach((message, index) => {
      if (message.at < since || message.at > DEMO_NOW) return
      const base = { leadId: lead.id, lead: lead.name, source: lead.source, channel: message.channel, at: message.at }
      if (message.from === 'lead') {
        const kind: ActivityKind = index === 0 ? 'inquiry' : lead.recoveredAt === message.at ? 'recovered' : 'reply'
        events.push({ ...base, id: `${message.id}.${kind}`, kind, body: message.body })
      } else if (index === 0 && message.from === 'closeagain' && lead.source === 'phone') {
        events.push({ ...base, id: `${message.id}.missed-call`, kind: 'missed-call' })
      }
    })
  }

  for (const appointment of appointments) {
    if (appointment.bookedAt < since || appointment.bookedAt > DEMO_NOW) continue
    const lead = byId.get(appointment.leadId)
    if (!lead) continue
    events.push({
      id: `${appointment.id}.booked`,
      kind: 'booked',
      at: appointment.bookedAt,
      leadId: lead.id,
      lead: lead.name,
      source: lead.source,
      channel: lead.channel,
      appointment: { type: appointment.type, start: appointment.start },
    })
  }

  return events.sort((a, b) => b.at - a.at || a.id.localeCompare(b.id)).slice(0, limit)
}
