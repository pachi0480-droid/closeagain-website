/**
 * The operator (“Master control”) view of the sample book of business.
 * Juniper Row's records are the same ones the client dashboard shows, so the
 * two views agree; every other client is generated the same way.
 */

import { planById } from '../pricing.ts'
import { clientAutomations, planAllows, templateById, type Template } from './automations.ts'
import { invoicesFor, monthlyPrice, nextRenewal } from './billing.ts'
import { FEATURED_CLIENT_ID, clients } from './clients.ts'
import { generateClient, type Dataset } from './generate.ts'
import { summarize, windowFor, type Summary } from './metrics.ts'
import { DAY, DEMO_NOW, HOUR, MINUTE, atLocal } from './time.ts'
import type { Appointment, Client, IntegrationId, Lead } from './types.ts'
import { attentionNotes, integrationCatalog, workspaceAppointments, workspaceLeads } from './workspace.ts'

const prefixes: Record<string, string> = {
  'juniper-row': 'jr',
  'blue-heron': 'bh',
  bellwether: 'bw',
  'crescent-ridge': 'cr',
  solstice: 'so',
  marigold: 'mg',
  'calder-wynn': 'cw',
  fieldnote: 'fn',
  tallyhouse: 'th',
  'wren-loom': 'wl',
}

export const datasets: Record<string, Dataset> = Object.fromEntries(
  clients.map((client) => [
    client.id,
    client.id === FEATURED_CLIENT_ID
      ? { leads: workspaceLeads, appointments: workspaceAppointments }
      : generateClient(client, { prefix: prefixes[client.id] ?? client.id.slice(0, 2) }),
  ]),
)

export const allLeads: Lead[] = clients
  .flatMap((client) => datasets[client.id].leads)
  .sort((a, b) => b.lastContactAt - a.lastContactAt)

export const allAppointments: Appointment[] = clients
  .flatMap((client) => datasets[client.id].appointments)
  .sort((a, b) => a.start - b.start)

export const clientName = (id: string) => clients.find((client) => client.id === id)?.name ?? id
export const clientShort = (id: string) => clients.find((client) => client.id === id)?.short ?? id

// ── Health ────────────────────────────────────────────────────────────────

export type HealthFactor = { label: string; value: string; points: number; max: number }
export type Health = { score: number; band: 'healthy' | 'watch' | 'risk'; factors: HealthFactor[] }

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/**
 * Account health out of 100, from four things an operator can act on:
 * reply rate, lead volume trend, integration health and billing standing.
 */
export function healthFor(
  client: Client,
  current: Summary,
  previous: Summary,
  integrations: Record<IntegrationId, string> = client.integrations,
  status = client.status,
): Health {
  const reply = clamp(current.responseRate / 0.6)
  const change = previous.newLeads ? (current.newLeads - previous.newLeads) / previous.newLeads : 0
  const trend = clamp(0.55 + change)
  const statuses = Object.values(integrations).filter((value) => value !== 'available')
  const healthy = statuses.filter((value) => value === 'connected').length
  const integration = statuses.length ? healthy / statuses.length : 1
  const billing = status === 'paused' ? 0 : 1
  const factors: HealthFactor[] = [
    { label: 'Reply rate', value: `${Math.round(current.responseRate * 100)}%`, points: Math.round(reply * 40), max: 40 },
    {
      label: 'Lead volume vs prior 30 days',
      value: `${change >= 0 ? '+' : '−'}${Math.abs(Math.round(change * 100))}%`,
      points: Math.round(trend * 25),
      max: 25,
    },
    { label: 'Integrations healthy', value: `${healthy} of ${statuses.length}`, points: Math.round(integration * 20), max: 20 },
    { label: 'Billing', value: status === 'paused' ? 'Paused' : 'Current', points: billing * 15, max: 15 },
  ]
  const score = factors.reduce((sum, factor) => sum + factor.points, 0)
  // A paused account is at risk whatever its other numbers say.
  const band = status === 'paused' || score < 60 ? 'risk' : score >= 80 ? 'healthy' : 'watch'
  return { score, band, factors }
}

export type ClientRow = {
  client: Client
  mrr: number
  current: Summary
  previous: Summary
  health: Health
  lastActivity: number
}

const current30 = windowFor(30)
const previous30 = windowFor(30, 1)

