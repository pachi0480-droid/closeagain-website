/**
 * Copy for the supporting pages. Each object is one route.
 *
 * Describe what CloseAgain does and what stays with the customer's team.
 * Never invent results, customer counts, testimonials, named integrations or
 * timelines. Plan facts come from content/pricing.ts; anything not yet
 * confirmed is listed in docs/open-questions.md.
 */

import {
  availability,
  billingNote,
  commitmentNote,
  planSummary,
  planTerms,
  plans,
  proposalCovers,
  setupNote,
  startingPriceText,
} from './pricing.ts'
import { primaryCta } from './site.ts'

const terms = planTerms.join(' · ')

export const howItWorks = {
  meta: {
    title: 'How it works',
    description:
      'Leads enter CloseAgain, follow-up goes out automatically, replies move forward and your team takes over where it matters. Six steps, and who does each one.',
  },
  eyebrow: 'How it works',
  title: 'One path from first message to customer.',
  lede: 'CloseAgain captures new leads, follows up automatically, and re‑engages old opportunities — so more conversations become customers.',
  /** Beside the title: one lead's path, ticking through the six steps. Sample wording. */
  moment: {
    label: 'One lead’s path through CloseAgain',
    title: 'A new lead',
    detail: 'Website form · just now',
    status: { from: 'New', to: 'Booked' },
    rows: [
      { label: 'Lead captured', meta: 'Website form', who: 'Auto' },
      { label: 'Follow-up sent', meta: 'On your schedule', who: 'Auto' },
      { label: 'Lead replied', meta: '“Thursday works.”', who: 'Auto' },
      { label: 'Appointment booked', meta: 'Thursday', who: 'Auto' },
      { label: 'Your team takes over', meta: 'Whole conversation in view', who: 'Team' },
      { label: 'Added to your reports', meta: 'By source', who: 'Auto' },
    ],
  },
  steps: [
    {
      number: '01',
      who: 'Automatic',
      title: 'Leads enter CloseAgain.',
      body: 'New inquiries arrive from the sources you connect, such as your website forms. Older leads come in too, ready for another conversation.',
      preview: 'intake',
    },
    {
      number: '02',
      who: 'Automatic',
      title: 'CloseAgain follows up.',
      body: 'Follow-ups go out on the schedule you approve, while interest is still high — and old leads get a well-timed message of their own.',
      preview: 'sequence',
    },
    {
      number: '03',
      who: 'Automatic',
      title: 'Leads reply.',
      body: 'CloseAgain spots the reply, stops the sequence and puts the conversation in one inbox, organized by stage.',
      preview: 'reply',
    },
    {
      number: '04',
      who: 'Automatic or your team',
      title: 'Opportunities move forward.',
      body: 'Interested leads move toward the next step — an appointment, a quote, a call.',
      preview: 'booking',
    },
    {
      number: '05',
      who: 'Your team',
      title: 'Teams take over where needed.',
      body: 'Step in at any point with the whole conversation in view. The consultation, the quote and the sale are your team’s.',
      preview: 'handoff',
    },
    {
      number: '06',
      who: 'Automatic',
      title: 'Performance is tracked.',
      body: 'See new leads, recovered leads, replies and appointments by source — and which follow-up is working.',
      preview: 'analytics',
    },
  ],
  control: {
    eyebrow: 'Automatic follow-up. Personal conversations.',
    title: ['More follow-through.', 'Still entirely you.'],
    lede: 'Put the repetitive part on autopilot. Keep the human part in your hands.',
    items: [
      { title: 'Your words.', body: 'Messages use wording you approve, so every follow-up still sounds like your business.' },
      { title: 'Your timing.', body: 'Choose when to follow up and when to check back. Sequences stop when a lead replies.' },
      { title: 'Your relationships.', body: 'Replies come back to your team. You take care of the conversation, the quote and the sale.' },
    ],
    foot: `${setupNote} on every plan.`,
    link: { label: 'Explore the features', href: '/features' },
  },
  closing: {
    title: 'Ready to close more conversations?',
    body: terms,
    cta: primaryCta,
    secondary: { label: 'See pricing', href: '/pricing' },
  },
} as const

