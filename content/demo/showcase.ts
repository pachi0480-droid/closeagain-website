/**
 * The homepage dashboard showcase's numbers, computed from the same sample
 * workspace as the live demo (the demo overview's default 30-day window).
 *
 * The homepage renders the committed copy in showcase-data.ts, so it never
 * ships or runs the sample generator; tests/demo.test.ts fails if that copy
 * drifts from this function. After changing content/demo, regenerate it:
 *
 *   node content/demo/showcase.ts > content/demo/showcase-data.ts
 */

import { pathToFileURL } from 'node:url'
import { appointmentStatusLabel, sourceLabel, stageShort } from '../../components/dashboard/labels.ts'
import { planById } from '../pricing.ts'
import { fmtChange, fmtDate, fmtDay, fmtStamp, fmtTime, fmtUntil, fmtWeekdayDate, initials, WEEKDAYS } from './format.ts'
import { automationStats, dailySeries, summarize, windowFor } from './metrics.ts'
import { DEMO_NOW, localParts } from './time.ts'
import type { AppointmentStatus, Lead, ShowcaseData, ShowcaseTone, StageId } from './types.ts'
import { workspaceAppointments, workspaceAutomations, workspaceClient, workspaceLeads, workspaceTeam } from './workspace.ts'

const stageTone: Record<StageId, ShowcaseTone> = {
  new: 'ink',
  active: 'default',
  qualified: 'outline',
  appointment: 'positive',
  closed: 'cold',
  reengage: 'red',
}

const statusTone: Record<AppointmentStatus, ShowcaseTone> = {
  scheduled: 'default',
  confirmed: 'ink',
  completed: 'positive',
  'no-show': 'red',
  cancelled: 'cold',
}

/** Who said the last thing, as the demo's lists show it. */
function lastLine(lead: Lead) {
  const last = lead.thread[lead.thread.length - 1]
  const prefix = last.from === 'lead' ? '' : last.from === 'closeagain' ? 'CloseAgain: ' : `${(last.author ?? 'Team').split(' ')[0]}: `
  return { prefix, text: last.body }
}

export function buildShowcaseData(): ShowcaseData {
  const period = windowFor(30)
  const current = summarize(workspaceLeads, workspaceAppointments, period)
  const previous = summarize(workspaceLeads, workspaceAppointments, windowFor(30, 1))
  const series = dailySeries(workspaceLeads, workspaceAppointments, 30)
  const change = (now: number, before: number) => ({ delta: fmtChange(now, before), up: now >= before })
  const unread = workspaceLeads.filter((lead) => lead.unread).length
  const owner = workspaceTeam[0]

  const recent = workspaceLeads.filter((lead) => lead.thread.some((message) => message.from === 'lead')).slice(0, 4)
  const byLastContact = [...workspaceLeads].sort((a, b) => b.lastContactAt - a.lastContactAt).slice(0, 5)
  const shown = ['new-lead', 'missed-inquiry', 'reactivation', 'reminder'].map((slug) => workspaceAutomations.find((automation) => automation.id.endsWith(`.${slug}`)))
  const upcoming = workspaceAppointments
    .filter((appointment) => appointment.start > DEMO_NOW && (appointment.status === 'scheduled' || appointment.status === 'confirmed'))
    .slice(0, 4)
  const totals = series.map((point) => point.newLeads + point.recovered)

  return {
    workspace: {
      name: workspaceClient.name,
      mark: 'JR',
      meta: `${planById(workspaceClient.plan)?.name ?? ''} plan · ${workspaceClient.location}`,
      date: fmtWeekdayDate(DEMO_NOW),
      user: owner.name,
      role: owner.title,
    },
    kpis: [
      { id: 'new', label: 'New leads', value: current.newLeads, format: 'number', ...change(current.newLeads, previous.newLeads), note: 'vs prior 30 days' },
      { id: 'recovered', label: 'Recovered leads', value: current.recovered, format: 'number', ...change(current.recovered, previous.recovered), note: 'vs prior 30 days' },
      {
        id: 'active',
        label: 'Active conversations',
        value: workspaceLeads.filter((lead) => lead.stage === 'active').length,
        format: 'number',
        delta: '',
        up: true,
        note: `${unread} waiting on a reply`,
      },
      { id: 'appointments', label: 'Appointments', value: current.appointments, format: 'number', ...change(current.appointments, previous.appointments), note: 'vs prior 30 days' },
      { id: 'pipeline', label: 'Pipeline influenced', value: current.pipeline, format: 'currency', ...change(current.pipeline, previous.pipeline), note: 'Est. commission' },
    ],
    unread,
    conversations: recent.map((lead) => ({
      id: lead.id,
      name: lead.name,
      initials: initials(lead.name),
      stage: stageShort[lead.stage],
      tone: stageTone[lead.stage],
      ...lastLine(lead),
      time: fmtStamp(lead.lastContactAt),
      unread: lead.unread,
      recovered: lead.recoveredAt !== undefined,
    })),
    leads: byLastContact.map((lead) => ({
      id: lead.id,
      name: lead.name,
      initials: initials(lead.name),
      interest: lead.interest,
      source: sourceLabel[lead.source],
      status: stageShort[lead.stage],
      tone: stageTone[lead.stage],
      score: lead.score,
      next: lead.nextAction,
    })),
    automations: shown.flatMap((automation) => {
      if (!automation) return []
      const stats = automationStats(automation, workspaceLeads, workspaceAppointments, period)
      const reminder = automation.templateId === 'tpl-reminder'
      return [
        {
          id: automation.id,
          name: automation.name,
          type: automation.type === 'campaign' ? 'Campaign' : 'Sequence',
          enabled: automation.enabled,
          replyRate: `${Math.round(stats.replyRate * 100)}% ${reminder ? 'confirmed' : 'replied'}`,
          next: stats.nextSend ? `Next ${fmtUntil(stats.nextSend)}` : 'When triggered',
        },
      ]
    }),
    running: { on: workspaceAutomations.filter((automation) => automation.enabled).length, of: workspaceAutomations.length },
    appointments: upcoming.map((appointment) => ({
      id: appointment.id,
      name: appointment.leadName,
      type: appointment.type,
      weekday: WEEKDAYS[localParts(appointment.start).weekday],
      date: String(localParts(appointment.start).date),
      time: fmtTime(appointment.start),
      when: fmtDay(appointment.start),
      status: appointmentStatusLabel[appointment.status],
      tone: statusTone[appointment.status],
    })),
    trend: {
      labels: series.map((point) => fmtDate(point.start)),
      newLeads: series.map((point) => point.newLeads),
      recovered: series.map((point) => point.recovered),
      newTotal: current.newLeads,
      recoveredTotal: current.recovered,
      top: Math.max(5, Math.ceil(Math.max(...totals) / 5) * 5),
    },
  }
}

/** The source of showcase-data.ts. */
export function showcaseModule(data: ShowcaseData = buildShowcaseData()): string {
  return [
    '/**',
    ' * Generated from the sample workspace by content/demo/showcase.ts — do not edit.',
    ' * Regenerate: node content/demo/showcase.ts > content/demo/showcase-data.ts',
    ' */',
    '',
    "import type { ShowcaseData } from './types.ts'",
    '',
    `export const showcase: ShowcaseData = ${JSON.stringify(data, null, 2)}`,
    '',
  ].join('\n')
}

// Printed when run directly with node.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.stdout.write(showcaseModule())
