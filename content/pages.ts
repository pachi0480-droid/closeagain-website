/**
 * Copy for the supporting pages. Each object is one route.
 *
 * Describe what CloseAgain does and what stays with the customer's team.
 * Never invent results, customer counts, testimonials, named integrations,
 * channels, limits or timelines. Plan facts come from content/pricing.ts;
 * anything not yet confirmed is listed in docs/open-questions.md.
 */

import { availability, billingNote, planSummary, planTerms, plans, proposalCovers, setupNote } from './pricing.ts'
import { primaryCta } from './site.ts'

const terms = planTerms.join(' · ')

export const howItWorks = {
  meta: {
    title: 'How it works',
    description:
      'A new inquiry or an older lead comes in, CloseAgain follows up automatically, and your team takes over when someone is ready. Six steps, and who does each one.',
  },
  eyebrow: 'How it works',
  title: 'What happens automatically, and where your team comes in.',
  lede: 'Six steps from an inquiry\u00A0— or an older lead\u00A0— to a sale your team can close. Each step says who does the work.',
  steps: [
    {
      number: '01',
      who: 'Automatic',
      title: 'Leads enter CloseAgain.',
      body: 'New inquiries arrive from the sources you connect, such as your website forms. Older leads you already have can be brought in too.',
      preview: 'intake',
    },
    {
      number: '02',
      who: 'Automatic',
      title: 'CloseAgain follows up.',
      body: 'A first reply goes out right away, then follow-ups on the schedule you approved\u00A0— for new inquiries, and for older leads that went quiet.',
      preview: 'sequence',
    },
    {
      number: '03',
      who: 'Automatic',
      title: 'The lead replies.',
      body: 'CloseAgain spots the reply, stops the follow-up and puts the conversation in your inbox with its full history.',
      preview: 'reply',
    },
    {
      number: '04',
      who: 'Automatic or your team',
      title: 'The opportunity moves forward.',
      body: `Interested people are steered toward a next step, usually an appointment. Appointment workflows are included on ${availability('Appointment workflows').summary.replace(' and up', ' plans and up')}; otherwise your team books it.`,
      preview: 'booking',
    },
    {
      number: '05',
      who: 'Your team',
      title: 'Your team takes over.',
      body: 'Someone steps in where a person is needed\u00A0— detailed questions, the consultation, the quote\u00A0— with the whole conversation in view. Closing the sale is your team’s work.',
      preview: 'handoff',
    },
    {
      number: '06',
      who: 'Automatic',
      title: 'Performance is tracked.',
      body: 'See new and recovered leads, replies, response rates and appointments by source\u00A0— kept apart from the sales your team closes, so activity is never mistaken for revenue.',
      preview: 'analytics',
    },
  ],
  closing: {
    title: 'See how it would work with your leads.',
    body: terms,
    cta: primaryCta,
    secondary: { label: 'See pricing', href: '/pricing' },
  },
} as const

export type FeatureCapability = {
  name: string
  does: string
  control: string
  /** The comparison row this capability maps to, for plan availability. */
  row: string
}

