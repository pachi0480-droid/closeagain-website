/**
 * CloseAgain plans — the single source for every price and plan fact.
 *
 * The pricing page, the homepage pricing overview, the inquiry form, the
 * break-even explainer, page metadata and the demo's billing views all read
 * from here. Nothing else on the site may type a price: a test fails if a
 * dollar amount appears in any other content or component file.
 *
 * What is confirmed: the four prices, monthly billing, setup assistance on
 * every plan, and each plan's feature list as supplied by the owner. What is
 * not: numeric allowances, seat counts, supported channels, overage and
 * contract terms — see docs/open-questions.md. Those are described as
 * “confirmed in your proposal”, never invented.
 */

export type PlanId = 'core' | 'growth' | 'scale' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  /** Monthly price in USD, or null for custom pricing. */
  monthly: number | null
  tagline: string
  /** “Best for …” — who the plan suits. */
  bestFor: string
  /** What this plan adds over the one before it, in one sentence. */
  step: string
  /** Heading above the feature list, e.g. “Everything in Core, plus”. */
  includesLabel: string
  /** Only what this plan adds — nothing repeated from the plan below. */
  features: string[]
  cta: { label: string; href: string }
  /** A recommendation with its reason. Never a popularity claim. */
  recommendation?: { label: string; basis: string }
}

export const billingNote = 'Billed monthly'
export const setupNote = 'Setup assistance included'

export const formatPrice = (amount: number) => `$${amount.toLocaleString('en-US')}`