export const clientRows: ClientRow[] = clients.map((client) => {
  const { leads, appointments } = datasets[client.id]
  const current = summarize(leads, appointments, current30)
  const previous = summarize(leads, appointments, previous30)
  return {
    client,
    mrr: client.status === 'paused' ? 0 : monthlyPrice(client),
    current,
    previous,
    health: healthFor(client, current, previous),
    lastActivity: leads.reduce((latest, lead) => Math.max(latest, lead.lastContactAt), 0),
  }
})

export const rowFor = (id: string) => clientRows.find((row) => row.client.id === id)

// ── Alerts ────────────────────────────────────────────────────────────────

export type Alert = {
  id: string
  clientId: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  at: number
  href: string
}

const integrationName = (id: IntegrationId) => integrationCatalog.find((item) => item.id === id)?.name ?? id

export function buildAlerts(rows: readonly ClientRow[]): Alert[] {
  const alerts: Alert[] = []
  for (const { client, current, previous, health } of rows) {
    const href = `/demo/operator/clients/${client.id}`
    if (client.status === 'paused' && client.paused) {
      alerts.push({
        id: `${client.id}.paused`,
        clientId: client.id,
        severity: 'critical',
        title: `${client.name} is paused`,
        detail: client.statusNote ?? client.paused.reason,
        at: client.paused.at,
        href,
      })
    }
    for (const [id, status] of Object.entries(client.integrations) as Array<[IntegrationId, string]>) {
      if (status !== 'attention') continue
      alerts.push({
        id: `${client.id}.${id}`,
        clientId: client.id,
        severity: 'warning',
        title: `${client.short}: ${integrationName(id)} needs attention`,
        detail: attentionNotes[`${client.id}.${id}`] ?? 'Check the connection.',
        at: DEMO_NOW - 3 * HOUR,
        href,
      })
    }
    if (client.status !== 'paused' && health.band === 'risk' && previous.newLeads > 0) {
      const drop = Math.round(((previous.newLeads - current.newLeads) / previous.newLeads) * 100)
      alerts.push({
        id: `${client.id}.volume`,
        clientId: client.id,
        severity: 'warning',
        title: `${client.short}: churn risk`,
        detail: `Lead volume down ${drop}% on the prior 30 days. Health ${health.score}/100.`,
        at: DEMO_NOW - 5 * HOUR,
        href,
      })
    }
    if (client.status === 'onboarding') {
      alerts.push({
        id: `${client.id}.onboarding`,
        clientId: client.id,
        severity: 'info',
        title: `${client.short}: onboarding`,
        detail: client.statusNote ?? 'Setup in progress.',
        at: client.since,
        href,
      })
    }
  }
  const weight = { critical: 0, warning: 1, info: 2 }
  return alerts.sort((a, b) => weight[a.severity] - weight[b.severity] || b.at - a.at)
}

// ── Billing extras ────────────────────────────────────────────────────────

export const allInvoices = clients.flatMap(invoicesFor).sort((a, b) => b.issuedAt - a.issuedAt)

export type Upsell = { clientId: string; from: string; to: string; delta: number; reason: string }

/**
 * Upsell ideas grounded in the plan feature lists in content/pricing.ts:
 * Core clients booking appointments by hand would get appointment workflows
 * on Growth; a Growth client asking for something only Scale includes is
 * offered Scale. Accounts at risk are left alone.
 */
/** Sample requests from Growth clients, each for a feature Scale includes. */
const scaleRequests: Record<string, { feature: string; request: string }> = {
  fieldnote: { feature: 'API and webhook access', request: 'Asked to send new leads to their project tool by webhook' },
}

export function upsellOpportunities(rows: readonly ClientRow[]): Upsell[] {
  const out: Upsell[] = []
  for (const { client, current, health } of rows) {
    if (client.status !== 'active' || health.band === 'risk') continue
    if (client.plan === 'core' && current.appointments >= 8) {
      const to = planById('growth')
      if (to?.monthly) {
        out.push({
          clientId: client.id,
          from: 'Core',
          to: to.name,
          delta: to.monthly - monthlyPrice(client),
          reason: `${current.appointments} appointments booked by hand in 30 days — Growth adds appointment workflows.`,
        })
      }
    }
    const request = scaleRequests[client.id]
    const scale = planById('scale')
    if (client.plan === 'growth' && request && scale?.monthly && scale.features.includes(request.feature)) {
      out.push({
        clientId: client.id,
        from: 'Growth',
        to: scale.name,
        delta: scale.monthly - monthlyPrice(client),
        reason: `${request.request} — ${scale.name} adds ${/^[A-Z]{2}/.test(request.feature) ? request.feature : request.feature.charAt(0).toLowerCase() + request.feature.slice(1)}.`,
      })
    }
  }
  return out
}

