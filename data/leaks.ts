/**
 * The five moments where revenue leaves a home-service business after the
 * customer has already raised their hand. Written as incident records rather
 * than feature descriptions.
 */

export type LeakMoment = {
  id: string
  index: string
  title: string
  time: string
  source: string
  job: string
  /** Two beats: what happened, then what it cost. */
  scene: [string, string]
  outcome: string
  /**
   * How far along the path from interest to booked revenue the opportunity
   * got before it stopped moving. 0 = first contact, 1 = booked.
   */
  progress: number
}

export const leaks: LeakMoment[] = [
  {
    id: 'missed-call',
    progress: 0.08,
    index: '01',
    title: 'The call nobody answered',
    time: '18:42',
    source: 'Google LSA',
    job: 'No cooling · residential',
    scene: [
      'A homeowner calls at 6:42 on a Friday evening. Nobody is in the office.',
      'They do not leave a voicemail. They call the next company on the list.',
    ],
    outcome: 'Lost before a conversation started',
  },
  {
    id: 'slow-response',
    progress: 0.26,
    index: '02',
    title: 'The reply that came too late',
    time: '11:07',
    source: 'Website form',
    job: 'Panel upgrade quote',
    scene: [
      'A form comes in mid-morning. Dispatch is buried. Someone will get to it.',
      'By the time the call goes out at 4pm, two other companies have already answered.',
    ],
    outcome: 'Intent expired while the lead sat in a queue',
  },
  {
    id: 'cold-estimate',
    progress: 0.68,
    index: '03',
    title: 'The estimate that went quiet',
    time: '09:15',
    source: 'In-home visit',
    job: 'Water heater replacement',
    scene: [
      'The quote goes out the same day. The customer says they need to talk it over.',
      'One follow-up goes out. Then the week gets busy and nobody asks again.',
    ],
    outcome: 'A qualified buyer, never asked a second time',
  },
  {
    id: 'no-show',
    progress: 0.84,
    index: '04',
    title: 'The appointment that evaporated',
    time: '07:50',
    source: 'Phone booking',
    job: 'Diagnostic · 8–10 AM',
    scene: [
      'The slot was held. The truck was routed. Nobody confirmed the night before.',
      'The technician arrives to an empty house and the day loses two hours.',
    ],
    outcome: 'Capacity spent, nothing booked',
  },
  {
    id: 'old-lead',
    progress: 0.34,
    index: '05',
    title: 'The lead that said "not yet"',
    time: '—',
    source: 'CRM · 94 days',
    job: 'Duct replacement',
    scene: [
      '"Check back after the summer." It gets written down. It does not get scheduled.',
      'Ninety-four days later the record is still sitting there, still unworked.',
    ],
    outcome: 'Demand you already paid for, going stale',
  },
]
