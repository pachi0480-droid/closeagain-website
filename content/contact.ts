/**
 * Copy for the inquiry (/contact) and its confirmation (/thank-you).
 *
 * /contact starts a conversation, not a checkout. The real sequence is:
 * inquiry → fit and scope discussion → the customer approves the plan and
 * terms → setup → review → launch. Say only what is true at each point: never
 * claim a meeting was booked, a payment was taken, an email was sent, or a
 * response time. Prices come from content/pricing.ts and nowhere else.
 */

import { planTerms, startingPriceText } from './pricing.ts'
import { primaryCta } from './site.ts'

export const contact = {
  meta: {
    title: 'Find the right plan',
    description: `Tell us about your business and how leads reach you. We’ll talk through fit, scope and which plan makes sense. ${startingPriceText}.`,
  },
  eyebrow: 'Find the right plan',
  title: 'Find the right plan.',
  lede: 'Tell us a little about your business and how leads reach you. We’ll get back to you to talk through fit, scope and which plan makes sense. Nothing is charged here.',
  terms: planTerms,
  next: {
    title: 'What happens next',
    steps: [
      'You send a few details',
      'We talk through fit and scope',
      'You review the plan and terms',
      'We set up CloseAgain with you',
    ],
  },
  process: { label: 'See the full getting-started process', href: '/getting-started' },
  form: {
    submit: 'Send my details',
    guidance: 'No payment is taken here. Please don’t include sensitive information.',
  },
} as const

export const thankYou = {
  /** Shown only with a valid receipt: the endpoint confirmed delivery. */
  received: {
    meta: { title: 'Inquiry received' },
    eyebrow: 'Inquiry received',
    title: 'Thanks — we have your details.',
    body: 'Your inquiry reached the CloseAgain team.',
    /** Added when a real plan was chosen, e.g. “You asked about Growth — …”. */
    plan: (summary: string) => `You asked about ${summary}.`,
    next: {
      title: 'What happens next',
      steps: [
        'We review what you sent.',
        'We contact you at the email you gave to talk through fit, scope and setup.',
        'If CloseAgain is a fit, you review the plan and terms before anything starts.',
      ],
    },
    payment: 'No payment has been taken.',
    actions: {
      primary: { label: 'How getting started works', href: '/getting-started' },
      secondary: { label: 'Back to home', href: '/' },
    },
  },
  /** A direct visit, or an expired or unreadable receipt. Claims nothing. */
  neutral: {
    meta: { title: 'Find the right plan' },
    eyebrow: 'CloseAgain',
    title: 'Let’s find the right plan.',
    body: 'Tell us about your business and we’ll talk through fit, scope and pricing.',
    actions: {
      primary: primaryCta,
      secondary: { label: 'See pricing', href: '/pricing' },
    },
  },
  bubble: 'Let’s talk.',
} as const
