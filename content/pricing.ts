/**
 * CloseAgain plans — the single source for every price and plan fact.
 *
 * The pricing page, the homepage pricing overview, the inquiry form, the
 * break-even explainer, the FAQ, page metadata and the demo's billing views
 * all read from here. Nothing else on the site may type a price: a test fails
 * if a dollar amount appears in any other content or component file.
 *
 * Every plan fact below was supplied by the owner: prices, monthly billing
 * with no annual commitment, setup assistance, users and locations per plan,
 * channels, and each plan's feature list. Numeric usage allowances and any
 * usage fees are not set yet, so they are confirmed in the proposal, never
 * invented — see docs/open-questions.md.
 */

export type PlanId = 'core' | 'growth' | 'scale' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  /** Monthly price in USD, or null for custom pricing. */
  monthly: number | null
  tagline: string
  /** A short “For …” label above the name. */
  audience: string
  /** Who the plan suits, in one sentence. */
  bestFor: string
  /** The headline facts for a plan card: users, locations, the defining extra. */
  highlights: string[]
  /** Heading above the feature list, e.g. “Everything in Core, plus”. */
  includesLabel: string
  /** Only what this plan adds — nothing repeated from the plan below. */
  features: string[]
  cta: { label: string; href: string }
  /**
   * Emphasis for one plan, with the reason. “Most popular” is a statement
   * about customers’ choices: use it only once it is true.
   */
  recommendation?: { label: string; basis: string }
}

export const billingNote = 'Monthly billing'
export const commitmentNote = 'No annual commitment'
/** Done for you: we set up the follow-up and run it (the owner's service model). */
export const setupNote = 'Set up and run for you'

export const formatPrice = (amount: number) => `$${amount.toLocaleString('en-US')}`

