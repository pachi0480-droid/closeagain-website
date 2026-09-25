/**
 * The three scenarios behind "One inquiry. Every next action."
 *
 * Interactive product scenarios: they describe how CloseAgain is designed to
 * behave, not a transcript of a real customer conversation. The module is
 * labelled once, at the section level.
 */

import type { SignalState } from './signals'

export type ScenarioStep = {
  /** Already formatted for display. Rendered in mono, tabular. */
  time: string
  /** The operational event. */
  label: string
  /** What was said, when something was said. */
  quote?: string
  /** Structured facts established at this step. */
  facts?: { label: string; value: string }[]
  state: SignalState
  /** Who moved: shapes the alignment and weight of the step. */
  actor: 'customer' | 'system' | 'business'
}

export type LeadScenario = {
  id: string
  /** Short label for the tab control. */
  tab: string
  /** The entry condition, in one line. */
  entry: string
  source: string
  steps: ScenarioStep[]
  resolution: {
    headline: string
    detail: string
    when: string
  }
}

export const leadScenarios: LeadScenario[] = [
  {
    id: 'new-inquiry',
    tab: 'New inquiry',
    entry: 'A website form arrives at 9:42 PM, after the office has closed.',
    source: 'Website · Ocala, FL',
    steps: [
      {
        time: '9:42 PM',
        label: 'Signal received',
        quote: 'My AC stopped cooling tonight.',
        state: 'new',
        actor: 'customer',
      },
      {
        time: '9:42 PM',
        label: 'Conversation opened',
        quote:
          'We can help. Is the system completely off, or is it running without cooling?',
        state: 'active',
        actor: 'system',
      },
      {
        time: '9:43 PM',
        label: 'Service need confirmed',
        facts: [
          { label: 'Issue', value: 'No cooling' },
          { label: 'Property', value: 'Residential' },
          { label: 'Occupancy', value: 'Occupied home' },
        ],
        state: 'active',
        actor: 'system',
      },
      {
        time: '9:44 PM',
        label: 'Service area verified',
        facts: [{ label: 'Location', value: 'Ocala, Florida' }],
        state: 'active',
        actor: 'system',
      },
      {
        time: '9:44 PM',
        label: 'Appointment options prepared',
        facts: [
          { label: 'Tomorrow', value: '8:00–10:00 AM' },
          { label: 'Tomorrow', value: '10:00 AM–12:00 PM' },
        ],
        state: 'active',
        actor: 'system',
      },
    ],
    resolution: {
      headline: 'Booking path ready',
      detail: 'AC diagnostic',
      when: 'Tomorrow · 8:00 AM',
    },
  },
  {
    id: 'missed-call',
    tab: 'Missed call',
    entry: 'A call rings out at 9:12 PM. No voicemail is left.',
    source: 'Google LSA · inbound call',
    steps: [
      {
        time: '9:12 PM',
        label: 'Call missed',
        facts: [
          { label: 'Duration', value: '18 seconds, unanswered' },
          { label: 'Voicemail', value: 'None left' },
        ],
        state: 'risk',
        actor: 'customer',
      },
      {
        time: '9:12 PM',
        label: 'Text sent to the caller',
        quote:
          'Sorry we missed you. This is the service line — what is going on with the system?',
        state: 'active',
        actor: 'system',
      },
      {
        time: '9:19 PM',
        label: 'Reply received',
        quote: 'No heat since this afternoon. House is at 58.',
        state: 'active',
        actor: 'customer',
      },
      {
        time: '9:20 PM',
        label: 'Urgency assessed',
        facts: [
          { label: 'Issue', value: 'No heat' },
          { label: 'Priority', value: 'Same-day' },
        ],
        state: 'active',
        actor: 'system',
      },
      {
        time: '9:21 PM',
        label: 'Earliest window offered',
        facts: [{ label: 'Tomorrow', value: '7:00–9:00 AM' }],
        state: 'active',
        actor: 'system',
      },
    ],
    resolution: {
      headline: 'Booking path ready',
      detail: 'No-heat service call',
      when: 'Tomorrow · 7:00 AM',
    },
  },
  {
    id: 'cold-estimate',
    tab: 'Cold estimate',
    entry: 'A roof replacement estimate was sent, and nothing came back.',
    source: 'Estimate · $14,200',
    steps: [
      {
        time: 'Day 0',
        label: 'Estimate sent',
        facts: [
          { label: 'Scope', value: 'Roof replacement' },
          { label: 'Value', value: '$14,200' },
        ],
        state: 'active',
        actor: 'business',
      },
      {
        time: 'Day 6',
        label: '6 days quiet',
        facts: [{ label: 'Last activity', value: 'Estimate opened, no reply' }],
        state: 'risk',
        actor: 'system',
      },
      {
        time: 'Day 6',
        label: 'Follow-up due',
        quote:
          'Checking in on the roof estimate — is it the timing, the scope, or the payment side that needs work?',
        state: 'active',
        actor: 'system',
      },
      {
        time: 'Day 6',
        label: 'Question identified',
        quote: 'Mostly the cost up front. Can it be split?',
        state: 'active',
        actor: 'customer',
      },
      {
        time: 'Day 6',
        label: 'Review call requested',
        facts: [
          { label: 'Purpose', value: 'Walk through financing' },
          { label: 'Friday', value: '11:00 AM' },
        ],
        state: 'active',
        actor: 'system',
      },
    ],
    resolution: {
      headline: 'Opportunity moving again',
      detail: 'Estimate review call',
      when: 'Friday · 11:00 AM',
    },
  },
]
