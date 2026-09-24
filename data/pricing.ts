/**
 * Monthly pricing only. There is deliberately no annual option, no annual
 * discount and no usage caps: plans differ by how much of the lead lifecycle
 * CloseAgain is recovering, not by metered volume.
 */

export type Plan = {
  id: string
  name: string
  /** Null means "quoted". */
  price: number | null
  priceLabel?: string
  audience: string
  /** Capability depth, not invented numeric limits. */
  includes: string[]
  recommended?: boolean
}

export const plans: Plan[] = [
  {
    id: 'core',
    name: 'Core',
    price: 499,
    audience: 'For businesses beginning to recover missed inbound opportunities.',
    includes: [
      'Missed Call Recovery',
      'Lead Response',
      'Booking handoff to your schedule',
      'Recovery reporting',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 899,
    audience: 'For teams that want recovery across more of the lead lifecycle.',
    includes: [
      'Everything in Core',
      'Estimate Follow-Up',
      'Appointment Recovery',
      'Recovery attribution by source and service',
    ],
    recommended: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 1499,
    audience:
      'For high-volume operators that need deeper routing, visibility and recovery workflows.',
    includes: [
      'Everything in Growth',
      'Lead Reactivation',
      'Advanced routing and escalation rules',
      'Full Recovery Intelligence',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    priceLabel: 'Custom',
    audience:
      'For complex operations, larger organizations and custom implementation requirements.',
    includes: [
      'Everything in Scale',
      'Custom recovery workflow design',
      'Implementation support',
      'Commercial terms to match your operation',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* What each plan covers                                                      */
/* -------------------------------------------------------------------------- */

/** A cell is included, excluded, or qualified with a short word. */
export type MatrixCell = boolean | string

export type MatrixGroup = {
  group: string
  rows: {
    label: string
    /** In plan order: Core, Growth, Scale, Enterprise. */
    values: [MatrixCell, MatrixCell, MatrixCell, MatrixCell]
  }[]
}

/**
 * Plans differ by how much of the lead lifecycle is being recovered — not by
 * metered volume. There are deliberately no message, minute, seat or location
 * counts here, because those numbers do not exist yet and inventing them would
 * be the fastest way to mislead an operator.
 */
export const planMatrix: MatrixGroup[] = [
  {
    group: 'Recovery coverage',
    rows: [
      { label: 'Missed Call Recovery', values: [true, true, true, true] },
      { label: 'Lead Response', values: [true, true, true, true] },
      { label: 'Estimate Follow-Up', values: [false, true, true, true] },
      { label: 'Appointment Recovery', values: [false, true, true, true] },
      { label: 'Lead Reactivation', values: [false, false, true, true] },
    ],
  },
  {
    group: 'Routing and control',
    rows: [
      { label: 'Booking handoff to your schedule', values: [true, true, true, true] },
      { label: 'After-hours and business-hours rules', values: [true, true, true, true] },
      { label: 'Advanced routing and escalation', values: [false, false, true, true] },
      { label: 'Custom recovery workflow design', values: [false, false, false, true] },
    ],
  },
  {
    group: 'Visibility',
    rows: [
      { label: 'Recovery reporting', values: [true, true, true, true] },
      { label: 'Attribution by source and service', values: [false, true, true, true] },
      { label: 'Full Recovery Intelligence', values: [false, false, true, true] },
    ],
  },
  {
    group: 'Getting started',
    rows: [
      { label: 'Setup', values: ['Guided', 'Guided', 'Guided', 'Managed'] },
      { label: 'Implementation support', values: [false, false, false, true] },
      { label: 'Commercial terms', values: ['Standard', 'Standard', 'Standard', 'Custom'] },
    ],
  },
]

/** Questions that only come up once someone is looking at the price. */
export const pricingFaq = [
  {
    id: 'billing',
    q: 'How does billing work?',
    a: 'Monthly, per business. There is no annual plan, no annual discount and no annual commitment — partly because a recovery tool should be easy to stop paying for if it is not recovering anything.',
  },
  {
    id: 'limits',
    q: 'Are there usage limits?',
    a: 'None are being set at these prices. Plans differ by how much of the lead lifecycle CloseAgain is working, not by how many messages you are rationed. If that changes before launch, it will be stated here rather than buried.',
  },
  {
    id: 'pilot',
    q: 'What does the pilot cost?',
    a: 'Pilot terms are agreed directly, and confirmed in writing before anything is set up. Nobody gets billed for a system that has not been connected to their business yet.',
  },
  {
    id: 'switching',
    q: 'Can we change plans?',
    a: 'Yes, month to month in either direction. The plans are layers of the same engine, so moving between them changes what is running rather than migrating you onto something new.',
  },
  {
    id: 'whichplan',
    q: 'Which plan should we start on?',
    a: 'Most operators leak the most at first contact, which is Core. If estimates or no-shows are the bigger hole in your month, start at Growth. We would rather tell you that on a call than sell you a tier you do not need yet.',
  },
]
