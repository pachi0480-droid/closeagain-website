/**
 * The shared signal vocabulary.
 *
 * Every opportunity on this site — in the hero field, the radar, and the
 * command centre — is described by the same six facts and the same six
 * states. One vocabulary means the visitor learns the language once.
 *
 * All of it is demo data describing how CloseAgain is designed to behave.
 * It is not a record of live customer activity. Modules that render it carry
 * the label from `labels` in `data/site.ts`.
 */

/**
 * Semantic state. Colour follows from this and never the other way round.
 * `label` exists so a state is never communicated by colour alone.
 */
export type SignalState = 'new' | 'active' | 'booked' | 'risk' | 'quiet' | 'waiting'

export const stateMeta: Record<
  SignalState,
  { label: string; colour: string; text: string; glyph: string }
> = {
  new: {
    label: 'New',
    colour: 'var(--color-new)',
    text: 'text-new',
    glyph: '◆',
  },
  active: {
    label: 'Active',
    colour: 'var(--color-signal)',
    text: 'text-signal',
    glyph: '●',
  },
  booked: {
    label: 'Booked',
    colour: 'var(--color-booked)',
    text: 'text-booked',
    glyph: '✓',
  },
  risk: {
    label: 'At risk',
    colour: 'var(--color-risk)',
    text: 'text-risk',
    glyph: '▲',
  },
  quiet: {
    label: 'Quiet',
    colour: 'var(--color-quiet)',
    text: 'text-quiet',
    glyph: '○',
  },
  waiting: {
    label: 'Waiting on team',
    colour: 'var(--color-info)',
    text: 'text-info',
    glyph: '◇',
  },
}

/** The filter groups offered on the radar. */
export type SignalKind =
  | 'new-demand'
  | 'missed-call'
  | 'estimate'
  | 'no-show'
  | 'past-customer'

export const kindMeta: Record<SignalKind, string> = {
  'new-demand': 'New demand',
  'missed-call': 'Missed calls',
  estimate: 'Estimates',
  'no-show': 'No-shows',
  'past-customer': 'Past customers',
}

export type Signal = {
  id: string
  /** What the work is. */
  opportunity: string
  /** Where it entered from. */
  source: string
  kind: SignalKind
  state: SignalState
  /** Time since last activity, already formatted. */
  since: string
  /** Estimated value in dollars. Demo figure. */
  value: number
  /** The single next action CloseAgain assigns. */
  action: string
  /** Position on the radar field, 0–100 in both axes. */
  x: number
  y: number
}

/**
 * The radar population. Positions are authored rather than random so the
 * field reads as a considered composition at every viewport.
 */