export const features = {
  meta: {
    title: 'Features',
    description:
      'How CloseAgain responds to new inquiries, revisits older leads, turns replies into next steps and reports what happened\u00A0— with what you control and which plans include each.',
  },
  eyebrow: 'Features',
  title: 'Follow-up that doesn’t depend on someone remembering.',
  lede: 'CloseAgain handles four jobs that usually slip when a team gets busy. For each: the problem, what CloseAgain does, what you control, and which plans include it.',
  groups: [
    {
      id: 'respond',
      number: '01',
      title: 'Respond to interested prospects',
      summary: 'New inquiries get an answer and a follow-up sequence automatically, so nobody waits on a busy inbox.',
      problem:
        'Inquiries arrive while your team is busy with other work. The longer a reply takes, the more likely the person moves on.',
      preview: 'sequence',
      capabilities: [
        {
          name: 'New inquiry capture',
          does: 'Inquiries from the sources you connect\u00A0— such as your website forms\u00A0— arrive in one place with their details.',
          control: 'Which sources connect, agreed during setup.',
          row: 'New inquiry capture',
        },
        {
          name: 'Automated follow-up',
          does: 'A first reply goes out right away, then follow-ups on a schedule until the person answers or the sequence ends.',
          control: 'The wording and the timing. You review both before anything goes live.',
          row: 'Automated follow-up',
        },
        {
          name: 'Custom sequences and automations',
          does: 'Different sequences for different kinds of inquiry, and rules for what happens next, shaped around how you sell.',
          control: 'Which inquiries get which sequence. Fully custom workflows come with Scale.',
          row: 'Custom follow-up sequences',
        },
      ] satisfies FeatureCapability[],
      limits: 'CloseAgain answers the inquiries you already receive. It doesn’t run ads or find new prospects.',
    },
    {
      id: 'revisit',
      number: '02',
      title: 'Revisit older opportunities',
      summary: 'Leads that went quiet are contacted again on a schedule you approve, and follow-up stops when they reply.',
      problem:
        'Leads that didn’t buy the first time are rarely contacted again, even when the need is still there\u00A0— so the effort that brought them in goes to waste.',
      preview: 'reengage',
      capabilities: [
        {
          name: 'Older lead re-engagement',
          does: 'Eligible older leads get a relevant message asking whether they’re still interested. Replies land in your inbox like any other.',
          control: 'Which leads are eligible\u00A0— for example, how long since the last contact\u00A0— and what the message says.',
          row: 'Older lead re-engagement',
        },
      ] satisfies FeatureCapability[],
      limits:
        'Only for leads you already have and are allowed to contact. Outreach stops when someone replies or the sequence ends.',
    },
    {
      id: 'next-step',
      number: '03',
      title: 'Turn interest into a next step',
      summary: 'Replies land in one inbox for your team, and appointment workflows help move interested people to a booking.',
      problem: 'A reply is only worth something if someone acts on it quickly\u00A0— and knows the history when they do.',
      preview: 'handoff',
      capabilities: [
        {
          name: 'Conversation inbox',
          does: 'Replies from your supported channels arrive in one inbox, grouped by stage, with the whole history in view.',
          control: 'When a person steps in and takes over a conversation.',
          row: 'Conversation inbox',
        },
        {
          name: 'Appointment workflows',
          does: 'Help interested people get from a reply to a booked appointment.',
          control: 'How and when appointments are offered.',
          row: 'Appointment workflows',
        },
        {
          name: 'Multi-user collaboration',
          does: 'Several people on your team work leads together in the same inbox.',
          control: 'Who works which conversations.',
          row: 'Multi-user collaboration',
        },
      ] satisfies FeatureCapability[],
      limits: 'CloseAgain gets people to a next step. The consultation, the quote and the sale are your team’s.',
    },
    {
      id: 'understand',
      number: '04',
      title: 'Understand what happened',
      summary: 'See replies, appointments and response rates by source\u00A0— kept apart, so activity is never mistaken for sales.',
      problem:
        'Without a clear record it’s hard to tell whether follow-up is working\u00A0— or to tell activity apart from actual sales.',
      preview: 'analytics',
      capabilities: [
        {
          name: 'Reporting',
          does: 'New and recovered leads, replies, response rates and appointments, by source and over time.',
          control: 'Which views your team relies on. Higher plans add deeper reporting.',
          row: 'Reporting level',
        },
        {
          name: 'Integrations',
          does: 'Connect your lead sources, calendar and CRM so records stay in step.',
          control: 'Which tools connect. Tell us what you use; fit is confirmed before you commit.',
          row: 'Integrations',
        },
      ] satisfies FeatureCapability[],
      limits:
        'A reply isn’t a sale, and an appointment isn’t a customer. Reports keep those stages apart, so you can judge follow-up by the sales your team actually closes.',
    },
  ],
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
      'CloseAgain suits businesses where people inquire before they buy\u00A0— real estate, home services, med spas, law firms, agencies, SaaS, e-commerce and more\u00A0— and what it follows up on in each.',
  },
  eyebrow: 'Who it’s for',
  title: 'For businesses where people ask before they buy.',
  lede: 'If your sales start with an inquiry\u00A0— a form, a call, a message\u00A0— and some of those inquiries go quiet, CloseAgain was built for you.',
  fit: {
    good: {
      title: 'A good fit if',
      items: [
        'People contact you before they buy\u00A0— by form, phone or message.',
        'A sale usually needs a conversation, a quote or an appointment.',
        'You have past inquiries that never turned into customers.',
      ],
    },
    not: {
      title: 'Not the right tool if',
      items: [
        'You need new leads generated. CloseAgain follows up with the leads you have; it doesn’t run ads or find prospects.',
        'Your customers buy instantly, with no inquiry or conversation first.',
      ],
    },
  },
  industries: [
    {
      id: 'real-estate',
      formValue: 'Real estate',
      name: 'Real Estate',
      leads: 'Showing requests, buyer and seller inquiries, home-value requests.',
      fresh: 'Reply to showing and valuation requests while the lead is still looking.',
      older: 'Check back with buyers and sellers who weren’t ready yet.',
      image: '/industries/real-estate.webp',
    },
    {
      id: 'home-services',
      formValue: 'Home services',
      name: 'Home Services',
      leads: 'Quote and estimate requests, service calls.',
      fresh: 'Answer estimate requests before the homeowner calls the next company.',
      older: 'Follow up on estimates that were sent but never accepted.',
      image: '/industries/home-services.webp',
    },
    {
      id: 'med-spas',
      formValue: 'Med spa',
      name: 'Med Spas',
      leads: 'Consultation and treatment inquiries.',
      fresh: 'Respond to consultation inquiries and help them book.',
      older: 'Reach people who asked about a treatment but never booked.',
      image: '/industries/med-spas.webp',
    },
    {
      id: 'law-firms',
      formValue: 'Law firm',
      name: 'Law Firms',
      leads: 'Consultation requests from prospective clients.',
      fresh: 'Acknowledge new inquiries promptly and move them toward a consultation.',
      older: 'Follow up with prospective clients who didn’t schedule.',
      image: '/industries/law-firms.webp',
    },
    {
      id: 'agencies',
      formValue: 'Agency',
      name: 'Agencies',
      leads: 'Project inquiries and proposal requests.',
      fresh: 'Reply to project inquiries and book the first call.',
      older: 'Revisit proposals that went quiet.',
      image: '/industries/agencies.webp',
    },
    {
      id: 'saas',
      formValue: 'SaaS & technology',
      name: 'SaaS & Technology',
      leads: 'Demo requests, trial sign-ups and sales inquiries.',
      fresh: 'Follow up on demo requests and trials while interest is high.',
      older: 'Re-engage trials and sales conversations that stalled.',
      image: '/industries/saas.webp',
    },
    {
      id: 'ecommerce',
      formValue: 'E-commerce',
      name: 'E-commerce',
      leads: 'Custom-order, wholesale and pre-sale product questions.',
      fresh: 'Answer order and wholesale inquiries quickly.',
      older: 'Follow up on quotes and questions that never became orders.',
      image: '/industries/ecommerce.webp',
    },
    {
      id: 'other',
      formValue: 'Other lead-driven business',
      name: 'Other lead-driven businesses',
      leads: 'Any inquiry that comes before a sale.',
      fresh: 'Reply to and follow up on the inquiries you receive.',
      older: 'Give past inquiries another chance.',
      image: '/industries/other.webp',
    },
  ],
  labels: { leads: 'Typical inquiries', fresh: 'New inquiries', older: 'Older leads' },
  imageNote: 'Editorial imagery, generated for this site\u00A0— not customer photography.',
  closing: {
    title: 'Does this sound like your business?',
    body: 'Tell us how leads reach you and we’ll talk through whether CloseAgain fits.',
    cta: primaryCta,
  },
  word: 'Reconnect.',
} as const

