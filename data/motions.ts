/**
 * Chapter three: the two revenue motions that converge on booked work.
 */

export type MotionSource = { label: string; detail: string }

export type Motion = {
  id: 'new' | 'recovered'
  eyebrow: string
  title: string
  copy: string
  sources: MotionSource[]
}

export const motions: Motion[] = [
  {
    id: 'new',
    eyebrow: 'Motion 01',
    title: 'New demand',
    copy: 'Create and capture new demand, respond while intent is high, and move every qualified inquiry toward the right next step.',
    sources: [
      { label: 'Local search', detail: 'Maps and service-area results' },
      { label: 'Campaigns', detail: 'Seasonal and service-specific' },
      { label: 'Website', detail: 'Forms and chat' },
      { label: 'Phone calls', detail: 'Answered and missed' },
      { label: 'Referrals', detail: 'Homeowner and trade' },
      { label: 'Paid lead sources', detail: 'Marketplaces and LSA' },
    ],
  },
  {
    id: 'recovered',
    eyebrow: 'Motion 02',
    title: 'Recovered demand',
    copy: 'Detect opportunities that went quiet, restore context, and restart the conversation with a useful next action.',
    sources: [
      { label: 'Missed calls', detail: 'After hours and overflow' },
      { label: 'Cold estimates', detail: 'Sent, opened, never answered' },
      { label: 'No-shows', detail: 'Appointments nobody attended' },
      { label: 'Dormant leads', detail: 'Contacted once, then dropped' },
      { label: 'Previous customers', detail: 'Due for service again' },
      { label: 'Abandoned inquiries', detail: 'Closed out too early' },
    ],
  },
]

/** What both motions resolve into. */
export const convergence = {
  label: 'Booked work',
  detail: 'One operating system, one queue, one next action per opportunity.',
} as const