export type FeatureItem = {
  id: string
  name: string
  title: string
  body: string
  preview: 'intake' | 'sequence' | 'reengage' | 'thread' | 'inbox' | 'booking' | 'builder' | 'analytics' | 'integrations'
  /** The comparison row that says which plans include it. */
  row: string
}

export const features = {
  meta: {
    title: 'Features',
    description:
      'New lead capture, automated follow-up, old lead recovery, multi-channel conversations, a smart inbox, appointment workflows, automations, analytics and integrations.',
  },
  eyebrow: 'Features',
  title: 'Everything a lead needs to keep moving.',
  lede: 'Capture every new lead, follow up without thinking about it, and bring old opportunities back — from one place.',
  /** Beside the title: a workspace with its features switching on, one by one. */
  moment: {
    label: 'CloseAgain features switching on in a sample workspace',
    title: 'Your follow-up',
    tag: 'Sample workspace',
    running: 'Running',
    shown: 6,
  },
  items: [
    {
      id: 'capture',
      name: 'New Lead Capture',
      title: 'Every new lead, captured the moment it arrives.',
      body: 'Inquiries from your connected sources land in one place, with the source, the details and a next step attached.',
      preview: 'intake',
      row: 'New lead capture',
    },
    {
      id: 'follow-up',
      name: 'Automated Follow-Up',
      title: 'Follow up while interest is still high.',
      body: 'CloseAgain sends the first reply fast and keeps following up on your schedule until the lead answers.',
      preview: 'sequence',
      row: 'Automated follow-up',
    },
    {
      id: 'recovery',
      name: 'Old Lead Recovery',
      title: 'Bring quiet leads back into the conversation.',
      body: 'Reach back out to leads that went cold weeks or months ago — and reopen the ones that reply.',
      preview: 'reengage',
      row: 'Old lead re-engagement',
    },
    {
      id: 'channels',
      name: 'Multi-Channel Conversations',
      title: 'Meet leads where they reply.',
      body: 'Email and SMS workflows keep every exchange in a single thread, whichever channel the lead answers on.',
      preview: 'thread',
      row: 'Email + SMS workflows',
    },
    {
      id: 'inbox',
      name: 'Smart Inbox',
      title: 'An inbox organized by what happens next.',
      body: 'Replies are grouped by stage and next action, so your team always knows where to step in.',
      preview: 'inbox',
      row: 'Unified conversation inbox',
    },
    {
      id: 'appointments',
      name: 'Appointment Workflows',
      title: 'From reply to booked appointment.',
      body: 'Move interested leads to a booking, send reminders, and follow up when someone misses a time.',
      preview: 'booking',
      row: 'Appointment workflows',
    },
    {
      id: 'automations',
      name: 'Automations',
      title: 'Build the follow-up once.',
      body: 'Sequences and rules for new leads, quiet leads and no-shows — set up once, then left to run.',
      preview: 'builder',
      row: 'Custom automation rules',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      title: 'See what’s working.',
      body: 'Track new leads, recovered leads, response rates and appointments, by source and over time.',
      preview: 'analytics',
      row: 'Analytics and reporting',
    },
    {
      id: 'integrations',
      name: 'Integrations',
      title: 'Connect the tools you already use.',
      body: 'Bring leads in from your forms and systems, and keep your calendar and CRM in step.',
      preview: 'integrations',
      row: 'Integrations',
    },
  ] satisfies FeatureItem[],
  closing: {
    title: 'See it working on your leads.',
    body: terms,
    cta: primaryCta,
    secondary: { label: 'Explore the sample dashboard', href: '/demo' },
  },
} as const

