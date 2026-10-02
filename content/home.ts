/**
 * Homepage copy. The hero headline is the brand — change it deliberately.
 *
 * Every product view on this page is a sample workflow with fictional people.
 * It demonstrates how CloseAgain works; it is not a customer story and shows
 * no results.
 */

import type { ShowcaseArea } from './demo/types.ts'
import { planTerms, setupNote, startingPriceText } from './pricing.ts'
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
    title: 'CloseAgain — Done-for-you lead follow-up for more paying customers',
    description: site.description,
  },

  hero: {
    category: 'Done-for-you lead follow-up',
    /** Rendered as three spans so small screens can break after “The”. */
    headline: { lead: 'The', rest: 'conversation', close: 'isn’t over.' },
    /** What the business gets, in one line, before how it works. */
    promise: 'We follow up with your leads for you.',
    /** Three lines on wide screens, as in the approved composition. */
    lede: [
      'You get the leads. We follow up with every one of them —',
      'new inquiries and old ones that went quiet — and hand you',
      'the replies and bookings. There’s nothing for you to run.',
    ],
    primary: primaryCta,
    secondary: learnCta,
    terms: [startingPriceText, setupNote],
    /**
     * What CloseAgain does, in four beats the visitor watches play out around
     * the headline. Generic wording, no names, no numbers: an illustration of
     * how follow-up works, not a result.
     */
    steps: {
      label: 'How CloseAgain works',
      lead: { title: 'A lead comes in', detail: 'Website form · just now', card: 'New lead' },
      reply: {
        title: 'We reply for you',
        detail: 'On your behalf',
        message: 'Thanks for reaching out. When’s a good time to talk?',
        meta: 'Sent for you',
      },
      again: {
        title: 'Quiet? We follow up',
        detail: 'On a schedule you approve',
        quiet: 'No reply yet',
        message: 'Any questions about your quote?',
        meta: 'Follow-up sent for you',
      },
      booked: {
        title: 'They reply. You book.',
        detail: 'You take it from here',
        message: 'Thursday works for me.',
        booked: 'Booked · Thursday',
      },
    },
  },

  /** Under the hero: the kinds of business it is for, each linking to its page. */
  ticker: {
    lead: 'Built for',
    label: 'Industries CloseAgain is built for',
  },

  /** Under the ticker: the whole deal, in two columns — what you do, and what we do. */
  split: {
    eyebrow: 'Done for you',
    title: 'You get the leads. We do the follow‑up.',
    you: {
      word: 'You',
      label: 'What you do',
      items: [
        { title: 'Tell us about your business', body: 'Where your leads come from, what you sell and how you like to talk to customers.' },
        { title: 'Approve the wording', body: 'Nothing goes out until you’ve signed off on it.' },
        { title: 'Take the conversations', body: 'Replies and booked appointments come straight to you. The sale is yours.' },
      ],
    },
    us: {
      word: 'We',
      label: 'What we do',
      items: [
        { title: 'Set everything up', body: 'We connect your lead sources and load your list of older leads.' },
        { title: 'Answer every new lead', body: 'Each inquiry gets a reply, then a few follow-ups on the schedule you approve.' },
        { title: 'Bring old leads back', body: 'We reach out to the people who went quiet, so some of them come back.' },
        { title: 'Keep it running', body: 'Follow-up stops the moment someone replies, and every lead, reply and booking is in view.' },
      ],
    },
    note: 'No software to learn. Nothing for you to manage.',
  },

  /**
   * The worry every owner has: will this spam my customers? How the
   * follow-up stays respectful — the rules every campaign runs by. The
   * sample text is fictional wording.
   */
  respect: {
    eyebrow: 'Follow-up, not spam',
    title: 'Your customers hear from you. They don’t get spammed.',
    body: 'Follow-up only works when it sounds like a real person who remembered them. So every campaign runs by the same rules.',
    rules: [
      { title: 'Only people who asked', body: 'We follow up with people who contacted you or already know your business. Never bought lists, never cold messages.' },
      { title: 'A few messages, not a flood', body: 'A short sequence you approve, spaced out, in your own words.' },
      { title: 'One reply and it stops', body: 'The moment someone answers, their follow-up ends and the conversation comes to you.' },
      { title: 'Easy to opt out', body: 'Every text lets people reply STOP, and anyone who opts out is removed for good.' },
    ],
    sample: {
      label: 'A sample follow-up text',
      from: 'Your business',
      channel: 'Text message',
      time: 'Today · 6:42 PM',
      message: 'Hi Dana, thanks for asking about the house on Linden Avenue. Would Saturday morning or Sunday afternoon work for a showing? Reply STOP to opt out.',
      reply: 'Saturday morning works.',
      stopped: 'Dana replied, so her follow-up stopped',
      note: 'Sample wording with a fictional person.',
    },
  },

  /** Where the money is, and whether it pays. */
  payoff: {
    eyebrow: 'Why it pays',
    title: 'Every lead that goes quiet is a sale you already paid for.',
    points: [
      {
        title: 'Leads you already paid for',
        body: 'Ads, referrals and your website bring people in. The ones nobody gets back to buy from someone else. We follow up with every one for you.',
      },
      {
        title: 'Old leads, new revenue',
        body: 'Quotes that went quiet are people who already wanted what you sell. We reach back out, so some of them come back.',
      },
      {
        title: 'Your team talks to buyers',
        body: 'We do the chasing. Replies and booked appointments come to you, so your people spend their time closing.',
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
    /** Where both columns end up: one inbox, both replies in it. */
    inbox: {
      title: 'Your inbox',
      count: '2 new replies',
      rows: [
        { from: 'New lead', text: '“Thursday works for me.”', tone: 'fresh' },
        { from: 'Old lead', text: '“Yes — still interested.”', tone: 'old' },
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
    eyebrow: 'Follow-up, handled',
    title: 'Follow up without living in your inbox.',
    body: 'We set up the sequence with you once. Then every follow-up goes out on time, the reply is caught, and you get the next step.',
  },

  second: {
    eyebrow: 'Old leads',
    title: 'Some conversations just need another chance.',
    body: 'A lead that went quiet isn’t a lost lead. We reach back out — and when they answer, the conversation comes back to you.',
  },

  showcase: {
    eyebrow: 'See it working',
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