export const renewals = clients
  .filter((client) => client.status !== 'paused')
  .map((client) => ({ client, at: nextRenewal(client), amount: monthlyPrice(client) }))
  .sort((a, b) => a.at - b.at)

// ── Plan gating for deployments ───────────────────────────────────────────

export type DeployCheck = { ok: true } | { ok: false; reason: string }

/** “Advanced follow-up sequences are…”, “No-show recovery is…”. */
export const isPlural = (feature: string) => /s$/i.test(feature.trim())

/** Whether a template can run for a client. Pass the template itself for ones created in the demo tab. */
export function canDeploy(templateOrId: Template | string, client: Client, status = client.status): DeployCheck {
  const template = typeof templateOrId === 'string' ? templateById(templateOrId) : templateOrId
  if (status === 'paused') {
    return {
      ok: false,
      reason: `${client.name} is paused${client.paused ? ` (${client.paused.reason.toLowerCase()})` : ''}. Resume the account before deploying.`,
    }
  }
  if (template && !planAllows(client.plan, template.minPlan)) {
    const plan = planById(template.minPlan)
    const feature = template.planFeature ?? template.name
    return {
      ok: false,
      reason: `${feature} ${isPlural(feature) ? 'are' : 'is'} included from ${plan?.name ?? template.minPlan}. ${client.short} is on ${planById(client.plan)?.name}.`,
    }
  }
  return { ok: true }
}

// ── Support, users, system ────────────────────────────────────────────────

export type Ticket = {
  id: string
  clientId: string
  subject: string
  status: 'open' | 'waiting' | 'resolved'
  priority: 'high' | 'normal'
  opened: number
  lastUpdate: string
}

export const tickets: Ticket[] = [
  { id: 'T-1048', clientId: 'crescent-ridge', subject: 'Leads stopped coming from the website', status: 'open', priority: 'high', opened: atLocal(2026, 8, 22, 9, 12), lastUpdate: 'Asked Wade whether the quote-page form was edited on Sep 3.' },
  { id: 'T-1047', clientId: 'juniper-row', subject: 'Reconnect the email inbox', status: 'open', priority: 'normal', opened: atLocal(2026, 8, 23, 16, 40), lastUpdate: 'Sent Dana the reconnect link.' },
  { id: 'T-1046', clientId: 'tallyhouse', subject: 'Update the card on file', status: 'waiting', priority: 'high', opened: atLocal(2026, 8, 8, 11, 5), lastUpdate: 'Waiting on Priyanka — finance is issuing a new card.' },
  { id: 'T-1045', clientId: 'bellwether', subject: 'Webhook returning 410 Gone', status: 'open', priority: 'normal', opened: atLocal(2026, 8, 20, 14, 22), lastUpdate: 'Their field-service vendor is moving the endpoint this week.' },
  { id: 'T-1044', clientId: 'marigold', subject: 'Calendar setup for two injectors', status: 'open', priority: 'normal', opened: atLocal(2026, 8, 9, 10, 0), lastUpdate: 'Working session booked for Friday.' },
  { id: 'T-1041', clientId: 'juniper-row', subject: 'Add Elena as an admin', status: 'resolved', priority: 'normal', opened: atLocal(2026, 8, 2, 13, 30), lastUpdate: 'Done — Elena accepted the invite.' },
  { id: 'T-1039', clientId: 'blue-heron', subject: 'Separate reporting for the three offices', status: 'resolved', priority: 'normal', opened: atLocal(2026, 7, 27, 9, 45), lastUpdate: 'Custom report shared with Colette.' },
  { id: 'T-1036', clientId: 'solstice', subject: 'Membership win-back wording', status: 'resolved', priority: 'normal', opened: atLocal(2026, 7, 19, 15, 0), lastUpdate: 'New copy approved by Dr. Vogel.' },
]

export type ServiceStatus = 'operational' | 'degraded' | 'down'

