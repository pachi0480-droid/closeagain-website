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
  email: 'Closeagainhq@gmail.com',
  tagline: 'The conversation isn’t over.',
  /** What CloseAgain is, in four words. */
  category: 'Automated lead follow-up and recovery',
  /** The one-paragraph explanation. Keep it this short. */
  promise:
    'Turn more of the leads you already have into paying customers. CloseAgain follows up with new inquiries and re-engages older leads, helping your team book more appointments and close more sales.',
  description:
    'CloseAgain follows up with new inquiries and re-engages older leads automatically, helping your team book more appointments and close more sales.',
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
  { label: 'Getting started', href: '/getting-started' },
  { label: 'About', href: '/about' },
]

export const footerGroups: Array<{ title: string; links: NavLink[] }> = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Sample dashboard', href: '/demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Who it’s for', href: '/who-its-for' },
      { label: 'About', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Getting started', href: '/getting-started' },
    ],
  },
  {
    title: 'Next step',
    links: [
      { label: 'See if it fits', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

/**
 * The primary call to action everywhere on the site. It opens an inquiry —
 * a conversation about fit, scope and plan — not a checkout, and says so.
 */
export const primaryCta = { label: 'See if it fits', href: '/contact' } as const

/** The quieter route for visitors who want to understand the service first. */
export const learnCta = { label: 'See how it works', href: '/how-it-works' } as const
