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