export const services: Array<{ id: string; name: string; status: ServiceStatus; uptime: number; note: string }> = [
  { id: 'app', name: 'Web app', status: 'operational', uptime: 99.99, note: 'All regions normal' },
  { id: 'api', name: 'API', status: 'operational', uptime: 99.98, note: 'p95 180 ms' },
  { id: 'text', name: 'Text delivery', status: 'operational', uptime: 99.95, note: 'Delivery rate 98.7%' },
  { id: 'email', name: 'Email delivery', status: 'degraded', uptime: 99.62, note: 'Slower delivery to some inboxes since 9:40 AM' },
  { id: 'scheduler', name: 'Follow-up scheduler', status: 'operational', uptime: 99.99, note: 'On time' },
  { id: 'calendar', name: 'Calendar sync', status: 'operational', uptime: 99.9, note: 'Last full sync 10:45 AM' },
  { id: 'crm', name: 'CRM sync', status: 'operational', uptime: 99.87, note: 'Last full sync 10:30 AM' },
  { id: 'webhooks', name: 'Webhook delivery', status: 'operational', uptime: 99.8, note: '1 endpoint failing (client side)' },
]

export const queues: Array<{ id: string; name: string; depth: number; oldest: string; detail: string }> = [
  { id: 'outbound', name: 'Outbound messages', depth: 42, oldest: '38s', detail: 'Texts and emails waiting to send' },
  { id: 'scheduled', name: 'Scheduled follow-ups', depth: 1284, oldest: '—', detail: 'Due in the next 24 hours' },
  { id: 'webhooks', name: 'Webhook retries', depth: 17, oldest: '4d', detail: 'Bellwether Heating & Air endpoint' },
  { id: 'imports', name: 'Imports', depth: 1, oldest: '6m', detail: 'Marigold Aesthetics client list' },
]

export type Job = {
  id: string
  kind: string
  clientId: string
  status: 'succeeded' | 'failed' | 'running' | 'retrying'
  at: number
  duration: string
  detail: string
}

export const jobs: Job[] = [
  { id: 'job-88412', kind: 'Spreadsheet import', clientId: 'marigold', status: 'running', at: DEMO_NOW - 6 * MINUTE, duration: '6m', detail: '1,240 of 1,812 rows' },
  { id: 'job-88409', kind: 'CRM sync', clientId: 'blue-heron', status: 'succeeded', at: DEMO_NOW - 15 * MINUTE, duration: '14s', detail: '312 contacts updated' },
  { id: 'job-88405', kind: 'Email send batch', clientId: 'juniper-row', status: 'failed', at: DEMO_NOW - 38 * MINUTE, duration: '2s', detail: 'Inbox access expired — 6 emails held' },
  { id: 'job-88398', kind: 'Webhook delivery', clientId: 'bellwether', status: 'retrying', at: DEMO_NOW - 52 * MINUTE, duration: '1s', detail: '410 Gone from client endpoint' },
  { id: 'job-88391', kind: 'Calendar sync', clientId: 'calder-wynn', status: 'succeeded', at: DEMO_NOW - 1 * HOUR, duration: '9s', detail: '41 events checked' },
  { id: 'job-88377', kind: 'Reactivation batch', clientId: 'juniper-row', status: 'succeeded', at: DEMO_NOW - 70 * MINUTE, duration: '48s', detail: 'Wave 2 · step 1 sent' },
  { id: 'job-88360', kind: 'Form check', clientId: 'crescent-ridge', status: 'failed', at: DEMO_NOW - 2 * HOUR, duration: '3s', detail: 'No submissions in 21 days' },
  { id: 'job-88342', kind: 'CRM sync', clientId: 'solstice', status: 'succeeded', at: DEMO_NOW - 2.5 * HOUR, duration: '11s', detail: '96 contacts updated' },
  { id: 'job-88330', kind: 'Payment retry', clientId: 'tallyhouse', status: 'failed', at: DEMO_NOW - 16 * DAY, duration: '1s', detail: 'Card declined' },
]

export type OperatorMember = { name: string; title: string; email: string; role: 'Owner' | 'Admin' | 'Manager' | 'Viewer'; lastActive: number }

export const operatorTeam: OperatorMember[] = [
  { name: 'Riley Brooks', title: 'Operations lead', email: 'riley@closeagain.example', role: 'Owner', lastActive: DEMO_NOW - 2 * MINUTE },
  { name: 'Jordan Ellis', title: 'Automation specialist', email: 'jordan@closeagain.example', role: 'Admin', lastActive: DEMO_NOW - 40 * MINUTE },
  { name: 'Sam Okafor', title: 'Client success', email: 'sam@closeagain.example', role: 'Manager', lastActive: DEMO_NOW - 3 * HOUR },
  { name: 'Taylor Nguyen', title: 'Billing', email: 'taylor@closeagain.example', role: 'Viewer', lastActive: DEMO_NOW - 27 * HOUR },
]

export const operatorAutomations = clients.flatMap((client) => clientAutomations[client.id] ?? [])