export const whoItsFor = {
  meta: {
    title: 'Who it’s for',
    description:
      'CloseAgain is for lead-driven businesses — real estate, home services, med spas, law firms, agencies, SaaS, e-commerce and more.',
  },
  eyebrow: 'Who it’s for',
  title: 'For businesses that live on conversations.',
  lede: 'If leads come in, go quiet and come back, CloseAgain keeps them moving.',
  /** Beside the title: replies arriving from different industries (sample wording from each page). */
  moment: {
    label: 'Sample replies from different industries',
    title: 'New replies',
    time: 'now',
    shown: 4,
  },
  industries: [
    {
      id: 'real-estate',
      formValue: 'Real estate',
      name: 'Real Estate',
      outcome: 'Follow up with every buyer and seller inquiry — and revisit the ones who weren’t ready yet.',
    },
    {
      id: 'home-services',
      formValue: 'Home services',
      name: 'Home Services',
      outcome: 'Answer new requests fast and bring back estimates that were never accepted.',
    },
    {
      id: 'med-spas',
      formValue: 'Med spa',
      name: 'Med Spas',
      outcome: 'Turn consultation inquiries into booked appointments.',
    },
    {
      id: 'law-firms',
      formValue: 'Law firm',
      name: 'Law Firms',
      outcome: 'Respond to new inquiries promptly and keep consultations moving.',
    },
    {
      id: 'agencies',
      formValue: 'Agency',
      name: 'Agencies',
      outcome: 'Keep prospects warm from first inquiry to signed proposal.',
    },
    {
      id: 'saas',
      formValue: 'SaaS & technology',
      name: 'SaaS & Technology',
      outcome: 'Follow up on demo requests and trials before interest fades.',
    },
    {
      id: 'ecommerce',
      formValue: 'E-commerce',
      name: 'E-commerce',
      outcome: 'Answer order and wholesale inquiries, and revisit the ones that went quiet.',
    },
    {
      id: 'other',
      formValue: 'Other lead-driven business',
      name: 'Other Lead‑Driven Businesses',
      outcome: 'If leads come in and go quiet, CloseAgain keeps them moving.',
    },
  ],
  /** The overview: one row per industry, each with a sample exchange from its page. */
  index: {
    label: 'Industries',
    moment: 'Sample follow-up',
    note: 'Sample wording with fictional people. Your follow-up uses wording you approve.',
  },
  closing: {
    title: 'Sound familiar?',
    body: 'Tell us about your leads and we’ll recommend the right plan.',
    cta: primaryCta,
  },
  word: 'Reconnect.',
} as const

export const pricingPage = {
  meta: {
    title: 'Pricing',
    description: `CloseAgain plans: ${plans.map(planSummary).join(', ')}. ${billingNote}. ${commitmentNote}. ${setupNote}.`,
  },
  eyebrow: 'Pricing',
  title: ['Simple pricing.', 'Clear differences.'],
  lede: `Choose the plan that fits your business. ${billingNote}. ${commitmentNote}. ${setupNote}.`,
  /** Beside the title: the four plans as a tier meter, each bar a link to its card. */
  moment: {
    label: 'Jump to a plan',
    title: 'More automation at every level',
    recommended: 'Recommended',
  },
  common: {
    title: 'Every plan includes',
    items: ['New lead capture and automated follow-up', 'Old lead re-engagement', 'A unified conversation inbox', setupNote],
  },
  proposal: `${proposalCovers[0].charAt(0).toUpperCase()}${proposalCovers[0].slice(1)}, ${proposalCovers[1]} and ${proposalCovers[2]} are confirmed in writing before anything is billed.`,
  compare: { open: 'Compare all features', close: 'Hide comparison' },
  value: {
    eyebrow: 'Is it worth it?',
    title: 'How many extra sales would cover the cost?',
    body: 'A break-even check with your own numbers. It isn’t a forecast, and CloseAgain can’t promise any particular result.',
  },
  questions: {
    eyebrow: 'Buying questions',
    title: 'Contracts, setup and fit.',
    ids: ['annual-contract', 'which-plan', 'setup', 'channels'],
  },
  closing: {
    title: 'Not sure which plan fits?',
    body: 'Tell us how leads reach you and we’ll recommend one — with the reasons.',
    cta: { label: 'Talk to us', href: '/contact' },
    secondary: { label: 'What happens after you buy', href: '/after-you-buy' },
  },
} as const