export const pricingPage = {
  meta: {
    title: 'Pricing',
    description: `CloseAgain plans: ${plans.map(planSummary).join(', ')}. ${billingNote}. ${setupNote}.`,
  },
  eyebrow: 'Pricing',
  title: ['Simple pricing.', 'Clear differences.'],
  lede: 'Every plan follows up with new inquiries and older leads. Higher plans add appointment workflows, custom workflows, team collaboration and multiple locations.',
  common: {
    title: 'Every plan includes',
    items: ['Follow-up for new inquiries and older leads', 'A conversation inbox for replies', setupNote, billingNote],
  },
  proposal: {
    title: 'What your proposal confirms',
    body: 'Some details depend on your business, so they are agreed in writing before anything is billed:',
    items: proposalCovers,
  },
  compare: { open: 'Compare all features', close: 'Hide comparison' },
  value: {
    eyebrow: 'Is it worth it?',
    title: 'How many extra sales would cover the cost?',
    body: 'A break-even check with your own numbers. It isn’t a forecast, and CloseAgain can’t promise any particular result.',
  },
  questions: {
    eyebrow: 'Buying questions',
    title: 'Contracts, setup and fit.',
    ids: ['contract', 'which-plan', 'setup-included', 'channels'],
  },
  closing: {
    title: 'Not sure which plan fits?',
    body: 'Tell us how leads reach you and we’ll recommend one\u00A0— with the reasons.',
    cta: primaryCta,
    secondary: { label: 'How getting started works', href: '/getting-started' },
  },
} as const

