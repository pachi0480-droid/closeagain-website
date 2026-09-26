/**
 * CloseAgain plans — the single source for prices and plan contents.
 *
 * Used by the pricing page, the homepage pricing band, the contact form's plan
 * picker, and the operator dashboard's billing views. Change a price or a
 * feature here and every surface follows.
 */

export type PlanId = 'core' | 'growth' | 'scale' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  /** Monthly price in USD, or null for custom pricing. */
  monthly: number | null
  priceLabel: string
  tagline: string
  audience?: string
  /** Heading above the feature list, e.g. “Everything in Core, plus”. */
  includesLabel: string
  features: string[]
  cta: { label: string; href: string }
  highlight?: string
}

export const billingNote = 'Monthly billing'
export const setupNote = 'Setup assistance included'
export const startingPrice = 499

export const plans: Plan[] = [
  {
    id: 'core',
    name: 'Core',
    monthly: 499,
    priceLabel: '$499',
    tagline: 'Start strong.',
    audience: 'For smaller businesses that need reliable lead capture and follow-up.',
    includesLabel: 'Includes',
    features: [
      'New lead capture',
      'Automated follow-up',
      'Old lead re-engagement',
      'Conversation inbox',
      'Basic reporting',
      'Standard integrations',
      'Standard support',
    ],
    cta: { label: 'Get Core', href: '/contact?plan=core' },
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 899,
    priceLabel: '$899',
    tagline: 'Build momentum.',
    includesLabel: 'Everything in Core, plus',
    features: [
      'Advanced automations',
      'Additional integrations',
      'Custom follow-up sequences',
      'Appointment workflows',
      'Advanced analytics',
      'Higher usage',
      'Priority support',
    ],
    cta: { label: 'Get Growth', href: '/contact?plan=growth' },
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 1499,
    priceLabel: '$1,499',
    tagline: 'Move faster.',
    includesLabel: 'Everything in Growth, plus',
    features: [
      'Higher usage limits',
      'Custom workflows',
      'Multi-user collaboration',
      'Advanced reporting',
      'Pipeline customization',
      'Priority onboarding',
      'Priority support',
    ],
    cta: { label: 'Get Scale', href: '/contact?plan=scale' },
    // A claim about customers' choices: keep it only while it is true.
    highlight: 'Most popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    priceLabel: 'Custom',
    tagline: 'Built around you.',
    includesLabel: 'Includes',
    features: [
      'Custom usage',
      'Custom integrations',
      'Multi-location support',
      'Advanced permissions',
      'Custom workflows',
      'Dedicated onboarding',
      'Custom reporting',
      'Priority support',
    ],
    cta: { label: 'Talk to us', href: '/contact?plan=enterprise' },
  },
]

export const planById = (id: string | null | undefined) => plans.find((plan) => plan.id === id)

/** “Growth — $899/month”, “Enterprise — custom pricing”. */
export const planSummary = (plan: Plan) =>
  plan.monthly === null ? `${plan.name} — custom pricing` : `${plan.name} — ${plan.priceLabel}/month`

/**
 * The comparison matrix. `true` = included, `false` = not included, a string
 * = included with that qualifier. Enterprise cells describe its own list;
 * confirm anything marked “Custom” with the team before quoting it.
 */
export const comparison: Array<{
  group: string
  rows: Array<{ label: string; values: Record<PlanId, boolean | string> }>
}> = [
  {
    group: 'Leads and follow-up',
    rows: [
      { label: 'New lead capture', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Automated follow-up', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Old lead re-engagement', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Conversation inbox', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Custom follow-up sequences', values: { core: false, growth: true, scale: true, enterprise: true } },
    ],
  },
  {
    group: 'Workflows',
    rows: [
      { label: 'Advanced automations', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Appointment workflows', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Custom workflows', values: { core: false, growth: false, scale: true, enterprise: true } },
      { label: 'Pipeline customization', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
    ],
  },
  {
    group: 'Insight',
    rows: [
      {
        label: 'Reporting',
        values: { core: 'Basic', growth: 'Advanced analytics', scale: 'Advanced reporting', enterprise: 'Custom reporting' },
      },
    ],
  },
  {
    group: 'Team and scale',
    rows: [
      { label: 'Usage', values: { core: 'Standard', growth: 'Higher', scale: 'Higher limits', enterprise: 'Custom' } },
      { label: 'Multi-user collaboration', values: { core: false, growth: false, scale: true, enterprise: true } },
      { label: 'Advanced permissions', values: { core: false, growth: false, scale: false, enterprise: true } },
      { label: 'Multi-location support', values: { core: false, growth: false, scale: false, enterprise: true } },
    ],
  },
  {
    group: 'Connections and support',
    rows: [
      {
        label: 'Integrations',
        values: { core: 'Standard', growth: 'Additional', scale: 'Additional', enterprise: 'Custom' },
      },
      {
        label: 'Onboarding',
        values: {
          core: 'Setup assistance',
          growth: 'Setup assistance',
          scale: 'Priority onboarding',
          enterprise: 'Dedicated onboarding',
        },
      },
      { label: 'Support', values: { core: 'Standard', growth: 'Priority', scale: 'Priority', enterprise: 'Priority' } },
    ],
  },
]
