/** Product capabilities. Outcome first, mechanism second. */

export type Capability = {
  id: string
  index: string
  name: string
  /** Short line used on the homepage grid. */
  body: string
  /** Where in the lifecycle this sits, shown as a small mono tag. */
  stage: string
  /** Inclusive 1-based span across LIFECYCLE for the coverage map. */
  span: [number, number]
  /** The deep-dive shown on /product. */
  detail: {
    /** The moment that sets it off. */
    trigger: string
    /** What CloseAgain does about it. */
    action: string
    /** What the operator can see afterwards. */
    visible: string
    /** The line a customer would actually receive or say. */
    example: string
  }
}

/** The path a job takes from demand to work on the board. */
export const LIFECYCLE = [
  'Lead arrives',
  'First contact',
  'Qualified',
  'Quoted',
  'Scheduled',
] as const

export const capabilities: Capability[] = [
  {
    id: 'missed-call',
    index: '01',
    name: 'Missed Call Recovery',
    stage: 'First contact',
    span: [1, 2],
    body: 'Engage the calls that would otherwise have ended at voicemail — after hours, during a rush, or while everyone is on another line.',
    detail: {
      trigger:
        'A call to your business line rings out, hits voicemail, or is abandoned before anyone picks up.',
      action:
        'A text goes back to the caller within seconds, from your number, asking what they need. The conversation continues from there rather than waiting for a callback nobody has time to make.',
      visible:
        'Every missed call, whether it came back or not, with the reply time and what happened next.',
      example: '"Sorry we missed you — this is Whitfield Heating. What is going on with the system?"',
    },
  },
  {
    id: 'lead-response',
    index: '02',
    name: 'Lead Response',
    stage: 'First contact',
    span: [1, 2],
    body: 'Answer new demand in seconds instead of hours, so the lead you paid for is not still waiting when a competitor calls.',
    detail: {
      trigger:
        'A form, chat, marketplace lead or referral lands while your office is busy, closed, or already on the phone.',
      action:
        'The lead is answered immediately and asked the questions your team would ask, so it arrives at dispatch already understood instead of as a name and a number.',
      visible:
        'Time to first response by source, so you can see which channels you are actually answering.',
      example: '"Got your request about the panel. Is the breaker tripping under load, or at random?"',
    },
  },
  {
    id: 'estimate',
    index: '03',
    name: 'Estimate Follow-Up',
    stage: 'Decision',
    span: [4, 5],
    body: 'Keep quoted work from dying quietly. Persistent, specific follow-up on the opportunities that are already qualified.',
    detail: {
      trigger:
        'A quote has been out for a set number of days with no decision and no scheduled work behind it.',
      action:
        'Follow-up goes out on a cadence that does not stop after one try, asking a real question rather than "just checking in". Anything about price or scope is routed to your team.',
      visible:
        'Every open estimate, how long it has been quiet, and which ones came back after follow-up.',
      example: '"Still thinking it over on the water heater? Happy to walk through the two options."',
    },
  },
  {
    id: 'appointment',
    index: '04',
    name: 'Appointment Recovery',
    stage: 'Scheduled work',
    span: [5, 5],
    body: 'Reduce what is lost between booking and arrival — confirmations before the window, and a real attempt to rebook when a slot falls through.',
    detail: {
      trigger:
        'A booked appointment is approaching, or a technician arrives and cannot reach the customer.',
      action:
        'Confirmation before the window so the slot is not wasted, and an immediate rebook attempt while the truck is still nearby when nobody is home.',
      visible:
        'No-show rate, how much of it was recovered same day, and the windows that were released back.',
      example: '"We are outside now and can wait a few minutes — or grab you this afternoon instead?"',
    },
  },
  {
    id: 'reactivation',
    index: '05',
    name: 'Lead Reactivation',
    stage: 'Dormant demand',
    span: [1, 3],
    body: 'Bring older opportunities back into live conversations, on the timing the customer originally asked for.',
    detail: {
      trigger:
        'An opportunity has gone quiet past the point your team would normally chase it, or the date the customer asked to be contacted has arrived.',
      action:
        'The conversation restarts on the timing the customer set, not on a generic blast, and anyone who responds re-enters the normal booking path.',
      visible:
        'How much dormant demand exists, how much was worked, and what it produced.',
      example: '"You asked us to check back after the summer — want to get the duct work scoped?"',
    },
  },
  {
    id: 'intelligence',
    index: '06',
    name: 'Recovery Intelligence',
    stage: 'Visibility',
    span: [1, 5],
    body: 'See where opportunities leak, where CloseAgain stepped in, and what came back — by source, by service, by month.',
    detail: {
      trigger:
        'Runs continuously across everything above rather than waiting to be asked.',
      action:
        'Each recovered opportunity is attributed to the moment it was slipping and the workflow that caught it, so recovery is measured rather than assumed.',
      visible:
        'Where revenue leaks by source and service, what recovery returned, and which moments are still costing you.',
      example: 'Missed-call recovery · 5 minutes from missed to booked · diagnostic booked',
    },
  },
]

/**
 * Integration posture.
 *
 * Nothing here is built yet and nothing here is claimed as available. These
 * are categories of system CloseAgain is being designed around, and they are
 * labelled as intent, not as capability.
 */
export const integrationTargets = [
  {
    category: 'Phone and messaging',
    note: 'The line customers already call, and the number replies come from.',
  },
  {
    category: 'Lead sources',
    note: 'Search, local services, marketplaces, your own site forms and referrals.',
  },
  {
    category: 'Scheduling and dispatch',
    note: 'So a recovered opportunity becomes a real window on a real board.',
  },
  {
    category: 'Estimates and quoting',
    note: 'So follow-up knows what was quoted, when, and whether it moved.',
  },
] as const