export const plans: Plan[] = [
  {
    id: 'core',
    name: 'Core',
    monthly: 499,
    tagline: 'Start strong.',
    bestFor: 'Smaller businesses that need every inquiry answered and followed up, reliably.',
    step: 'Follow-up for new inquiries and older leads, with one inbox for replies.',
    includesLabel: 'Includes',
    features: [
      'New inquiry capture',
      'Automated follow-up',
      'Older lead re-engagement',
      'Conversation inbox',
      'Basic reporting',
      'Standard integrations',
      'Standard support',
    ],
    cta: { label: 'Choose Core', href: '/contact?plan=core' },
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 899,
    tagline: 'Build momentum.',
    bestFor: 'Businesses that book appointments and want follow-up shaped around their own process.',
    step: 'Adds custom follow-up sequences, appointment workflows and advanced automations.',
    includesLabel: 'Everything in Core, plus',
    features: [
      'Custom follow-up sequences',
      'Appointment workflows',
      'Advanced automations',
      'Advanced analytics',
      'Additional integrations',
      'Higher usage allowance',
      'Priority support',
    ],
    cta: { label: 'Choose Growth', href: '/contact?plan=growth' },
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 1499,
    tagline: 'Move faster.',
    bestFor: 'Teams where several people work leads and need workflows and pipeline stages of their own.',
    step: 'Adds multi-user collaboration, custom workflows and pipeline customization.',
    includesLabel: 'Everything in Growth, plus',
    features: [
      'Multi-user collaboration',
      'Custom workflows',
      'Pipeline customization',
      'Advanced reporting',
      'Higher usage limits',
      'Priority onboarding',
    ],
    cta: { label: 'Choose Scale', href: '/contact?plan=scale' },
    recommendation: {
      label: 'Recommended for teams',
      basis: 'The first plan where several people can work leads together.',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    tagline: 'Built around you.',
    bestFor: 'Multi-location organizations with their own integration, permission and reporting needs.',
    step: 'Scoped around your locations, permissions, integrations and reporting.',
    includesLabel: 'Includes',
    features: [
      'Multi-location support',
      'Advanced permissions',
      'Custom integrations',
      'Custom workflows',
      'Custom reporting',
      'Custom usage',
      'Dedicated onboarding',
      'Priority support',
    ],
    cta: { label: 'Talk to us', href: '/contact?plan=enterprise' },
  },
]

export const planById = (id: string | null | undefined) => plans.find((plan) => plan.id === id)

/** “$899”, or “Custom”. */
export const priceLabel = (plan: Plan) => (plan.monthly === null ? 'Custom' : formatPrice(plan.monthly))

/** “$899/month”, or “custom pricing”. */
export const pricePerMonth = (plan: Plan) =>
  plan.monthly === null ? 'custom pricing' : `${formatPrice(plan.monthly)}/month`

/** “Growth — $899/month”, “Enterprise — custom pricing”. */
export const planSummary = (plan: Plan) => `${plan.name} — ${pricePerMonth(plan)}`

const listed = plans.flatMap((plan) => (plan.monthly === null ? [] : [plan.monthly]))

/** The lowest listed monthly price. */
export const startingMonthly = Math.min(...listed)

/** “Plans start at $499/month”. */
export const startingPriceText = `Plans start at ${formatPrice(startingMonthly)}/month`

/** The short terms line used beside calls to action. */
export const planTerms = [startingPriceText, billingNote, setupNote] as const

/**
 * What a proposal settles before anything is billed. These are the facts the
 * public site does not state, because they have not been confirmed yet.
 */
export const proposalCovers = [
  'Which channels CloseAgain will use for your business',
  'Your included usage, and what happens if you go over it',
  'How many people on your team can use it',
  'Any setup or additional charges',
  'The minimum term and how to cancel',
] as const

/**
 * The comparison, row by row, in the owner's own terms. `true` = included,
 * `false` = not included, a string = included at that level.
 *
 * Enterprise is scoped individually; its cells follow its own feature list.
 * Cells marked “Custom” for Enterprise are inferred from that list and are
 * recorded in docs/open-questions.md.
 */
export type ComparisonRow = { label: string; note?: string; values: Record<PlanId, boolean | string> }

export const comparison: Array<{ group: string; rows: ComparisonRow[] }> = [
  {
    group: 'Follow-up',
    rows: [
      { label: 'New inquiry capture', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Automated follow-up', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Older lead re-engagement', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Conversation inbox', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Custom follow-up sequences', values: { core: false, growth: true, scale: true, enterprise: true } },
    ],
  },
  {
    group: 'Next steps and workflows',
    rows: [
      { label: 'Appointment workflows', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Advanced automations', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Custom workflows', values: { core: false, growth: false, scale: true, enterprise: true } },
      { label: 'Pipeline customization', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
    ],
  },
  {
    group: 'Reporting',
    rows: [
      {
        label: 'Reporting level',
        values: { core: 'Basic', growth: 'Advanced analytics', scale: 'Advanced reporting', enterprise: 'Custom reporting' },
      },
    ],
  },
  {
    group: 'Team and locations',
    rows: [
      { label: 'Multi-user collaboration', values: { core: false, growth: false, scale: true, enterprise: true } },
      { label: 'Advanced permissions', values: { core: false, growth: false, scale: false, enterprise: true } },
      { label: 'Multi-location support', values: { core: false, growth: false, scale: false, enterprise: true } },
    ],
  },
  {
    group: 'Usage, setup and support',
    rows: [
      {
        label: 'Usage allowance',
        note: 'Exact allowances are confirmed in your proposal.',
        values: { core: 'Included', growth: 'Higher', scale: 'Higher limits', enterprise: 'Custom' },
      },
      {
        label: 'Integrations',
        note: 'Tell us your tools; fit is confirmed before you commit.',
        values: { core: 'Standard', growth: 'Additional', scale: 'Additional', enterprise: 'Custom' },
      },
      {
        label: 'Setup',
        values: {
          core: 'Setup assistance',
          growth: 'Setup assistance',
          scale: 'Priority onboarding',
          enterprise: 'Dedicated onboarding',
        },
      },
      { label: 'Support', values: { core: 'Standard', growth: 'Priority', scale: 'Priority', enterprise: 'Priority' } },
      { label: 'Billing', values: { core: 'Monthly', growth: 'Monthly', scale: 'Monthly', enterprise: 'Agreed individually' } },
    ],
  },
]

/**
 * Which plans include a capability, derived from the comparison so the
 * features page can never disagree with the pricing page.
 *
 *   availability('Appointment workflows') → { summary: 'Growth and up' }
 *   availability('Reporting level') → { summary: 'Every plan', levels: [...] }
 */
export function availability(label: string): { summary: string; levels?: string[] } {
  const row = comparison.flatMap((group) => group.rows).find((candidate) => candidate.label === label)
  if (!row) throw new Error(`No comparison row named “${label}”`)
  const included = plans.filter((plan) => row.values[plan.id] !== false)
  const first = included[0]
  const fromFirstUp = plans.slice(plans.indexOf(first))
  const summary =
    included.length === plans.length
      ? 'Every plan'
      : included.length === fromFirstUp.length && fromFirstUp.every((plan, i) => included[i] === plan)
        ? first.id === 'enterprise'
          ? 'Enterprise'
          : `${first.name} and up`
        : included.map((plan) => plan.name).join(', ')
  const levels = included.every((plan) => typeof row.values[plan.id] === 'string')
    ? included.map((plan) => `${plan.name}: ${String(row.values[plan.id]).toLowerCase()}`)
    : undefined
  return { summary, levels }
}