export const afterYouBuy = {
  meta: {
    title: 'What happens after you buy',
    description:
      'Choose your plan, tell us about your business, connect your tools, and we configure CloseAgain with you before you go live. Setup assistance included.',
  },
  eyebrow: 'After you buy',
  title: 'What happens after you buy.',
  lede: 'A short, guided setup. Nothing goes live until you’ve reviewed it, and setup assistance is included on every plan.',
  /** Beside the title: the setup, ticking through to live. */
  moment: {
    label: 'The setup, step by step, to live',
    title: 'Your setup',
    status: { from: 'In setup', to: 'Live' },
  },
  steps: [
    { number: '01', title: 'Choose your plan', body: 'Pick the plan that fits your leads and goals — or ask us to recommend one.' },
    { number: '02', title: 'Tell us about your business', body: 'Your lead sources, the tools you use and how follow-up works today.' },
    { number: '03', title: 'Connect your tools', body: 'We help connect your lead sources, calendar and CRM.' },
    { number: '04', title: 'We configure CloseAgain', body: 'Follow-up sequences, re-engagement and workflows, set up for your business.' },
    { number: '05', title: 'Review your setup', body: 'You review every message and workflow before anything goes live.' },
    { number: '06', title: 'Go live', body: 'CloseAgain starts capturing, following up and re-engaging.' },
  ],
  included: `${setupNote}.`,
  timing: 'Setup timing depends on your integrations and requirements.',
  needs: {
    title: 'What we’ll ask you for',
    items: [
      'Where your leads come from today',
      'The tools you use — CRM, calendar, website forms',
      'How you follow up now, and what you’d like to change',
      'Who on your team handles replies',
    ],
  },
  closing: {
    title: 'Ready when you are.',
    body: `${startingPriceText}. ${billingNote}. ${commitmentNote}.`,
    cta: primaryCta,
    secondary: { label: 'See pricing', href: '/pricing' },
  },
} as const

export const about = {
  meta: {
    title: 'About',
    description:
      'Good opportunities shouldn’t disappear. CloseAgain exists to keep conversations moving when people get busy and follow-up slips.',
  },
  eyebrow: 'About CloseAgain',
  title: 'Good opportunities shouldn’t disappear.',
  lede: 'Most opportunities aren’t lost because people stop caring. They’re lost because people get busy, follow-up slips, and conversations stop.',
  /** Beside the title: a conversation that went quiet, coming back. Sample wording. */
  moment: {
    label: 'A quiet conversation coming back',
    title: 'A quote from the spring',
    detail: 'Last contact 92 days ago',
    status: { from: 'Cold', to: 'Reopened' },
    message: 'Hi — are you still thinking about the project we quoted?',
    meta: 'Re-engagement sent automatically',
    reply: 'Yes! Still interested. Can we talk next week?',
  },
  statement: {
    word: 'Again.',
    title: 'Why CloseAgain exists.',
    body: [
      'CloseAgain keeps those conversations moving — capturing new leads as they arrive, following up automatically, and giving older opportunities another chance.',
      'So the conversations that matter don’t quietly end.',
    ],
  },
  principles: [
    { title: 'Capture.', body: 'Every new lead, in one place, the moment it arrives.' },
    { title: 'Follow up.', body: 'On time, every time, without living in the inbox.' },
    { title: 'Return.', body: 'Old conversations deserve another chance.' },
  ],
  closing: {
    title: 'The next conversation could start here.',
    cta: primaryCta,
  },
} as const

export type FaqItem = { id: string; q: string; a: string; links?: ReadonlyArray<{ label: string; href: string }> }

