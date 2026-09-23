/**
 * Single source of truth for brand, navigation, CTA language and contact
 * details. Everything here is safe to edit without touching a component.
 */

export const LAUNCH_STATE = 'pre-launch' as const

export const site = {
  name: 'CloseAgain',
  category: 'Revenue Recovery for Home Services',
  promise: 'Recover the leads you already paid for.',
  description:
    'Recover more of the opportunities you already generate. CloseAgain is built to answer missed calls, follow up with leads, and turn more of the demand you already pay for into booked work.',

  // TODO(launch): replace with the real inbox before the site goes public.
  email: 'hello@closeagain.com',

  // TODO(launch): set NEXT_PUBLIC_SITE_URL in the deploy environment.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://closeagain.com',
} as const

export const nav = [
  { label: 'How it works', href: '#recovery-loop' },
  { label: 'Product', href: '#product' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const

export const cta = {
  primary: 'Request Early Access',
  leak: 'See the revenue leak',
  loop: 'Explore how it works',
  calculator: 'Calculate your revenue leak',
  pricing: 'Request access',
  pilot: 'Join the pilot',
  target: '#early-access',
} as const

export const footerLinks = [
  { label: 'How it works', href: '#recovery-loop' },
  { label: 'Product', href: '#product' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Request early access', href: '#early-access' },
] as const
