/**
 * Single source of truth for brand, navigation, CTA language and contact
 * details. Everything here is safe to edit without touching a component.
 */

export const LAUNCH_STATE = 'pre-launch' as const

export const site = {
  name: 'CloseAgain',
  category: 'Demand-to-Revenue Infrastructure for Home Services',
  promise: 'Every opportunity gets a next action.',
  description:
    'CloseAgain brings in new opportunities, works every response while intent is high, and reopens the leads, calls, and estimates that went quiet.',

  // TODO(launch): replace with the real inbox before the site goes public.
  email: 'hello@closeagain.com',

  // TODO(launch): set NEXT_PUBLIC_SITE_URL in the deploy environment.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://closeagain.com',
} as const

/**
 * Chapter anchors on the homepage. Section components import these so an id
 * can never drift out of agreement with the link that targets it.
 */
export const chapter = {
  demo: 'demo',
  motions: 'motions',
  radar: 'radar',
  command: 'command',
  calculator: 'calculator',
  industries: 'industries',
  pricing: 'pricing',
  audit: 'audit',
} as const

export const nav = [
  { label: 'System', href: '/#motions' },
  { label: 'Product', href: '/product' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Pricing', href: '/pricing' },
] as const

export const cta = {
  primary: 'Find My Revenue Gap',
  secondary: 'Watch a Lead Get Closed',
  /** In-page target. Every content route renders the audit form. */
  target: '#audit',
  /** Chrome target: the header and footer also render on legal pages. */
  chromeTarget: '/#audit',
  demoTarget: '#demo',
  chromeDemoTarget: '/#demo',
} as const

export const footerLinks = {
  site: [
    { label: 'System', href: '/#motions' },
    { label: 'Product', href: '/product' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Pricing', href: '/pricing' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
} as const

/**
 * The honesty labels. Exactly one per conceptual module — the modules import
 * from here so the wording cannot multiply across the page.
 */
export const labels = {
  scenario: 'Interactive product scenario',
  preview: 'Illustrative product preview',
  estimate:
    'Scenario estimate only. Results depend on demand quality, capacity, customer intent, implementation, and follow-up.',
} as const