export const plans: Plan[] = [
  {
    id: 'core',
    name: 'Core',
    monthly: 499,
    tagline: 'Start strong.',
    audience: 'For reliable follow-up',
    bestFor: 'Smaller established businesses that need reliable follow-up.',
    highlights: ['1 user', '1 location', 'New and old lead follow-up'],
    includesLabel: 'Includes',
    features: [
      'New lead capture',
      'Automated follow-up',
      'Old lead re-engagement',
      'Unified conversation inbox',
      'Basic appointment reminders',
      'Basic analytics',
      'Basic automation templates',
      'Standard integrations',
      'Standard support',
    ],
    cta: { label: 'Get Core', href: '/contact?plan=core' },
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 899,
    tagline: 'Build momentum.',
    audience: 'For growing teams',
    bestFor: 'Growing teams that book appointments and follow up by email and text.',
    highlights: ['3–5 users', 'Email + SMS workflows', 'CRM integrations'],
    includesLabel: 'Everything in Core, plus',
    features: [
      'Higher usage',
      'Email + SMS workflows',
      'Advanced follow-up sequences',
      'Appointment workflows',
      'Custom automation rules',
      'Lead tagging and segmentation',
      'Deeper analytics',
      'CRM integrations',
      'More automation templates',
      'Basic AI personalization',
      'Priority support',
    ],
    cta: { label: 'Get Growth', href: '/contact?plan=growth' },
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 1499,
    tagline: 'Move faster.',
    audience: 'For teams moving at volume',
    bestFor: 'Teams running several pipelines or locations that want the most automation.',
    highlights: ['10+ users', 'Multiple locations', 'Advanced AI personalization'],
    includesLabel: 'Everything in Growth, plus',
    features: [
      'Much higher usage',
      'Advanced AI personalization',
      'Custom workflows',
      'Custom sequences by lead type',
      'Multiple pipelines',
      'Team collaboration',
      'Advanced lead scoring',
      'Missed-call follow-up',
      'No-show recovery',
      'Advanced reporting',
      'Revenue and pipeline attribution',
      'API and webhook access',
      'Priority onboarding',
      'Faster support',
    ],
    cta: { label: 'Get Scale', href: '/contact?plan=scale' },
    recommendation: {
      label: 'Recommended',
      basis: 'The complete CloseAgain toolkit: multiple pipelines and locations, advanced AI and attribution.',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    tagline: 'Built around you.',
    audience: 'For complex operations',
    bestFor: 'Multi-location organizations that need custom integrations, permissions and dedicated support.',
    highlights: ['Custom usage', 'Multi-location management', 'Dedicated account manager'],
    includesLabel: 'Includes',
    features: [
      'Custom usage',
      'Custom integrations',
      'Multi-location management',
      'Advanced permissions',
      'Custom workflow builds',
      'Custom reporting',
      'Custom dashboards',
      'Dedicated account manager',
      'Dedicated onboarding',
      'SLA and priority support',
    ],
    cta: { label: 'Talk to us', href: '/contact?plan=enterprise' },
  },
]

/** The pricing page’s “what matters most?” chooser: a priority, and the plan it points to. */
export const planFinder: ReadonlyArray<{ plan: PlanId; label: string; reason: string }> = [
  {
    plan: 'core',
    label: 'Consistent follow-up',
    reason: 'Core covers new lead capture, automated follow-up and old lead re-engagement, for one user at one location.',
  },
  {
    plan: 'growth',
    label: 'Booking appointments',
    reason: 'Growth adds appointment workflows, email + SMS workflows and CRM integrations, for 3–5 users.',
  },
  {
    plan: 'scale',
    label: 'Growing a team',
    reason: 'Scale adds team collaboration for 10+ users, multiple pipelines and locations, and advanced AI personalization.',
  },
  {
    plan: 'enterprise',
    label: 'Complex operations',
    reason: 'Enterprise adds multi-location management, advanced permissions, custom builds and a dedicated account manager.',
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
export const planTerms = [startingPriceText, billingNote, commitmentNote, setupNote] as const

/**
 * What a proposal still settles before anything is billed — the only plan
 * facts not published yet (docs/open-questions.md).
 */
export const proposalCovers = ['your exact usage allowance', 'what happens above it', 'any messaging or usage fees'] as const

/**
 * The comparison, row by row, in the owner's own terms. `true` = included,
 * `false` = not included, a string = included at that level.
 *
 * Enterprise follows its own feature list; where that list is silent, its
 * cells read “Custom” and are recorded in docs/open-questions.md.
 */
export type ComparisonRow = { label: string; note?: string; values: Record<PlanId, boolean | string> }

export const comparison: Array<{ group: string; rows: ComparisonRow[] }> = [
  {
    group: 'Leads and follow-up',
    rows: [
      { label: 'New lead capture', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Automated follow-up', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Old lead re-engagement', values: { core: true, growth: true, scale: true, enterprise: true } },
      { label: 'Unified conversation inbox', values: { core: true, growth: true, scale: true, enterprise: true } },
      {
        label: 'Follow-up sequences',
        values: { core: 'Standard', growth: 'Advanced', scale: 'Custom by lead type', enterprise: 'Custom' },
      },
      { label: 'Email + SMS workflows', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Missed-call follow-up', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
    ],
  },
  {
    group: 'Automation and AI',
    rows: [
      {
        label: 'Automation templates',
        values: { core: 'Basic', growth: 'More', scale: 'More', enterprise: 'Custom' },
      },
      { label: 'Custom automation rules', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Custom workflows', values: { core: false, growth: false, scale: true, enterprise: 'Custom builds' } },
      { label: 'AI personalization', values: { core: false, growth: 'Basic', scale: 'Advanced', enterprise: 'Custom' } },
      { label: 'Lead tagging and segmentation', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'Advanced lead scoring', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
    ],
  },
  {
    group: 'Appointments',
    rows: [
      { label: 'Appointment reminders', values: { core: 'Basic', growth: true, scale: true, enterprise: true } },
      { label: 'Appointment workflows', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'No-show recovery', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
    ],
  },
  {
    group: 'Pipeline and reporting',
    rows: [
      {
        label: 'Analytics and reporting',
        values: { core: 'Basic', growth: 'Deeper', scale: 'Advanced', enterprise: 'Custom' },
      },
      { label: 'Multiple pipelines', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
      { label: 'Revenue and pipeline attribution', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
      { label: 'Custom dashboards', values: { core: false, growth: false, scale: false, enterprise: true } },
    ],
  },
  {
    group: 'Team and locations',
    rows: [
      { label: 'Users', values: { core: '1', growth: '3–5', scale: '10+', enterprise: 'Custom' } },
      { label: 'Locations', values: { core: '1', growth: '1', scale: 'Multiple', enterprise: 'Multi-location management' } },
      { label: 'Team collaboration', values: { core: false, growth: false, scale: true, enterprise: true } },
      { label: 'Advanced permissions', values: { core: false, growth: false, scale: false, enterprise: true } },
    ],
  },
  {
    group: 'Connections',
    rows: [
      { label: 'Integrations', values: { core: 'Standard', growth: 'Standard + CRM', scale: 'Standard + CRM', enterprise: 'Custom' } },
      { label: 'CRM integrations', values: { core: false, growth: true, scale: true, enterprise: true } },
      { label: 'API and webhook access', values: { core: false, growth: false, scale: true, enterprise: 'Custom' } },
    ],
  },
  {
    group: 'Usage, setup and support',
    rows: [
      {
        label: 'Usage',
        note: 'Exact allowances are confirmed in your proposal.',
        values: { core: 'Standard', growth: 'Higher', scale: 'Much higher', enterprise: 'Custom' },
      },
      {
        label: 'Setup',
        values: {
          core: 'Done for you',
          growth: 'Done for you',
          scale: 'Done for you, priority',
          enterprise: 'Dedicated onboarding',
        },
      },
      { label: 'Dedicated account manager', values: { core: false, growth: false, scale: false, enterprise: true } },
      { label: 'Support', values: { core: 'Standard', growth: 'Priority', scale: 'Faster', enterprise: 'SLA and priority' } },
      {
        label: 'Billing',
        values: { core: 'Monthly', growth: 'Monthly', scale: 'Monthly', enterprise: 'Agreed with you' },
      },
    ],
  },
]

/**
 * Which plans include a capability, derived from the comparison so the
 * features page can never disagree with the pricing page.
 *
 *   availability('Appointment workflows') → { summary: 'Growth and up' }
 *   availability('Users') → { summary: 'Every plan', levels: ['Core: 1', …] }
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

/** The facts every plan card lists in the same order, read from the comparison. */
export const specLabels = ['Users', 'Locations', 'Usage', 'Integrations', 'AI personalization', 'Setup', 'Support'] as const

/**
 * One plan's fact sheet: each row's value from the comparison, so a card can
 * never disagree with the table. `null` means not included.
 */
export function planSpecs(id: PlanId): Array<{ label: string; value: string | null }> {
  const rows = comparison.flatMap((group) => group.rows)
  return specLabels.map((label) => {
    const row = rows.find((candidate) => candidate.label === label)
    if (!row) throw new Error(`No comparison row named “${label}”`)
    const value = row.values[id]
    return { label, value: value === false ? null : value === true ? 'Included' : value }
  })
}
