/**
 * Chapter five: the Revenue Command Center.
 *
 * Illustrative product preview. The metrics are obvious demo values inside a
 * conceptual interface — they are not a customer's performance, and nothing
 * here is presented as proof.
 */

import type { SignalState } from './signals'

export type Metric = {
  label: string
  value: string
  /** Sub-label giving the value its unit or period. */
  note: string
  state?: SignalState
}

export const metrics: Metric[] = [
  { label: 'Active opportunities', value: '38', note: 'In the queue now', state: 'active' },
  { label: 'At-risk value', value: '$46,900', note: 'Losing momentum', state: 'risk' },
  { label: 'Follow-up due', value: '11', note: 'Next action ready', state: 'waiting' },
  { label: 'Booked this period', value: '$128,400', note: 'Last 30 days', state: 'booked' },
]

export type Row = {
  id: string
  opportunity: string
  state: SignalState
  source: string
  time: string
  value: number
  action: string
  /** The expanded panel, shown when the row is selected. */
  detail: {
    currentState: string
    lastActivity: string
    nextAction: string
  }
}

export const rows: Row[] = [
  {
    id: 'roof',
    opportunity: 'Roof replacement',
    state: 'risk',
    source: 'Existing estimate',
    time: '6d',
    value: 14200,
    action: 'Offer estimate review',
    detail: {
      currentState: 'Estimate quiet',
      lastActivity: '6 days ago',
      nextAction:
        'Offer a short estimate review and clarify financing questions.',
    },
  },
  {
    id: 'ac',
    opportunity: 'AC replacement',
    state: 'active',
    source: 'In-home estimate',
    time: '1h',
    value: 9400,
    action: 'Send financing options',
    detail: {
      currentState: 'Awaiting options',
      lastActivity: '1 hour ago',
      nextAction:
        'Send the two financing options discussed at the visit, with the monthly figure on each.',
    },
  },
  {
    id: 'water-heater',
    opportunity: 'Water heater repair',
    state: 'new',
    source: 'Local search',
    time: '18m',
    value: 890,
    action: 'Confirm arrival window',
    detail: {
      currentState: 'Qualified, unscheduled',
      lastActivity: '18 minutes ago',
      nextAction:
        'Confirm the service area and offer the two remaining windows today.',
    },
  },
  {
    id: 'panel',
    opportunity: 'Panel inspection',
    state: 'booked',
    source: 'Referral',
    time: 'Today',
    value: 1450,
    action: 'Confirmed',
    detail: {
      currentState: 'Booked',
      lastActivity: 'Confirmed today',
      nextAction: 'Arrival reminder sends the morning of the visit.',
    },
  },
  {
    id: 'membership',
    opportunity: 'Membership renewal',
    state: 'waiting',
    source: 'Past customer',
    time: '2d',
    value: 320,
    action: 'Waiting on pricing',
    detail: {
      currentState: 'Waiting on the team',
      lastActivity: '2 days ago',
      nextAction:
        'Team to confirm this year’s plan pricing before the renewal goes out.',
    },
  },
]

export type ActivityItem = { time: string; label: string; state: SignalState }

export const activity: ActivityItem[] = [
  { time: '09:44', label: 'Inquiry qualified', state: 'active' },
  { time: '09:31', label: 'Estimate reopened', state: 'active' },
  { time: '09:18', label: 'Appointment option selected', state: 'active' },
  { time: '08:52', label: 'Follow-up due', state: 'risk' },
  { time: '08:40', label: 'Opportunity booked', state: 'booked' },
  { time: '08:12', label: 'Missed call answered', state: 'active' },
]
