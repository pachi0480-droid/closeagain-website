/** Display names for the demo's enums, in one place. */

import type { AppointmentStatus, Channel, ClientStatus, IntegrationStatus, SourceId, StageId, Step } from '@/content/demo/types'

export const stageLabel: Record<StageId, string> = {
  new: 'New lead',
  active: 'Active conversation',
  qualified: 'Qualified',
  appointment: 'Appointment',
  closed: 'Closed',
  reengage: 'Re-engage',
}

export const stageShort: Record<StageId, string> = {
  new: 'New',
  active: 'Active',
  qualified: 'Qualified',
  appointment: 'Appointment',
  closed: 'Closed',
  reengage: 'Re-engage',
}

export const sourceLabel: Record<SourceId, string> = {
  'web-form': 'Website form',
  'landing-page': 'Landing page',
  phone: 'Phone & text',
  email: 'Email inbox',
  crm: 'CRM',
  import: 'Spreadsheet import',
  referral: 'Referral',
}

export const channelLabel: Record<Channel, string> = {
  text: 'Text',
  email: 'Email',
  web: 'Web form',
  call: 'Call note',
}

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  completed: 'Completed',
  'no-show': 'No-show',
  cancelled: 'Cancelled',
}

export const integrationStatusLabel: Record<IntegrationStatus, string> = {
  connected: 'Connected',
  available: 'Available',
  attention: 'Needs attention',
}

export const clientStatusLabel: Record<ClientStatus, string> = {
  active: 'Active',
  onboarding: 'Onboarding',
  paused: 'Paused',
}

export const triggerLabel: Record<Extract<Step, { kind: 'trigger' }>['event'], string> = {
  'new-lead': 'A new lead arrives',
  'missed-call': 'A call goes unanswered',
  'no-reply': 'A lead stops replying',
  dormant: 'A lead has been quiet 90+ days',
  'appointment-booked': 'An appointment is booked',
  'no-show': 'Someone misses an appointment',
  'proposal-sent': 'A quote or proposal is sent',
  'past-customer': 'A past customer goes quiet',
}

export const conditionLabel: Record<Extract<Step, { kind: 'condition' }>['check'], string> = {
  replied: 'Stop if they replied',
  booked: 'Stop if they booked',
  'opened-email': 'Continue only if the email was opened',
  'business-hours': 'Only during business hours',
  'score-above-70': 'Only if lead score is above 70',
}

export const actionLabel: Record<Extract<Step, { kind: 'action' }>['action'], string> = {
  'assign-owner': 'Assign to the lead’s owner',
  'move-stage': 'Move to Re-engage',
  'notify-team': 'Notify the team',
  'add-tag': 'Tag as Recovered',
  'book-appointment': 'Offer booking times',
  stop: 'End the sequence',
}

export const stepKindLabel: Record<Step['kind'], string> = {
  trigger: 'Trigger',
  wait: 'Wait',
  message: 'Message',
  condition: 'Condition',
  action: 'Action',
}

export function describeWait(step: Extract<Step, { kind: 'wait' }>): string {
  const unit = step.amount === 1 ? step.unit.replace(/s$/, '') : step.unit
  return step.before ? `${step.amount} ${unit} before the appointment` : `Wait ${step.amount} ${unit}`
}

export function describeStep(step: Step): string {
  switch (step.kind) {
    case 'trigger':
      return triggerLabel[step.event]
    case 'wait':
      return describeWait(step)
    case 'message':
      return `${step.channel === 'text' ? 'Text' : 'Email'}: ${step.body}`
    case 'condition':
      return conditionLabel[step.check]
    case 'action':
      return actionLabel[step.action]
  }
}
