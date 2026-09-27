/**
 * The master automation library and each client's running automations.
 *
 * Template availability follows the plan feature lists in content/pricing.ts:
 * advanced follow-up sequences come with Growth; missed-call follow-up and
 * no-show recovery come with Scale. `planFeature` quotes the feature.
 */

import type { PlanId } from '../pricing.ts'
import { clients } from './clients.ts'
import { DAY, DEMO_NOW, atLocal } from './time.ts'
import type { Automation, Client, Step } from './types.ts'

export type TemplateId =
  | 'tpl-new-lead'
  | 'tpl-missed-inquiry'
  | 'tpl-reactivation'
  | 'tpl-no-show'
  | 'tpl-reminder'
  | 'tpl-proposal'
  | 'tpl-win-back'

export type Template = {
  id: string
  name: string
  category: string
  description: string
  /** The lowest plan whose features include this workflow. */
  minPlan: PlanId
  /** Why the plan matters, quoted from the plan’s feature list. */
  planFeature?: string
  type: Automation['type']
  steps: Step[]
  updatedAt: number
  updatedBy: string
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
export type StepInput = DistributiveOmit<Step, 'id'>

const s = (step: StepInput) => step

/** Stable step ids: the template id plus the step's position. */
const withIds = (templateId: string, steps: StepInput[]): Step[] =>
  steps.map((step, index) => ({ ...step, id: `${templateId}.${index + 1}` }) as Step)

export const templates: Template[] = [
  {
    id: 'tpl-new-lead',
    name: 'New Lead Follow-Up',
    category: 'Speed to lead',
    description: 'Replies to new inquiries right away, then follows up until they answer.',
    minPlan: 'core',
    type: 'sequence',
    updatedAt: atLocal(2026, 8, 14, 10, 20),
    updatedBy: 'Riley Brooks',
    steps: withIds('tpl-new-lead', [
      s({ kind: 'trigger', event: 'new-lead' }),
      s({ kind: 'message', channel: 'text', body: 'Hi {first}, it’s {agent} with {business}. Thanks for reaching out about {interest}. What’s the best time to talk?' }),
      s({ kind: 'wait', amount: 1, unit: 'days' }),
      s({ kind: 'condition', check: 'replied' }),
      s({ kind: 'message', channel: 'text', body: 'Just checking in, {first}. Still interested in {interest}?' }),
      s({ kind: 'wait', amount: 3, unit: 'days' }),
      s({ kind: 'message', channel: 'email', body: 'Following up on your inquiry — happy to answer any questions about {interest}.' }),
      s({ kind: 'wait', amount: 4, unit: 'days' }),
      s({ kind: 'message', channel: 'text', body: 'No rush, {first}. Reply LATER and we’ll check back next month.' }),
      s({ kind: 'action', action: 'move-stage' }),
    ]),
  },
  {
    id: 'tpl-reactivation',
    name: 'Old Lead Reactivation',
    category: 'Reactivation',
    description: 'Checks in with older leads that went quiet: “Still interested?”',
    minPlan: 'core',
    type: 'campaign',
    updatedAt: atLocal(2026, 7, 27, 11, 5),
    updatedBy: 'Jordan Ellis',
    steps: withIds('tpl-reactivation', [
      s({ kind: 'trigger', event: 'dormant' }),
      s({ kind: 'message', channel: 'text', body: 'Hi {first}, it’s {agent} at {business}. We talked a while back about {interest}. Still interested?' }),
      s({ kind: 'wait', amount: 3, unit: 'days' }),
      s({ kind: 'condition', check: 'replied' }),
      s({ kind: 'message', channel: 'email', body: 'Anything changed since we last spoke? Happy to pick this back up.' }),
      s({ kind: 'wait', amount: 7, unit: 'days' }),
      s({ kind: 'message', channel: 'text', body: 'Last check-in from me, {first}. Reply YES and I’ll reach out.' }),
      s({ kind: 'action', action: 'add-tag' }),
    ]),
  },
  {
    id: 'tpl-missed-inquiry',
    name: 'Missed Inquiry Recovery',
    category: 'Recovery',
    description: 'Texts back missed calls and after-hours inquiries before they go cold.',
    minPlan: 'scale',
    planFeature: 'Missed-call follow-up',
    type: 'sequence',
    updatedAt: atLocal(2026, 8, 2, 15, 45),
    updatedBy: 'Riley Brooks',
    steps: withIds('tpl-missed-inquiry', [
      s({ kind: 'trigger', event: 'missed-call' }),
      s({ kind: 'wait', amount: 2, unit: 'minutes' }),
      s({ kind: 'message', channel: 'text', body: 'Sorry we missed your call! This is {business}. How can we help?' }),
      s({ kind: 'condition', check: 'replied' }),
      s({ kind: 'action', action: 'notify-team' }),
      s({ kind: 'wait', amount: 1, unit: 'days' }),
      s({ kind: 'message', channel: 'text', body: 'Following up on your call yesterday — still need a hand?' }),
    ]),
  },
  {
    id: 'tpl-no-show',
    name: 'No-Show Follow-Up',
    category: 'Appointments',
    description: 'Reaches out after a missed appointment and offers new times.',
    minPlan: 'scale',
    planFeature: 'No-show recovery',
    type: 'sequence',
    updatedAt: atLocal(2026, 8, 9, 9, 40),
    updatedBy: 'Riley Brooks',
    steps: withIds('tpl-no-show', [
      s({ kind: 'trigger', event: 'no-show' }),
      s({ kind: 'wait', amount: 2, unit: 'hours' }),
      s({ kind: 'message', channel: 'text', body: 'Sorry we missed you today, {first}. Want to pick a new time?' }),
      s({ kind: 'wait', amount: 2, unit: 'days' }),
      s({ kind: 'condition', check: 'replied' }),
      s({ kind: 'message', channel: 'text', body: 'Still happy to find a time that works — just reply with a day.' }),
      s({ kind: 'action', action: 'notify-team' }),
    ]),
  },
  {
    id: 'tpl-reminder',
    name: 'Appointment Reminder',
    category: 'Appointments',
    description: 'Confirms appointments the day before, then again two hours ahead.',
    minPlan: 'core',
    planFeature: 'Basic appointment reminders',
    type: 'sequence',
    updatedAt: atLocal(2026, 6, 30, 14, 10),
    updatedBy: 'Jordan Ellis',
    steps: withIds('tpl-reminder', [
      s({ kind: 'trigger', event: 'appointment-booked' }),
      s({ kind: 'wait', amount: 1, unit: 'days', before: true }),
      s({ kind: 'message', channel: 'text', body: 'Reminder: you’re booked {day} at {time}. Reply C to confirm or R to reschedule.' }),
      s({ kind: 'condition', check: 'replied' }),
      s({ kind: 'wait', amount: 2, unit: 'hours', before: true }),
      s({ kind: 'message', channel: 'text', body: 'See you soon! Reply R if you need to reschedule.' }),
    ]),
  },
  {
    id: 'tpl-proposal',
    name: 'Proposal Follow-Up',
    category: 'Sales',
    description: 'Follows up on quotes and proposals until there’s a clear answer.',
    minPlan: 'growth',
    planFeature: 'Advanced follow-up sequences',
    type: 'sequence',
    updatedAt: atLocal(2026, 8, 18, 16, 30),
    updatedBy: 'Riley Brooks',
    steps: withIds('tpl-proposal', [
      s({ kind: 'trigger', event: 'proposal-sent' }),
      s({ kind: 'wait', amount: 2, unit: 'days' }),
      s({ kind: 'message', channel: 'email', body: 'Did you get a chance to look at the proposal? Happy to walk through it.' }),
      s({ kind: 'wait', amount: 3, unit: 'days' }),
      s({ kind: 'condition', check: 'opened-email' }),
      s({ kind: 'message', channel: 'text', body: 'Quick check-in on the proposal, {first} — any questions I can answer?' }),
      s({ kind: 'wait', amount: 5, unit: 'days' }),
      s({ kind: 'action', action: 'notify-team' }),
    ]),
  },
  {
    id: 'tpl-win-back',
    name: 'Win-Back Campaign',
    category: 'Retention',
    description: 'Brings past customers back with a timely, personal check-in.',
    minPlan: 'growth',
    planFeature: 'Advanced follow-up sequences',
    type: 'campaign',
    updatedAt: atLocal(2026, 7, 12, 13, 0),
    updatedBy: 'Jordan Ellis',
    steps: withIds('tpl-win-back', [
      s({ kind: 'trigger', event: 'past-customer' }),
      s({ kind: 'message', channel: 'email', body: 'It’s been a while, {first}! Here’s what’s new at {business}.' }),
      s({ kind: 'wait', amount: 5, unit: 'days' }),
      s({ kind: 'condition', check: 'opened-email' }),
      s({ kind: 'message', channel: 'text', body: 'Hi {first}, want first look at something new? Reply YES.' }),
      s({ kind: 'action', action: 'assign-owner' }),
    ]),
  },
]

export const templateById = (id: string) => templates.find((template) => template.id === id)

const planRank: Record<PlanId, number> = { core: 0, growth: 1, scale: 2, enterprise: 3 }
export const planAllows = (plan: PlanId, minPlan: PlanId) => planRank[plan] >= planRank[minPlan]

/** Which templates each sample client runs today. */
export const initialDeployments: Record<string, TemplateId[]> = {
  'juniper-row': ['tpl-new-lead', 'tpl-missed-inquiry', 'tpl-reactivation', 'tpl-no-show', 'tpl-reminder', 'tpl-proposal'],
  'blue-heron': ['tpl-new-lead', 'tpl-missed-inquiry', 'tpl-reactivation', 'tpl-no-show', 'tpl-reminder', 'tpl-proposal', 'tpl-win-back'],
  bellwether: ['tpl-new-lead', 'tpl-missed-inquiry', 'tpl-reactivation', 'tpl-no-show', 'tpl-reminder', 'tpl-proposal'],
  'crescent-ridge': ['tpl-new-lead', 'tpl-reactivation'],
  solstice: ['tpl-new-lead', 'tpl-missed-inquiry', 'tpl-reactivation', 'tpl-no-show', 'tpl-reminder', 'tpl-win-back'],
  marigold: ['tpl-new-lead', 'tpl-reactivation', 'tpl-reminder'],
  'calder-wynn': ['tpl-new-lead', 'tpl-missed-inquiry', 'tpl-reactivation', 'tpl-no-show', 'tpl-reminder'],
  fieldnote: ['tpl-new-lead', 'tpl-reactivation', 'tpl-proposal'],
  tallyhouse: ['tpl-new-lead', 'tpl-reactivation'],
  'wren-loom': ['tpl-new-lead', 'tpl-reactivation'],
}

/** Client-specific names, where the client renamed a template. */
const renamed: Record<string, Partial<Record<TemplateId, { name: string; audience?: string }>>> = {
  'juniper-row': {
    'tpl-missed-inquiry': { name: 'Missed Call Text-Back', audience: 'Calls that go unanswered, day or night' },
    'tpl-reactivation': { name: 'Old Lead Reactivation', audience: 'Buyers and sellers who went quiet in 2024–25' },
    'tpl-no-show': { name: 'Showing No-Show Follow-Up', audience: 'Missed showings and consultations' },
    'tpl-reminder': { name: 'Showing Reminders', audience: 'Every booked showing and consultation' },
    'tpl-proposal': { name: 'Seller Valuation Follow-Up', audience: 'Home value requests and listing proposals' },
  },
  bellwether: { 'tpl-proposal': { name: 'Estimate Follow-Up', audience: 'Replacement and repair estimates' } },
  fieldnote: { 'tpl-proposal': { name: 'Proposal Follow-Up', audience: 'Sent proposals awaiting a decision' } },
}

const defaultAudience: Record<TemplateId, string> = {
  'tpl-new-lead': 'New website, landing-page and email inquiries',
  'tpl-missed-inquiry': 'Missed calls and after-hours inquiries',
  'tpl-reactivation': 'Leads with no reply in 90+ days',
  'tpl-no-show': 'Missed appointments',
  'tpl-reminder': 'Every booked appointment',
  'tpl-proposal': 'Quotes and proposals awaiting an answer',
  'tpl-win-back': 'Past customers with no activity in 6 months',
}

const slug = (templateId: string) => templateId.replace(/^tpl-/, '')

export const automationIdFor = (clientId: string, templateId: string) => `${clientId}.${slug(templateId)}`

/**
 * The automations a client is running, built from its deployed templates.
 * `lookup` resolves template ids; the operator demo passes its own list so
 * templates created or duplicated in the tab can be deployed too.
 */
export function buildAutomations(
  client: Client,
  deployed: readonly string[] = initialDeployments[client.id] ?? [],
  lookup: (id: string) => Template | undefined = templateById,
): Automation[] {
  const list: Automation[] = []
  for (const templateId of deployed) {
    const template = lookup(templateId)
    if (!template) continue
    const override = renamed[client.id]?.[templateId as TemplateId]
    const launch = client.waves[client.waves.length - 1]
    list.push({
      id: automationIdFor(client.id, templateId),
      clientId: client.id,
      name: override?.name ?? template.name,
      type: template.type,
      audience: override?.audience ?? defaultAudience[templateId as TemplateId] ?? template.description,
      goal: template.description,
      templateId,
      enabled: client.status !== 'paused',
      steps: template.steps.map((step) => ({ ...step, id: `${client.id}.${step.id}` })),
      ...(template.type === 'campaign'
        ? { audienceSize: client.pool, launchedAt: DEMO_NOW - launch.from * DAY }
        : {}),
    })
  }
  if (client.id === 'juniper-row') {
    list.push({
      id: 'juniper-row.open-house',
      clientId: client.id,
      name: 'Open House Sign-In Follow-Up',
      type: 'sequence',
      audience: 'Visitors who sign in at an open house',
      goal: 'Thanks visitors the same evening and asks what they thought of the home.',
      enabled: false,
      steps: withIds('juniper-row.open-house', [
        { kind: 'trigger', event: 'new-lead' },
        { kind: 'wait', amount: 3, unit: 'hours' },
        { kind: 'message', channel: 'text', body: 'Thanks for stopping by the open house today, {first}! What did you think of the home?' },
        { kind: 'condition', check: 'replied' },
        { kind: 'action', action: 'assign-owner' },
      ]),
    })
  }
  return list
}

export const clientAutomations: Record<string, Automation[]> = Object.fromEntries(
  clients.map((client) => [client.id, buildAutomations(client)]),
)
