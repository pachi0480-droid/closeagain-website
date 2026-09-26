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
  description:
    'CloseAgain helps businesses follow up with missed inquiries and older leads, so the right conversations get a second chance.',
  origin: configuredOrigin || null,
} as const

export const isIndexable = Boolean(site.origin)

export type NavLink = { label: string; href: string }

/** Desktop header. Kept to three links on purpose — the reference is sparse. */
export const headerNav: NavLink[] = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Who it’s for', href: '/who-its-for' },
  { label: 'Contact', href: '/contact' },
]

/** Mobile menu: every public page, in reading order. */
export const menuNav: NavLink[] = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Who it’s for', href: '/who-its-for' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const footerNav: NavLink[] = [
  ...menuNav,
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export const demoCta = { label: 'Book a demo', href: '/book-a-demo' } as const
