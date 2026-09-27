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
import { primaryCta, site } from './site.ts'

export const contact = {
  meta: {
    title: 'Let’s talk about your leads',
    description: `Tell us about your business and how leads reach you. We’ll talk through fit, scope and which plan makes sense. ${startingPriceText}.`,
  },
  eyebrow: 'A conversation, not a commitment',
  title: 'Let’s talk about your leads.',
  lede: 'New inquiries slipping through? Older leads going quiet? Tell us where follow-up gets stuck. We’ll help you explore the right next step for your business.',
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
  email: {
    eyebrow: 'Straight to our inbox',
    title: 'Tell us what you’re working on.',
    intro: 'A few lines are enough to start. No lengthy brief needed.',
    prompts: [
      'Your business name or website',
      'How new leads reach your team',
      'What you’d like your follow-up to do better',
    ],
    cta: 'Email CloseAgain',
    note: 'Opens a draft in your email app. Review it and press send when you’re ready.',
    alternative: 'Or copy the address above into your preferred email service.',
    subject: 'Let’s talk about CloseAgain',
    draft: 'Hi CloseAgain,\n\nI’d like to learn whether CloseAgain is a fit for my business.\n\nBusiness name or website:\nHow leads reach us:\nWhat we’d like to improve:\n',
    formAlternative: 'Prefer to email us directly?',
    address: site.email,
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
