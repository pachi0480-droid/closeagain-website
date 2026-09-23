/** The five stages of the recovery loop, used by the sticky scroll sequence. */

export type LoopStage = {
  id: string
  index: string
  title: string
  summary: string
  /** The four things this stage watches or does, shown as operational rows. */
  rows: { label: string; value: string }[]
  /** State of the opportunity at the end of this stage. */
  state: 'lost' | 'engaged' | 'recovered'
}

export const loopStages: LoopStage[] = [
  {
    id: 'detect',
    index: '01',
    title: 'Detect',
    summary:
      'An opportunity starts slipping. A call rings out, a form sits unanswered, an estimate goes quiet, an appointment is missed. CloseAgain is built to notice the moment it happens rather than at the end of the week.',
    rows: [
      { label: 'Signal', value: 'Inbound call missed' },
      { label: 'Detected', value: '6:42 PM · 40s after ring-out' },
      { label: 'Context', value: 'Google LSA · after hours' },
      { label: 'Opportunity', value: 'Unqualified · at risk' },
    ],
    state: 'lost',
  },
  {
    id: 'respond',
    index: '02',
    title: 'Respond',
    summary:
      'The matching recovery workflow opens immediately. A missed call is answered differently from a cold estimate, and after-hours is handled differently from a Tuesday morning. Speed is the part your team cannot win on manually.',
    rows: [
      { label: 'Workflow', value: 'Missed-call recovery' },
      { label: 'Channel', value: 'SMS · from your business line' },
      { label: 'Sent', value: '6:42 PM' },
      { label: 'Opportunity', value: 'Contacted · awaiting reply' },
    ],
    state: 'engaged',
  },
  {
    id: 'understand',
    index: '03',
    title: 'Understand',
    summary:
      'The customer answers in their own words. CloseAgain works out what they actually need, what kind of job it is, and how urgent it is — and asks the questions your office would have asked.',
    rows: [
      { label: 'Customer said', value: '"AC stopped cooling upstairs"' },
      { label: 'Need', value: 'No cooling · residential' },
      { label: 'Urgency', value: 'Next available' },
      { label: 'Opportunity', value: 'Qualified' },
    ],
    state: 'engaged',
  },
  {
    id: 'move-forward',
    index: '04',
    title: 'Move forward',
    summary:
      'Every recovered conversation is pushed toward one specific next action — a booked window, a callback, a decision on an estimate. Not a chat log for somebody to read later.',
    rows: [
      { label: 'Offered', value: 'Sat 9–11 AM · Sat 1–3 PM' },
      { label: 'Chosen', value: 'Sat 9:00–11:00 AM' },
      { label: 'Handoff', value: 'Dispatch · with transcript' },
      { label: 'Opportunity', value: 'Booked' },
    ],
    state: 'recovered',
  },
  {
    id: 'track',
    index: '05',
    title: 'Track',
    summary:
      'You see which opportunities were slipping, what CloseAgain did, and what came back. Recovery you cannot measure is indistinguishable from luck.',
    rows: [
      { label: 'Attributed to', value: 'Missed-call recovery' },
      { label: 'Elapsed', value: '5 minutes · missed to booked' },
      { label: 'Outcome', value: 'Diagnostic booked' },
      { label: 'Opportunity', value: 'Recovered' },
    ],
    state: 'recovered',
  },
]