export const gettingStarted = {
  meta: {
    title: 'Getting started',
    description:
      'From first inquiry to launch: talk through fit and scope, approve your plan and terms, connect your tools, review the setup, go live.',
  },
  eyebrow: 'Getting started',
  title: 'How getting started works.',
  lede: 'Six steps from first inquiry to launch. Nothing is billed until you approve a plan and terms, and setup assistance is included on every plan.',
  steps: [
    {
      number: '01',
      title: 'Send an inquiry',
      body: 'Tell us about your business, how leads reach you and what you want to improve. It takes a few minutes and commits you to nothing.',
    },
    {
      number: '02',
      title: 'Talk through fit and scope',
      body: 'We discuss your lead sources, tools and sales process, then recommend a plan\u00A0— or tell you if CloseAgain isn’t the right fit.',
    },
    {
      number: '03',
      title: 'Approve your plan and terms',
      body: 'You review the plan, price and terms in writing. Setup starts only after you approve them.',
    },
    {
      number: '04',
      title: 'Connect your tools',
      body: 'We help connect your lead sources, calendar and CRM, and confirm which channels CloseAgain will use.',
    },
    {
      number: '05',
      title: 'Review your setup',
      body: 'We configure your follow-up and re-engagement. You review every message and workflow before anything goes live.',
    },
    {
      number: '06',
      title: 'Go live',
      body: 'CloseAgain starts following up with new inquiries and eligible older leads. Your team handles the replies that need a person.',
    },
  ],
  included: `${setupNote}.`,
  timing: 'Setup timing depends on your integrations and requirements.',
  needs: {
    title: 'What we’ll ask you for',
    items: [
      'Where your leads come from today',
      'The tools you use\u00A0— CRM, calendar, website forms',
      'How you follow up now, and what you’d like to change',
      'Who on your team handles replies',
    ],
  },
  closing: {
    title: 'Start with a conversation.',
    body: terms,
    cta: primaryCta,
    secondary: { label: 'See pricing', href: '/pricing' },
  },
} as const

export const about = {
  meta: {
    title: 'About',
    description:
      'Good opportunities shouldn’t disappear. CloseAgain exists so the people who already reached out get an answer, a follow-up and another chance.',
  },
  eyebrow: 'About CloseAgain',
  title: 'Good opportunities shouldn’t disappear.',
  lede: 'Most leads aren’t lost because people stop caring. They’re lost because a reply takes too long, a follow-up never happens, or nobody checks back.',
  statement: {
    word: 'Again.',
    title: 'Why CloseAgain exists.',
    body: [
      'CloseAgain makes sure the people who already reached out get an answer, a follow-up and\u00A0— when they go quiet\u00A0— another chance.',
      'Your team keeps doing what only people can do: the conversation that wins the work.',
    ],
  },
  principles: [
    { title: 'Answer.', body: 'Reply to new inquiries while interest is high.' },
    { title: 'Follow up.', body: 'Keep following up on schedule, without anyone having to remember.' },
    { title: 'Return.', body: 'Give leads that went quiet another chance.' },
  ],
  closing: {
    title: 'See what CloseAgain would do with your leads.',
    cta: primaryCta,
  },
} as const

export type FaqItem = { id: string; q: string; a: string; links?: ReadonlyArray<{ label: string; href: string }> }