export const faq = {
  meta: {
    title: 'FAQ',
    description:
      'Answers about CloseAgain: new and old leads, automatic follow-up, channels, CRM connections, appointments, setup, contracts and plans.',
  },
  eyebrow: 'Questions, answered',
  title: 'Before you buy.',
  lede: 'The things people usually ask about CloseAgain.',
  /** Beside the title: two real questions, answered in a chat (the answers' opening sentences). */
  moment: {
    label: 'Two questions, answered',
    title: 'Ask us anything',
    ids: ['annual-contract', 'setup'],
    sentences: 2,
  },
  items: [
    {
      id: 'what',
      q: 'What is CloseAgain?',
      a: 'CloseAgain captures new leads, follows up automatically, and re-engages old opportunities — so more conversations become customers.',
    },
    {
      id: 'new-leads',
      q: 'Does CloseAgain work with new leads?',
      a: 'Yes. New leads from your connected sources are captured as they arrive, and CloseAgain follows up automatically while interest is high.',
    },
    {
      id: 'old-leads',
      q: 'Can CloseAgain re-engage old leads?',
      a: 'Yes. CloseAgain reaches back out to leads that went quiet — weeks or months ago — and brings their replies into the same inbox. Follow-up stops when someone replies.',
    },
    {
      id: 'follow-up',
      q: 'How does automatic follow-up work?',
      a: 'You approve the follow-up sequence for your business. When a lead arrives, CloseAgain sends the first message and keeps following up on schedule until the lead replies or the sequence ends. Replies appear in your inbox so your team can take over.',
    },
    {
      id: 'channels',
      q: 'What channels are supported?',
      a: `Email and SMS workflows are included on ${availability('Email + SMS workflows').summary.replace(' and up', ' plans and up')}, and Scale adds missed-call follow-up. Your channels are set up with you during onboarding.`,
    },
    {
      id: 'crm',
      q: 'Can I connect my CRM?',
      a: `Yes. CRM integrations are included on ${availability('CRM integrations').summary.replace(' and up', ' plans and up')}, Scale adds API and webhook access, and Enterprise includes custom integrations. Every plan includes standard integrations. Tell us which CRM you use and we’ll confirm how it connects.`,
    },
    {
      id: 'appointments',
      q: 'Does CloseAgain help book appointments?',
      a: 'Yes. Every plan includes basic appointment reminders, Growth adds appointment workflows that move replies to a booking, and Scale adds no-show recovery.',
    },
    {
      id: 'setup',
      q: 'Is setup included?',
      a: 'Yes. Every plan includes setup assistance; Scale adds priority onboarding and Enterprise dedicated onboarding. Setup timing depends on your integrations and requirements.',
    },
    {
      id: 'annual-contract',
      q: 'Is there an annual contract?',
      a: `No. Plans are billed monthly, with no annual commitment. ${proposalCovers[0].charAt(0).toUpperCase() + proposalCovers[0].slice(1)} and ${proposalCovers[2]} are confirmed before you start.`,
    },
    {
      id: 'which-plan',
      q: 'Which plan should I choose?',
      a: `${plans.map((plan) => `${plan.name}: ${plan.bestFor}`).join(' ')} Not sure? Tell us about your business and we’ll recommend one.`,
      links: [{ label: 'Compare plans', href: '/pricing' }],
    },
    {
      id: 'after-contact',
      q: 'What happens after I contact you?',
      a: 'We confirm the right plan and setup, help connect your tools, configure CloseAgain with you, and go live once you’ve reviewed everything.',
      links: [{ label: 'What happens after you buy', href: '/after-you-buy' }],
    },
  ] satisfies FaqItem[],
  closing: {
    title: 'Still have a question?',
    body: 'Ask us anything — we’ll point you to the right plan.',
    cta: { label: 'Talk to us', href: '/contact' },
  },
} as const

/** FAQ entries by id, for the homepage and pricing page. */
export const faqByIds = (ids: readonly string[]): FaqItem[] =>
  ids.map((id) => {
    const item = faq.items.find((candidate) => candidate.id === id)
    if (!item) throw new Error(`No FAQ entry with id “${id}”`)
    return item
  })

export const notFound = {
  code: '404',
  title: 'Let’s try that again.',
  body: 'This page seems to have gone quiet. Let’s get you back on track.',
  primary: { label: 'Back to home', href: '/' },
  secondary: primaryCta,
  links: [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
  ],
} as const