export const signals: Signal[] = [
  {
    id: 'roof-replacement',
    opportunity: 'Roof replacement',
    source: 'Existing estimate',
    kind: 'estimate',
    state: 'risk',
    since: '6 days quiet',
    value: 14200,
    action:
      'Ask whether equipment, financing, or timing is blocking the decision.',
    x: 24,
    y: 30,
  },
  {
    id: 'ac-not-cooling',
    opportunity: 'AC not cooling',
    source: 'Website inquiry',
    kind: 'new-demand',
    state: 'new',
    since: '2 minutes ago',
    value: 480,
    action: 'Open the conversation and confirm whether the system runs at all.',
    x: 62,
    y: 18,
  },
  {
    id: 'ac-replacement',
    opportunity: 'AC replacement',
    source: 'In-home estimate',
    kind: 'estimate',
    state: 'active',
    since: '1 hour ago',
    value: 9400,
    action: 'Send the two financing options discussed at the visit.',
    x: 46,
    y: 52,
  },
  {
    id: 'after-hours-call',
    opportunity: 'Heating repair',
    source: 'Missed call · 9:12 PM',
    kind: 'missed-call',
    state: 'risk',
    since: '14 hours ago',
    value: 620,
    action: 'Call back first thing and offer the morning arrival window.',
    x: 15,
    y: 66,
  },
  {
    id: 'water-heater',
    opportunity: 'Water heater repair',
    source: 'Local search',
    kind: 'new-demand',
    state: 'active',
    since: '18 minutes ago',
    value: 890,
    action: 'Confirm the service area and prepare today’s arrival windows.',
    x: 74,
    y: 41,
  },
  {
    id: 'panel-inspection',
    opportunity: 'Panel inspection',
    source: 'Referral',
    kind: 'new-demand',
    state: 'booked',
    since: 'Booked today',
    value: 1450,
    action: 'Confirmed for Thursday, 1:00–3:00 PM.',
    x: 88,
    y: 72,
  },
  {
    id: 'duct-cleaning',
    opportunity: 'Duct cleaning',
    source: 'Past customer · 11 months',
    kind: 'past-customer',
    state: 'quiet',
    since: '11 months',
    value: 540,
    action: 'Offer the pre-season service before the schedule fills.',
    x: 34,
    y: 84,
  },
  {
    id: 'window-estimate',
    opportunity: 'Window replacement',
    source: 'Appointment · no-show',
    kind: 'no-show',
    state: 'risk',
    since: '3 days ago',
    value: 7800,
    action: 'Offer two new windows and confirm the decision-maker can attend.',
    x: 58,
    y: 76,
  },
  {
    id: 'membership',
    opportunity: 'Membership renewal',
    source: 'Past customer',
    kind: 'past-customer',
    state: 'waiting',
    since: 'Awaiting pricing',
    value: 320,
    action: 'Team to confirm this year’s plan pricing before it goes out.',
    x: 78,
    y: 92,
  },
  {
    id: 'storm-inspection',
    opportunity: 'Storm inspection',
    source: 'Campaign response',
    kind: 'new-demand',
    state: 'active',
    since: '40 minutes ago',
    value: 0,
    action: 'Qualify the roof age and confirm the insurance claim status.',
    x: 10,
    y: 14,
  },
  {
    id: 'restoration',
    opportunity: 'Water damage',
    source: 'Missed call · 2:41 AM',
    kind: 'missed-call',
    state: 'booked',
    since: 'Booked 6:02 AM',
    value: 11600,
    action: 'Crew dispatched, arrival confirmed with the homeowner.',
    x: 92,
    y: 26,
  },
  {
    id: 'drain-quote',
    opportunity: 'Sewer line quote',
    source: 'Estimate sent',
    kind: 'estimate',
    state: 'quiet',
    since: '9 days quiet',
    value: 6300,
    action: 'Reopen with the camera findings and a narrower scope option.',
    x: 40,
    y: 8,
  },
]

/**
 * The hero field. A smaller, looser population than the radar: these exist to
 * establish the language, not to be inspected. Each one enters, holds, and a
 * few resolve to booked.
 */
export type HeroSignal = {
  id: string
  kind: string
  detail: string
  place: string
  state: SignalState
  status: string
  stamp: string
  /** Placement in the field, as a percentage of its box. */
  x: number
  y: number
  /** Seconds of delay before it enters. */
  enter: number
}

export const heroSignals: HeroSignal[] = [
  {
    id: 'h1',
    kind: 'New inquiry',
    detail: 'AC not cooling',
    place: 'Ocala · Website',
    state: 'new',
    status: 'Awaiting response',
    stamp: '09:42 PM',
    x: 3,
    y: 5,
    enter: 0.2,
  },
  {
    id: 'h2',
    kind: 'Open estimate',
    detail: 'Roof replacement',
    place: 'Estimate sent',
    state: 'risk',
    status: 'Follow-up due',
    stamp: '6 days quiet',
    x: 0,
    y: 58,
    enter: 1.4,
  },
  {
    id: 'h3',
    kind: 'Missed call',
    detail: 'Heating repair',
    place: 'Google LSA',
    state: 'risk',
    status: 'Call back due',
    stamp: '09:12 PM',
    x: 57,
    y: 62,
    enter: 2.6,
  },
  {
    id: 'h4',
    kind: 'Service request',
    detail: 'Water heater leaking',
    place: 'Local search',
    state: 'active',
    status: 'Qualifying',
    stamp: '09:44 PM',
    x: 63,
    y: 3,
    enter: 3.4,
  },
  {
    id: 'h5',
    kind: 'Past customer',
    detail: 'Duct cleaning',
    place: '11 months',
    state: 'quiet',
    status: 'Reopen',
    stamp: 'Dormant',
    x: 8,
    y: 32,
    enter: 4.2,
  },
  {
    id: 'h6',
    kind: 'Referral',
    detail: 'Panel inspection',
    place: 'Ocala',
    state: 'booked',
    status: 'Booked',
    stamp: 'Thu 1:00 PM',
    x: 66,
    y: 32,
    enter: 5.0,
  },
]
