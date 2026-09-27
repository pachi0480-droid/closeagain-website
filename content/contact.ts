/**
 * Copy for the inquiry (/contact) and its confirmation (/thank-you).
 *
 * /contact is the buying inquiry: plan and details now, then setup confirmed
 * with the customer, tools connected, review, launch. Nothing is charged on
 * the site. Say only what is true at each point: never
 * claim a meeting was booked, a payment was taken, an email was sent, or a
 * response time. Prices come from content/pricing.ts and nowhere else.
 */

import { planTerms, startingPriceText } from './pricing.ts'
import { primaryCta, site } from './site.ts'

export const contact = {
  meta: {
    title: 'Contact to buy',
    description: `Choose a plan and tell us about your business. ${startingPriceText}, monthly billing, no annual commitment, setup assistance included.`,
  },
  eyebrow: 'Contact to buy',
  title: 'Ready to close more conversations?',
  lede: 'Tell us about your business and the plan you want. We’ll confirm the right setup and get CloseAgain running for you.',
  terms: planTerms,
  next: {
    title: 'What happens next',
    steps: ['Send your information', 'We confirm the setup', 'Connect your tools', 'Launch CloseAgain'],
  },
  process: { label: 'What happens after you buy', href: '/after-you-buy' },
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
        'We contact you at the email you gave to confirm your plan and setup.',
        'You review everything before CloseAgain goes live.',
      ],
    },
    payment: 'No payment has been taken.',
    actions: {
      primary: { label: 'What happens after you buy', href: '/after-you-buy' },
      secondary: { label: 'Back to home', href: '/' },
    },
  },
  /** A direct visit, or an expired or unreadable receipt. Claims nothing. */
  neutral: {
    meta: { title: 'Contact to buy' },
    eyebrow: 'CloseAgain',
    title: 'Ready to close more conversations?',
    body: 'Choose a plan and tell us about your business. We’ll confirm the right setup.',
    actions: {
      primary: primaryCta,
      secondary: { label: 'See pricing', href: '/pricing' },
    },
  },
  bubble: 'Let’s talk.',
} as const
