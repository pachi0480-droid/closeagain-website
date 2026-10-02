/**
 * Brand, navigation and shared calls to action.
 *
 * Every public word on the site lives in `content/`. Components import from
 * here, so wording can change without touching layout code.
 */

/**
 * The public origin: NEXT_PUBLIC_SITE_URL, or on a Vercel production build the
 * project's production domain (next.config.ts fills it in).
 *
 * When it is not set the site treats itself as a preview: no canonical URLs,
 * no sitemap entries, and every page asks search engines not to index it. That
 * way a preview can never become the canonical public site by accident.
 */
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')

export const site = {
  name: 'CloseAgain',
  email: 'Closeagainhq@gmail.com',
  /**
   * The owner's number, for texts only: they reply to texts, and can't
   * reliably take calls on it, so the site links it as a text (sms:) and
   * never as a call.
   */
  text: {
    display: '(352) 318‑0993',
    href: 'sms:+13523180993',
    label: 'Text us',
    note: 'Texts only — that’s the quickest way to reach us.',
  },
  tagline: 'The conversation isn’t over.',
  /** What CloseAgain is, in four words. */
  category: 'Done-for-you lead follow-up and recovery',
  /** The one-sentence explanation. Keep it this short. */
  promise:
    'We follow up with your leads for you — new inquiries and old ones that went quiet\u00A0— so more conversations become customers.',
  description:
    'CloseAgain is done-for-you lead follow-up: we follow up with every lead for you — new inquiries and old ones that went quiet — so more of them become paying customers.',
  origin: configuredOrigin || null,
} as const

export const isIndexable = Boolean(site.origin)

/**
 * Visitor analytics: Vercel Web Analytics — cookieless page views, nothing that
 * follows a person to other sites. Off unless the deployment sets
 * VERCEL_WEB_ANALYTICS=on (after Web Analytics is enabled in the Vercel
 * dashboard), so a site without it never requests a script that isn't there.
 * Read on the server at build time; the privacy policy follows this switch.
 */
export const analyticsEnabled = process.env.VERCEL_WEB_ANALYTICS === 'on'

/**
 * A scheduling page (Calendly, Cal.com, …) for buyers who want to talk first.
 * Set NEXT_PUBLIC_BOOKING_URL to its https address; without it nothing shows.
 */
const bookingUrl = (() => {
  const raw = process.env.NEXT_PUBLIC_BOOKING_URL?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
})()

export const booking = bookingUrl
  ? { lead: 'Prefer to talk first?', label: 'Pick a time for a call', href: bookingUrl }
  : null

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
      { label: 'Sample dashboard', href: '/demo' },
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
    title: 'Next step',
    links: [
      { label: 'Contact to buy', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

/**
 * The primary call to action everywhere on the site. It opens the buying
 * inquiry — plan, details, then a short setup conversation. Nothing is
 * charged on the site itself.
 */
export const primaryCta = { label: 'Contact to buy', href: '/contact' } as const

/** The quieter route for visitors who want to understand the service first. */
export const learnCta = { label: 'See how it works', href: '/how-it-works' } as const

/** The exchange every closing call to action plays: the follow-up, and the yes. */
export const closingChat = { ask: 'Still interested?', reply: 'Yes. Let’s talk.', meta: 'Sent automatically' } as const
