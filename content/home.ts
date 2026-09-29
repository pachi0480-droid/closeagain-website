/**
 * Homepage copy. The hero headline is the brand — change it deliberately.
 *
 * Every product view on this page is a sample workflow with fictional people.
 * It demonstrates how CloseAgain works; it is not a customer story and shows
 * no results.
 */

import type { ShowcaseArea } from './demo/types.ts'
import { billingNote, planTerms, startingPriceText } from './pricing.ts'
import { learnCta, primaryCta, site } from './site.ts'

export type FlowEvent = {
  time: string
  title: string
  detail: string
  tone: 'ink' | 'red' | 'positive'
  /** The lead's status once this event has happened. */
  status: string
}

/** The dashboard areas the homepage showcase walks through (shared with the demo). */
export type { ShowcaseArea }

const terms = planTerms.join(' · ')

export const home = {
  meta: {
    title: 'CloseAgain — Turn more of your leads into paying customers',
    description: site.description,
  },

  hero: {
    category: 'Automatic lead follow-up',
    /** Rendered as three spans so small screens can break after “The”. */
    headline: { lead: 'The', rest: 'conversation', close: 'isn’t over.' },
    /** What the business gets, in one line, before how it works. */
    promise: 'More of your leads become paying customers.',
    /** Three lines on wide screens, as in the approved composition. */
    lede: [
      'CloseAgain follows up with every new lead automatically,',
      'chases the ones that go quiet and brings old leads back —',
      'so fewer sales slip away.',
    ],
    primary: primaryCta,
    secondary: learnCta,
    terms: [startingPriceText, billingNote],
    exchange: { ask: 'Still interested?', reply: 'Yes. Let’s talk.' },
  },

  /** Right under the hero: where the money is, and whether it pays. */
  payoff: {
    eyebrow: 'Why it pays',
    title: 'Every lead that goes quiet is a sale you already paid for.',
    points: [
      {
        title: 'Leads you already paid for',
        body: 'Ads, referrals and your website bring people in. The ones nobody gets back to buy from someone else. CloseAgain follows up with every one, automatically.',
      },
      {
        title: 'Old leads, new revenue',
        body: 'Quotes that went quiet are people who already wanted what you sell. CloseAgain reaches back out, so some of them come back.',
      },
      {
        title: 'Your team talks to buyers',
        body: 'Replies and booked appointments land in one inbox, so your people spend their time closing — not chasing.',
      },
    ],
    calculator: {
      title: 'Does it pay for itself?',
      label: 'What is one new customer worth to you?',
      hint: 'The profit from one sale or job',
      placeholder: '1,500',
      prompt: 'Type your number to see how many extra customers a month cover each plan.',
      invalid: 'Enter an amount in dollars, like 1,500.',
      note: 'Your number, not a forecast. CloseAgain can’t promise any particular result.',
      link: { label: 'Compare the plans', href: '/pricing' },
    },
  },

  again: {
    word: 'Again.',
    lines: [
      'People get busy.',
      'Good opportunities go cold.',
      'CloseAgain keeps new opportunities moving —',
      'and gives old conversations another chance.',
    ],
  },

  paths: {
    eyebrow: 'One system',
    title: ['New opportunities.', 'Old opportunities.', 'One system.'],
    lede: 'Every new lead gets a fast, consistent follow-up. Every quiet lead gets another chance. Both land in the same place.',
    fresh: {
      label: 'New leads',
      steps: [
        { title: 'New lead captured', meta: 'Website form · just now' },
        { title: 'Follow-up sent', meta: 'Automatically · 1 min later' },
        { title: 'Lead replies', meta: '“Thursday works for me.”' },
      ],
    },
    old: {
      label: 'Old leads',
      steps: [
        { title: 'Last contacted 84 days ago', meta: 'Quote sent · no reply' },
        { title: 'Re-engagement sent', meta: 'Automatically · this morning' },
        { title: 'Lead replies', meta: '“Yes — still interested.”' },
      ],
    },
    outcome: 'More conversations.',
  },

  flow: {
    eyebrow: 'A morning with CloseAgain',
    title: 'From lead to customer.',
    body: 'One lead, twelve minutes, no one chasing: captured, followed up, answered and booked while interest is still high.',
    note: 'The lead and the business are fictional.',
    lead: { name: 'Jordan Ellis', initials: 'JE', context: 'Kitchen remodel · Website form' },
    events: [
      { time: '9:12 AM', title: 'New lead captured', detail: 'Jordan Ellis · Website form', tone: 'ink', status: 'New lead' },
      {
        time: '9:13 AM',
        title: 'Follow-up sent',
        detail: '“Hi Jordan — thanks for reaching out. Could we find a time to talk this week?”',
        tone: 'ink',
        status: 'Following up',
      },
      {
        time: '9:18 AM',
        title: 'Lead replied',
        detail: '“Yes, Thursday afternoon works.”',
        tone: 'red',
        status: 'Replied',
      },
      { time: '9:21 AM', title: 'Appointment booked', detail: 'Thursday · 2:30 PM', tone: 'ink', status: 'Appointment' },
      {
        time: '9:24 AM',
        title: 'Opportunity updated',
        detail: 'Stage moved to Appointment · assigned to your team',
        tone: 'positive',
        status: 'Opportunity',
      },
    ] satisfies readonly FlowEvent[],
    handoff: 'From here, your team takes Jordan from appointment to sale.',
  },

  automation: {
    eyebrow: 'Automatic follow-up',
    title: 'Follow up without living in your inbox.',
    body: 'Set the sequence once. CloseAgain sends each follow-up on time, notices the reply, and hands you the next step.',
  },

  second: {
    eyebrow: 'Old leads',
    title: 'Some conversations just need another chance.',
    body: 'A lead that went quiet isn’t a lost lead. CloseAgain reaches back out — and when they answer, the conversation picks up where it left off.',
  },

  showcase: {
    eyebrow: 'The CloseAgain dashboard',
    title: 'One dashboard. Every conversation.',
    views: [
      { id: 'overview', label: 'Overview', body: 'New leads, active conversations and what needs you today, at a glance.' },
      { id: 'conversations', label: 'Conversations', body: 'Every thread in one inbox, organized by stage and next action.' },
      { id: 'leads', label: 'Leads', body: 'Source, score, status and the next step for every lead.' },
      { id: 'automations', label: 'Automations', body: 'Follow-up sequences, replies and what sends next.' },
      { id: 'appointments', label: 'Appointments', body: 'Upcoming bookings, no-shows and reminders.' },
      { id: 'analytics', label: 'Analytics', body: 'Where leads come from and how they convert.' },
    ] satisfies ReadonlyArray<{ id: ShowcaseArea; label: string; body: string }>,
    note: 'Sample workspace with fictional data.',
    link: { label: 'Explore the sample dashboard', href: '/demo' },
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Simple pricing. Clear differences.',
    body: terms,
    link: { label: 'Compare all plans', href: '/pricing' },
  },

  closing: {
    title: 'Ready to close more conversations?',
    body: terms,
    cta: primaryCta,
    secondary: { label: 'What happens after you buy', href: '/after-you-buy' },
  },
} as const