export const faq = {
  meta: {
    title: 'FAQ',
    description:
      'Straight answers about CloseAgain: what it does and doesn’t do, new and older leads, your team’s role, channels, integrations, appointments, setup, contracts and plans.',
  },
  eyebrow: 'Questions, answered',
  title: 'Before you get in touch.',
  lede: 'Straight answers about what CloseAgain does, what it doesn’t, and how buying works.',
  items: [
    {
      id: 'what',
      q: 'What is CloseAgain?',
      a: 'CloseAgain is automated lead follow-up and recovery. It replies to new inquiries, follows up on a schedule, re-engages older leads that went quiet, and hands interested people to your team\u00A0— helping you book more appointments and close more sales.',
    },
    {
      id: 'find-leads',
      q: 'Does CloseAgain find new leads for me?',
      a: 'No. CloseAgain works with the inquiries and past leads you already have. It doesn’t run ads, buy lists or find new prospects\u00A0— it makes sure the people who already reached out get an answer, a follow-up and another chance.',
    },
    {
      id: 'follow-up',
      q: 'How does automatic follow-up work?',
      a: 'When a new inquiry arrives, CloseAgain replies right away and keeps following up on the schedule you approved, until the person answers or the sequence ends. Replies land in your inbox so your team can take over.',
    },
    {
      id: 'old-leads',
      q: 'Can CloseAgain re-engage older leads?',
      a: 'Yes. Eligible leads that went quiet\u00A0— weeks or months ago\u00A0— get a relevant message asking whether they’re still interested. You decide which leads are eligible, and follow-up stops when someone replies.',
    },
    {
      id: 'team-role',
      q: 'What does my team still do?',
      a: 'Your team handles the conversations that need a person: detailed questions, consultations, quotes and closing the sale. CloseAgain handles the replies and follow-ups that usually slip, and shows your team who is ready.',
    },
    {
      id: 'messages',
      q: 'Who writes the messages?',
      a: 'Your follow-up messages are set up with you during onboarding, and you review every message and workflow before anything goes live.',
    },
    {
      id: 'channels',
      q: 'Which channels does CloseAgain use?',
      a: 'The channels available for your business are confirmed while we scope your setup. Tell us how you talk with customers today\u00A0— for example email or text messages\u00A0— and we’ll confirm what CloseAgain covers before you commit.',
    },
    {
      id: 'crm',
      q: 'Can I connect my CRM?',
      a: 'Every plan includes standard integrations; Growth and Scale add more, and Enterprise includes custom integrations. Tell us which CRM and tools you use and we’ll confirm how they connect before you commit.',
    },
    {
      id: 'appointments',
      q: 'Does CloseAgain book appointments?',
      a: `Appointment workflows, which help interested people get from a reply to a booked appointment, are included on ${availability('Appointment workflows').summary.replace(' and up', ' plans and up')}. On other plans, replies go to your team to book.`,
    },
    {
      id: 'results',
      q: 'Will CloseAgain guarantee more sales?',
      a: 'No one can honestly guarantee that. CloseAgain makes sure interested people get a prompt answer, consistent follow-up and a clear next step, which gives your team more chances to win the work. Whether a lead becomes a customer still depends on your offer and your team.',
    },
    {
      id: 'contract',
      q: 'Is there a contract?',
      a: 'Plans are billed monthly. The minimum term and how to cancel are set out in your proposal, and you approve them before anything is billed.',
    },
    {
      id: 'which-plan',
      q: 'Which plan should I choose?',
      a: `${plans.map((plan) => `${plan.name}: ${plan.bestFor}`).join(' ')} Not sure? Tell us about your business and we’ll recommend one, with the reasons.`,
      links: [{ label: 'Compare plans', href: '/pricing' }],
    },
    {
      id: 'setup-included',
      q: 'Is setup included?',
      a: 'Yes, setup assistance is included on every plan. Scale adds priority onboarding and Enterprise dedicated onboarding. Setup timing depends on your integrations and requirements.',
    },
    {
      id: 'after-contact',
      q: 'What happens after I get in touch?',
      a: 'We talk through fit and scope and recommend a plan. You review the plan, price and terms in writing, and setup starts only after you approve. Then we connect your tools, you review the setup, and CloseAgain goes live.',
      links: [{ label: 'How getting started works', href: '/getting-started' }],
    },
  ] satisfies FaqItem[],
  closing: {
    title: 'Still have a question?',
    body: 'Ask us anything\u00A0— we’ll give you a straight answer and point you to the right plan.',
    cta: primaryCta,
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
