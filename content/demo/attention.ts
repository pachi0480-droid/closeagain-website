/**
 * “Needs attention” for the client dashboard: the few things someone should
 * act on now. Every item is counted from the sample records — with the
 * visitor's changes in the tab already applied by the caller — and links to
 * the filtered view that lists exactly those records.
 */

import { fmtTime } from './format.ts'
import { DAY, DEMO_NOW, TODAY, dayIndex } from './time.ts'
import type { Appointment, Automation, IntegrationId, IntegrationStatus, Lead } from './types.ts'

export type AttentionId = 'replies' | 'appointments' | 'no-shows' | 'automations' | 'integrations'

export type AttentionItem = {
  id: AttentionId
  count: number
  /** Reads after the count: “3 leads need replies”. */
  label: string
  detail: string
  href: string
  /** Short verb for the link: “Reply”, “See today”… */
  action: string
  /** Waiting on someone right now. */
  urgent: boolean
}

/** Where each item leads. Kept here so the links and the views agree. */
export const attentionHref: Record<AttentionId, string> = {
  replies: '/demo/conversations?show=needs-reply',
  appointments: '/demo/appointments?day=today',
  'no-shows': '/demo/appointments?show=no-shows',
  automations: '/demo/automations?show=review',
  integrations: '/demo/integrations?show=attention',
}

/** A lead is waiting on a reply while their newest message is unread and nobody has handled it. */
export const needsReply = (lead: Lead & { handled?: boolean }) => lead.unread && !lead.handled

export const isToday = (ms: number) => dayIndex(ms) === TODAY

/** Today's appointments that are still on, in time order. */
export function todaysAppointments(appointments: readonly Appointment[]): Appointment[] {
  return appointments.filter((item) => isToday(item.start) && item.status !== 'cancelled').sort((a, b) => a.start - b.start)
}

export type Review = { automation: Automation; reason: string }

/**
 * Automations a person should look at: switched off before they ever sent
 * anything (a draft), or paused with follow-ups on hold.
 */
export function automationReviews(automations: readonly Automation[], leads: readonly Lead[]): Review[] {
  const sent = new Set<string>()
  for (const lead of leads) for (const message of lead.thread) if (message.via) sent.add(message.via)
  const out: Review[] = []
  for (const automation of automations) {
    if (automation.enabled) continue
    out.push({
      automation,
      reason: sent.has(automation.id)
        ? 'Paused — its scheduled follow-ups are on hold.'
        : 'Drafted but switched off — nothing has been sent yet.',
    })
  }
  return out
}

/**
 * No-shows from the last two weeks that nobody has followed up: not rebooked,
 * and no “sorry we missed you” message sent by the no-show sequence or from the tab.
 */
export function noShowsToFollowUp(
  appointments: readonly Appointment[],
  leads: readonly Lead[],
  noShowAutomationId: string | undefined,
  followUps: Readonly<Record<string, true>> = {},
): Appointment[] {
  const since = DEMO_NOW - 14 * DAY
  const byId = new Map(leads.map((lead) => [lead.id, lead]))
  return appointments
    .filter((item) => item.status === 'no-show' && item.start >= since && item.start <= DEMO_NOW)
    .filter((item) => !appointments.some((other) => other.leadId === item.leadId && other.id !== item.id && other.bookedAt > item.start))
    .filter((item) => !followUps[item.id])
    .filter((item) => !byId.get(item.leadId)?.thread.some((message) => message.via === noShowAutomationId && message.at > item.start))
    .sort((a, b) => b.start - a.start)
}

const names = (list: string[], max = 2) =>
  list.length <= max ? list.join(' and ') : `${list.slice(0, max).join(', ')} and ${list.length - max} more`

export type IntegrationState = { id: IntegrationId; name: string; status: IntegrationStatus; note?: string }

export function clientAttention(input: {
  leads: ReadonlyArray<Lead & { handled?: boolean }>
  appointments: readonly Appointment[]
  automations: readonly Automation[]
  integrations: readonly IntegrationState[]
  followUps?: Readonly<Record<string, true>>
}): AttentionItem[] {
  const { leads, appointments, automations, integrations, followUps } = input
  const items: AttentionItem[] = []

  const waiting = leads.filter(needsReply).sort((a, b) => b.lastContactAt - a.lastContactAt)
  if (waiting.length) {
    items.push({
      id: 'replies',
      count: waiting.length,
      label: waiting.length === 1 ? 'lead needs a reply' : 'leads need replies',
      detail: names(waiting.map((lead) => lead.name)),
      href: attentionHref.replies,
      action: 'Reply',
      urgent: true,
    })
  }

  const today = todaysAppointments(appointments)
  if (today.length) {
    items.push({
      id: 'appointments',
      count: today.length,
      label: today.length === 1 ? 'appointment today' : 'appointments today',
      detail: today
        .slice(0, 2)
        .map((item) => `${item.leadName.split(' ')[0]} ${fmtTime(item.start)}`)
        .join(' · ')
        .concat(today.length > 2 ? ` · ${today.length - 2} more` : ''),
      href: attentionHref.appointments,
      action: 'See today',
      urgent: false,
    })
  }

  const noShowId = automations.find((automation) => automation.templateId === 'tpl-no-show')?.id
  const missed = noShowsToFollowUp(appointments, leads, noShowId, followUps)
  if (missed.length) {
    items.push({
      id: 'no-shows',
      count: missed.length,
      label: missed.length === 1 ? 'no-show to follow up' : 'no-shows to follow up',
      detail: names(missed.map((item) => item.leadName)),
      href: attentionHref['no-shows'],
      action: 'Follow up',
      urgent: false,
    })
  }

  const reviews = automationReviews(automations, leads)
  if (reviews.length) {
    items.push({
      id: 'automations',
      count: reviews.length,
      label: reviews.length === 1 ? 'automation needs review' : 'automations need review',
      detail: reviews.length === 1 ? `${reviews[0].automation.name}: ${reviews[0].reason.split(' — ')[0].toLowerCase()}` : names(reviews.map((review) => review.automation.name)),
      href: attentionHref.automations,
      action: 'Review',
      urgent: false,
    })
  }

  const broken = integrations.filter((item) => item.status === 'attention')
  if (broken.length) {
    items.push({
      id: 'integrations',
      count: broken.length,
      label: broken.length === 1 ? 'integration needs attention' : 'integrations need attention',
      detail:
        broken.length === 1
          ? `${broken[0].name}${broken[0].note ? ` · ${broken[0].note.split('. ')[0].replace(/\.$/, '')}` : ''}`
          : names(broken.map((item) => item.name)),
      href: attentionHref.integrations,
      action: 'Reconnect',
      urgent: false,
    })
  }

  return items
}
