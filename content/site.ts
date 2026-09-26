/**
 * Brand, navigation and shared calls to action.
 *
 * Every public word on the site lives in `content/`. Components import from
 * here, so wording can change without touching layout code.
 */

/**
 * The public origin, set per deployment with NEXT_PUBLIC_SITE_URL.
 *
 * When it is not set the site treats itself as a preview: no canonical URLs,
 * no sitemap entries, and every page asks search engines not to index it. That
 * way a preview can never become the canonical public site by accident.
 */
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')

export const site = {
  name: 'CloseAgain',
  tagline: 'The conversation isn’t over.',
  /** The one-sentence explanation. Keep it this short. */
  promise:
    'CloseAgain captures new leads, follows up automatically, and re-engages old opportunities\u00A0— so more conversations become customers.',
  description:
    'CloseAgain captures new leads, follows up automatically, and re-engages old opportunities\u00A0— so more conversations become customers.',
  origin: configuredOrigin || null,
} as const

export const isIndexable = Boolean(site.origin)

export type NavLink = { label: string; href: string }

/** Desktop header. */
export const headerNav: NavLink[] = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Features', href: '/features' },
  { label: 'Who it’s for', href: '/who-its-for' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
]

/** Mobile menu: every public page, in reading order. */
export const menuNav: NavLink[] = [
  ...headerNav,
  { label: 'After you buy', href: '/after-you-buy' },
  { label: 'About', href: '/about' },
]

export const footerGroups: Array<{ title: string; links: NavLink[] }> = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Product demo', href: '/demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Who it’s for', href: '/who-its-for' },
      { label: 'About', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'After you buy', href: '/after-you-buy' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Contact to buy', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

/** The primary call to action everywhere on the site. */
export const buyCta = { label: 'Contact to buy', href: '/contact' } as const
