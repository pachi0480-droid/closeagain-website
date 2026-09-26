/**
 * Types for the product demo's sample data. Everything under content/demo is
 * fictional: businesses, people, messages and numbers are invented for the
 * demo and never leave the visitor's browser tab.
 */

import type { PlanId } from '../pricing.ts'
import type { KitId } from './kits.ts'

export type Industry = 'Real estate' | 'Home services' | 'Med spa' | 'Law' | 'Agency' | 'SaaS' | 'E-commerce'

/** Conversation pipeline stages, in order. */
export type StageId = 'new' | 'active' | 'qualified' | 'appointment' | 'closed' | 'reengage'
export type Outcome = 'won' | 'lost'

export type SourceId = 'web-form' | 'landing-page' | 'phone' | 'email' | 'crm' | 'import' | 'referral'

/** How a message travelled. `web` is the form submission itself; `call` is a team call note. */
export type Channel = 'text' | 'email' | 'web' | 'call'
export type Sender = 'lead' | 'closeagain' | 'team'

export type Message = {
  id: string
  from: Sender
  /** Team member name for `team` messages. */
  author?: string
  channel: Channel
  /** Epoch milliseconds. */
  at: number
  body: string
  /** The automation that sent an automated message. */
  via?: string
}

export type Lead = {
  id: string
  clientId: string
  name: string
  first: string
  email: string
  phone: string
  source: SourceId
  /** What the person asked about, in their words. */
  interest: string
  tags: string[]
  /** 0–100, higher is warmer. */
  score: number
  stage: StageId
  outcome?: Outcome
  createdAt: number
  /** When the lead entered its current automation (reactivation starts later than creation). */
  enrolledAt: number
  /** An older or quiet lead that replied again after a CloseAgain follow-up. */
  recoveredAt?: number
  repliedAt?: number
  lastContactAt: number
  owner: string
  automationId: string
  /** Automated messages sent to this lead. */
  sent: number
  /** Estimated deal value in USD. */
  value: number
  nextAction: string
  nextAt?: number
  channel: 'text' | 'email'
  appointmentId?: string
  /** The newest message is from the lead and nobody has looked at it yet. */
  unread: boolean
  thread: Message[]
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'no-show' | 'cancelled'

export type Appointment = {
  id: string
  clientId: string
  leadId: string
  leadName: string
  type: string
  start: number
  durationMin: number
  location: string
  host: string
  status: AppointmentStatus
  bookedAt: number
}

export type TriggerEvent =
  | 'new-lead'
  | 'missed-call'
  | 'no-reply'
  | 'dormant'
  | 'appointment-booked'
  | 'no-show'
  | 'proposal-sent'
  | 'past-customer'

export type ConditionCheck = 'replied' | 'booked' | 'opened-email' | 'business-hours' | 'score-above-70'
export type ActionKind = 'assign-owner' | 'move-stage' | 'notify-team' | 'add-tag' | 'book-appointment' | 'stop'

export type Step =
  | { id: string; kind: 'trigger'; event: TriggerEvent }
  /** `before` waits count back from the appointment instead of forward from the previous step. */
  | { id: string; kind: 'wait'; amount: number; unit: 'minutes' | 'hours' | 'days'; before?: boolean }
  | { id: string; kind: 'message'; channel: 'text' | 'email'; body: string }
  | { id: string; kind: 'condition'; check: ConditionCheck }
  | { id: string; kind: 'action'; action: ActionKind }

export type StepKind = Step['kind']

export type AutomationType = 'sequence' | 'campaign'

export type Automation = {
  id: string
  clientId: string
  name: string
  type: AutomationType
  /** Who enters it, in plain words. */
  audience: string
  goal: string
  templateId?: string
  enabled: boolean
  steps: Step[]
  /** Campaigns only: people selected for the push. */
  audienceSize?: number
  launchedAt?: number
}

export type IntegrationId =
  | 'web-forms'
  | 'landing-pages'
  | 'crm'
  | 'calendar'
  | 'email-inbox'
  | 'phone-text'
  | 'webhooks'
  | 'spreadsheet'

export type IntegrationStatus = 'connected' | 'available' | 'attention'

export type ClientStatus = 'active' | 'onboarding' | 'paused'

export type Person = { name: string; role: string; email: string }

export type Client = {
  id: string
  name: string
  short: string
  industry: Industry
  plan: PlanId
  /**
   * Enterprise pricing is custom, so Enterprise sample clients carry an
   * explicit sample contract value. Every other client is billed the plan
   * price from content/pricing.ts.
   */
  contractMonthly?: number
  status: ClientStatus
  statusNote?: string
  since: number
  location: string
  billingDay: number
  team: Person[]
  integrations: Record<IntegrationId, IntegrationStatus>
  kit: KitId
  /** Average new leads per day, used to generate the sample history. */
  rate: number
  /** Relative change in lead volume across the 90-day history (+0.2 = growing 20%). */
  trend: number
  /** Share of recent leads replying to follow-up, 0–1. */
  replyRate: number
  /** Older leads available for re-engagement, and when reactivation waves went out (days ago). */
  pool: number
  waves: Array<{ from: number; to: number; share: number }>
  paused?: { at: number; reason: string }
}

export type Task = {
  id: string
  leadId: string
  title: string
  detail: string
  due: number
  priority: 'high' | 'normal'
}

export type Invoice = {
  id: string
  clientId: string
  period: string
  issuedAt: number
  amount: number
  plan: PlanId
  status: 'paid' | 'failed' | 'open' | 'refunded'
  note?: string
}

export type PlanChange = { id: string; clientId: string; from: PlanId; to: PlanId; at: number }
