/**
 * The recovery engine.
 *
 * Five layers, one opportunity. The important property of this data is that
 * it is cumulative: each stage *adds* to the same record rather than replacing
 * it, because the point of the section is that we are watching one opportunity
 * change — not five unrelated cards.
 */

export type LoopStage = {
  id: string
  index: string
  title: string
  summary: string
  /** The layer's job, in three words, shown on its plate. */
  plate: string
  /** Facts this layer attaches to the record. */
  adds: { label: string; value: string }[]
  state: 'lost' | 'engaged' | 'recovered'
}

export const loopStages: LoopStage[] = [
  {
    id: 'detect',
    index: '01',
    title: 'Detect',
    plate: 'Notices it slipping',
    summary:
      'An opportunity starts slipping. A call rings out, a form sits unanswered, an estimate goes quiet, an appointment is missed. CloseAgain is built to notice the moment it happens rather than at the end of the week.',
    adds: [
      { label: 'Signal', value: 'Inbound call missed' },
      { label: 'Detected', value: '6:42 PM · 40s after ring-out' },
      { label: 'Source', value: 'Google LSA · after hours' },
    ],
    state: 'lost',
  },
  {
    id: 'respond',
    index: '02',
    title: 'Respond',
    plate: 'Opens the channel',
    summary:
      'The matching recovery workflow opens immediately. A missed call is answered differently from a cold estimate, and after-hours is handled differently from a Tuesday morning. Speed is the part your team cannot win on manually.',
    adds: [
      { label: 'Workflow', value: 'Missed-call recovery' },
      { label: 'Channel', value: 'SMS · from your business line' },
    ],
    state: 'engaged',
  },
  {
    id: 'understand',
    index: '03',
    title: 'Understand',
    plate: 'Works out the job',
    summary:
      'The customer answers in their own words. CloseAgain works out what they actually need, what kind of job it is, and how urgent it is — and asks the questions your office would have asked.',
    adds: [
      { label: 'Customer said', value: '"AC stopped cooling upstairs"' },
      { label: 'Need', value: 'No cooling · residential' },
      { label: 'Urgency', value: 'Next available' },
    ],
    state: 'engaged',
  },
  {
    id: 'move-forward',
    index: '04',
    title: 'Move forward',
    plate: 'Pushes to an action',
    summary:
      'Every recovered conversation is pushed toward one specific next action — a booked window, a callback, a decision on an estimate. Not a chat log for somebody to read later.',
    adds: [
      { label: 'Offered', value: 'Sat 9–11 AM · Sat 1–3 PM' },
      { label: 'Chosen', value: 'Sat 9:00–11:00 AM' },
    ],
    state: 'recovered',
  },
  {
    id: 'track',
    index: '05',
    title: 'Track',
    plate: 'Makes it countable',
    summary:
      'You see which opportunities were slipping, what CloseAgain did, and what came back. Recovery you cannot measure is indistinguishable from luck.',
    adds: [
      { label: 'Attributed to', value: 'Missed-call recovery' },
      { label: 'Elapsed', value: '5 minutes · missed to booked' },
      { label: 'Outcome', value: 'Diagnostic booked' },
    ],
    state: 'recovered',
  },
]

/** Everything attached to the record up to and including `active`. */
export function recordThrough(active: number) {
  return loopStages
    .slice(0, active + 1)
    .flatMap((stage) => stage.adds.map((row) => ({ ...row, stage: stage.index })))
}

/** Total rows, so the record can reserve its full height and never reflow. */
export const RECORD_ROWS = loopStages.reduce((n, s) => n + s.adds.length, 0)
