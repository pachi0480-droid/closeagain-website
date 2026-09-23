/** Product capabilities. Outcome first, mechanism second. */

export type Capability = {
  id: string
  index: string
  name: string
  body: string
  /** Where in the lifecycle this sits, shown as a small mono tag. */
  stage: string
}

export const capabilities: Capability[] = [
  {
    id: 'missed-call',
    index: '01',
    name: 'Missed Call Recovery',
    stage: 'First contact',
    body: 'Engage the calls that would otherwise have ended at voicemail — after hours, during a rush, or while everyone is on another line.',
  },
  {
    id: 'lead-response',
    index: '02',
    name: 'Lead Response',
    stage: 'First contact',
    body: 'Answer new demand in seconds instead of hours, so the lead you paid for is not still waiting when a competitor calls.',
  },
  {
    id: 'estimate',
    index: '03',
    name: 'Estimate Follow-Up',
    stage: 'Decision',
    body: 'Keep quoted work from dying quietly. Persistent, specific follow-up on the opportunities that are already qualified.',
  },
  {
    id: 'appointment',
    index: '04',
    name: 'Appointment Recovery',
    stage: 'Scheduled work',
    body: 'Reduce what is lost between booking and arrival — confirmations before the window, and a real attempt to rebook when a slot falls through.',
  },
  {
    id: 'reactivation',
    index: '05',
    name: 'Lead Reactivation',
    stage: 'Dormant demand',
    body: 'Bring older opportunities back into live conversations, on the timing the customer originally asked for.',
  },
  {
    id: 'intelligence',
    index: '06',
    name: 'Recovery Intelligence',
    stage: 'Visibility',
    body: 'See where opportunities leak, where CloseAgain stepped in, and what came back — by source, by service, by month.',
  },
]
