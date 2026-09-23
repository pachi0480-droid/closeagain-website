/**
 * Illustrative recovery scenarios.
 *
 * These drive the hero sequence and the product recovery feed. They are demo
 * data describing how CloseAgain is designed to behave — not records of live
 * customer activity. Every surface that renders them must carry a visible
 * "illustrative" label.
 */

/** Semantic opportunity state. Drives colour, never decoration. */
export type OpportunityState = 'neutral' | 'lost' | 'engaged' | 'recovered'

export type Actor = 'system' | 'customer' | 'business'

export type RecoveryEvent = {
  /** Display timestamp, already formatted. Rendered in mono, tabular. */
  time: string
  label: string
  detail: string
  state: OpportunityState
  actor: Actor
}

export type RecordField = {
  label: string
  value: string
  state?: OpportunityState
}

export type Scenario = {
  id: string
  /** Short label for the tab control. */
  tab: string
  /** What began to slip. */
  trigger: string
  /** One line describing the moment, in plain operational language. */
  signal: string
  header: {
    kind: string
    identifier: string
    source: string
    stamp: string
  }
  events: RecoveryEvent[]
  record: RecordField[]
  result: string
}

export const scenarios: Scenario[] = [
  {
    id: 'missed-call',
    tab: 'Missed call',
    trigger: 'Inbound call missed',
    signal: 'A call comes in after hours and rings out with no voicemail.',
    header: {
      kind: 'Inbound call',
      identifier: '(352) 555-0148',
      source: 'Google LSA',
      stamp: 'Fri 6:42 PM',
    },
    events: [
      {
        time: '6:42 PM',
        label: 'Call missed',
        detail: 'After hours · no voicemail left',
        state: 'lost',
        actor: 'system',
      },
      {
        time: '6:42 PM',
        label: 'Recovery started',
        detail: 'Text sent 40 seconds after the call ended',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: '6:43 PM',
        label: 'Customer replied',
        detail: '"AC stopped cooling upstairs"',
        state: 'engaged',
        actor: 'customer',
      },
      {
        time: '6:44 PM',
        label: 'Need identified',
        detail: 'No cooling · residential · two-story',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: '6:45 PM',
        label: 'Times offered',
        detail: 'Tomorrow 9–11 AM or 1–3 PM',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: '6:47 PM',
        label: 'Booked',
        detail: 'Sat 9:00–11:00 AM · diagnostic',
        state: 'recovered',
        actor: 'customer',
      },
      {
        time: '6:47 PM',
        label: 'Handed to dispatch',
        detail: 'Written to the schedule with the full transcript',
        state: 'recovered',
        actor: 'system',
      },
    ],
    record: [
      { label: 'Source', value: 'Google LSA' },
      { label: 'Service', value: 'AC repair' },
      { label: 'Response time', value: '40 seconds' },
      { label: 'Status', value: 'Booked', state: 'recovered' },
      { label: 'Follow-up', value: 'Complete', state: 'recovered' },
    ],
    result: 'Booked · Sat 9:00–11:00 AM',
  },
  {
    id: 'estimate',
    tab: 'Cold estimate',
    trigger: 'Estimate going cold',
    signal: 'A quote has been out for two days with no reply from the customer.',
    header: {
      kind: 'Estimate #4417',
      identifier: 'Water heater replacement',
      source: 'In-home visit',
      stamp: 'Sent Mon 3:10 PM',
    },
    events: [
      {
        time: 'Mon 3:10 PM',
        label: 'Estimate sent',
        detail: '50 gal replacement · same-day install available',
        state: 'neutral',
        actor: 'business',
      },
      {
        time: 'Wed 8:58 AM',
        label: 'No response for 48 hours',
        detail: 'One follow-up sent · nothing scheduled',
        state: 'lost',
        actor: 'system',
      },
      {
        time: 'Wed 9:00 AM',
        label: 'Recovery started',
        detail: 'Follow-up sent with a direct question attached',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: 'Wed 9:26 AM',
        label: 'Customer replied',
        detail: '"Still deciding — is financing an option?"',
        state: 'engaged',
        actor: 'customer',
      },
      {
        time: 'Wed 9:27 AM',
        label: 'Question routed',
        detail: 'Financing request flagged for the office, not guessed at',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: 'Thu 8:05 AM',
        label: 'Estimate approved',
        detail: 'Approved after the office answered on financing',
        state: 'recovered',
        actor: 'customer',
      },
      {
        time: 'Thu 8:06 AM',
        label: 'Install scheduled',
        detail: 'Thu next week · 7:00–9:00 AM',
        state: 'recovered',
        actor: 'system',
      },
    ],
    record: [
      { label: 'Source', value: 'In-home estimate' },
      { label: 'Service', value: 'Water heater replacement' },
      { label: 'Days cold', value: '2' },
      { label: 'Status', value: 'Approved', state: 'recovered' },
      { label: 'Follow-up', value: 'Complete', state: 'recovered' },
    ],
    result: 'Approved · install scheduled',
  },
  {
    id: 'no-show',
    tab: 'No-show',
    trigger: 'Appointment not kept',
    signal: 'The technician is at the door and nobody is home.',
    header: {
      kind: 'Appointment',
      identifier: 'Diagnostic · 8–10 AM',
      source: 'Phone booking',
      stamp: 'Tue 7:50 AM',
    },
    events: [
      {
        time: '7:50 AM',
        label: 'Arrival window opened',
        detail: 'Technician en route · 8–10 AM',
        state: 'neutral',
        actor: 'business',
      },
      {
        time: '8:34 AM',
        label: 'No contact at the door',
        detail: 'Customer not home · call unanswered',
        state: 'lost',
        actor: 'system',
      },
      {
        time: '8:36 AM',
        label: 'Recovery started',
        detail: 'Text sent while the truck is still in the area',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: '8:41 AM',
        label: 'Customer replied',
        detail: '"Sorry — got called into work"',
        state: 'engaged',
        actor: 'customer',
      },
      {
        time: '8:42 AM',
        label: 'Rebook offered',
        detail: 'Same-day 2–4 PM held against current capacity',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: '8:44 AM',
        label: 'Rebooked',
        detail: 'Today 2:00–4:00 PM confirmed',
        state: 'recovered',
        actor: 'customer',
      },
      {
        time: '8:44 AM',
        label: 'Route updated',
        detail: 'Dispatch notified · morning window released',
        state: 'recovered',
        actor: 'system',
      },
    ],
    record: [
      { label: 'Source', value: 'Phone booking' },
      { label: 'Service', value: 'Diagnostic' },
      { label: 'Time to rebook', value: '10 minutes' },
      { label: 'Status', value: 'Rebooked', state: 'recovered' },
      { label: 'Follow-up', value: 'Complete', state: 'recovered' },
    ],
    result: 'Rebooked · same day, 2:00–4:00 PM',
  },
  {
    id: 'old-lead',
    tab: 'Old lead',
    trigger: 'Dormant opportunity',
    signal: 'A lead asked to be contacted later. Later never came.',
    header: {
      kind: 'Dormant opportunity',
      identifier: 'Duct replacement · 1,900 sq ft',
      source: 'CRM · 94 days',
      stamp: 'Last contact Jun 12',
    },
    events: [
      {
        time: 'Jun 12',
        label: 'Last contact',
        detail: '"Check back after the summer"',
        state: 'neutral',
        actor: 'business',
      },
      {
        time: '94 days',
        label: 'No activity',
        detail: 'Record untouched · no task, no reminder',
        state: 'lost',
        actor: 'system',
      },
      {
        time: 'Sep 14 9:12 AM',
        label: 'Reactivation started',
        detail: 'Seasonal follow-up sent on the timing they asked for',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: 'Sep 14 9:48 AM',
        label: 'Customer replied',
        detail: '"Yes — can someone come look this week?"',
        state: 'engaged',
        actor: 'customer',
      },
      {
        time: 'Sep 14 9:49 AM',
        label: 'Need reconfirmed',
        detail: 'Duct replacement · scope unchanged',
        state: 'engaged',
        actor: 'system',
      },
      {
        time: 'Sep 14 9:52 AM',
        label: 'Estimate visit booked',
        detail: 'Fri 11:00 AM–1:00 PM · comfort advisor',
        state: 'recovered',
        actor: 'customer',
      },
      {
        time: 'Sep 14 9:53 AM',
        label: 'Handed to the office',
        detail: 'Advisor assigned · original notes attached',
        state: 'recovered',
        actor: 'system',
      },
    ],
    record: [
      { label: 'Source', value: 'CRM · dormant' },
      { label: 'Service', value: 'Duct replacement' },
      { label: 'Days dormant', value: '94' },
      { label: 'Status', value: 'Estimate booked', state: 'recovered' },
      { label: 'Follow-up', value: 'Active', state: 'engaged' },
    ],
    result: 'Back in the pipeline · estimate booked',
  },
]

export const heroScenario = scenarios[0]
