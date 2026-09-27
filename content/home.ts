/**
 * Homepage copy. The hero headline is the brand — change it deliberately.
 *
 * The worked example follows one fictional lead. It demonstrates how
 * CloseAgain works; it is not a customer story and shows no results.
 */

import { availability, billingNote, planTerms, startingPriceText } from './pricing.ts'
import { primaryCta, site } from './site.ts'

export type ExampleActor = 'lead' | 'auto' | 'team'

export type ExampleMessage = {
  /** Small label above the message, e.g. “Sent automatically”. */
  tag: string
  when: string
  text: string
}

export type ExampleStep = {
  id: string
  /** Who acted: the lead, CloseAgain automatically, or the customer's team. */
  actor: ExampleActor
  kind: 'message' | 'gap' | 'event'
  /** Messages for `message` steps — a step can hold a reply and its follow-up. */
  messages?: readonly ExampleMessage[]
  /** The line shown for `gap` and `event` steps. */
  text?: string
  when?: string
  /** The lead's status once this step has happened. */
  status: string
  note: { title: string; body: string }
}

export const home = {
  meta: {
    title: 'CloseAgain — The conversation isn’t over',
    description: site.description,
  },

  hero: {
    category: site.category,
    /** Rendered as three spans so small screens can break after “The”. */
    headline: { lead: 'The', rest: 'conversation', close: 'isn’t over.' },
    /** Three lines on wide screens; wraps naturally elsewhere. */
    lede: [
      'Your next customer may already be in your inbox.',
      'Follow up with new inquiries. Reconnect with quiet leads.',
      'Give your team more chances to win the work.',
    ],
    primary: primaryCta,
    secondary: { label: 'Watch a conversation come back', href: '#conversation-demo' },
    terms: [startingPriceText, billingNote],
    exchange: { ask: 'Still interested?', reply: 'Yes. Let’s talk.' },
  },

  again: {
    word: 'Again.',
    lines: [
      'An unanswered inquiry. A quote that went quiet.',
      'A potential customer who just wasn’t ready.',
      'Good opportunities deserve another conversation.',
      'CloseAgain makes sure it happens.',
    ],
  },

  jobs: {
    eyebrow: 'What CloseAgain does',
    title: ['New inquiries.', 'Older leads.', 'One system.'],
    lede: 'For the person who just reached out, and the one who went quiet months ago. Keep both moving toward a real conversation with your team.',
    fresh: {
      label: 'New inquiries',
      job: 'Respond before interest fades.',
      steps: [
        { title: 'Inquiry arrives', meta: 'Website form · just now' },
        { title: 'Follow-up sent automatically', meta: 'A minute later' },
        { title: 'Lead replies', meta: '“Thursday works for me.”' },
      ],
    },
    old: {
      label: 'Older leads',
      job: 'Revisit leads that went quiet.',
      steps: [
        { title: 'Last contacted 84 days ago', meta: 'Quote sent · no reply' },
        { title: 'Re-engagement sent', meta: 'Automatically, on your schedule' },
        { title: 'Lead replies', meta: '“Yes — still interested.”' },
      ],
    },
    outcome: ['More replies.', 'More chances to close.'],
  },

  example: {
    eyebrow: 'A worked example',
    title: 'From inquiry to booked appointment.',
    lede: 'One lead, one thread: what CloseAgain does on its own, and where your team takes over.',
    note: 'The lead, the business and the timings are fictional.',
    lead: { name: 'Jordan Ellis', initials: 'JE', context: 'Kitchen remodel · Website form' },
    steps: [
      {
        id: 'inquiry',
        actor: 'lead',
        kind: 'message',
        messages: [
          {
            tag: 'New inquiry · Website form',
            when: 'Mon · 9:12 AM',
            text: 'Hi — could you quote a kitchen remodel? We’re hoping to start this summer.',
          },
        ],
        status: 'New inquiry',
        note: { title: 'An inquiry arrives.', body: 'Through your website form, while your team is busy with other work.' },
      },
      {
        id: 'follow-up',
        actor: 'auto',
        kind: 'message',
        messages: [
          {
            tag: 'Sent automatically',
            when: 'Mon · 9:13 AM',
            text: 'Thanks, Jordan — happy to help. Could we find 15 minutes this week to talk it through?',
          },
          {
            tag: 'Follow-up · sent automatically',
            when: 'Wed · 10:00 AM',
            text: 'Just checking in — would Thursday or Friday suit you for a quick call?',
          },
        ],
        status: 'Following up',
        note: {
          title: 'CloseAgain answers, then follows up.',
          body: 'A reply a minute later, in wording you approved. No answer? Follow-ups continue on your schedule, then stop.',
        },
      },
      {
        id: 'quiet',
        actor: 'lead',
        kind: 'gap',
        text: '92 days without a reply',
        status: 'Quiet',
        note: {
          title: 'Jordan goes quiet.',
          body: 'Plans change and people get busy. Without another follow-up, this lead is usually lost.',
        },
      },
      {
        id: 'again',
        actor: 'auto',
        kind: 'message',
        messages: [
          {
            tag: 'Re-engagement · sent automatically',
            when: 'June · 9:30 AM',
            text: 'Hi Jordan — still interested in the kitchen remodel? We have openings in July.',
          },
        ],
        status: 'Re-engaged',
        note: {
          title: 'Months later, CloseAgain checks back.',
          body: 'Older leads get another relevant message, on a schedule you approve.',
        },
      },
      {
        id: 'answer',
        actor: 'lead',
        kind: 'message',
        messages: [{ tag: 'Jordan replied', when: 'June · 11:04 AM', text: 'Yes. Let’s talk — is Thursday afternoon free?' }],
        status: 'Replied',
        note: {
          title: 'Jordan replies.',
          body: 'CloseAgain spots the reply, stops the follow-up and puts the thread in front of your team.',
        },
      },
      {
        id: 'booked',
        actor: 'auto',
        kind: 'event',
        text: 'Consultation · Thursday, 2:30 PM',
        when: 'Booked June · 11:20 AM',
        status: 'Appointment booked',
        note: {
          title: 'A consultation is booked.',
          body: `Through an appointment workflow (${availability('Appointment workflows').summary}), or by your team.`,
        },
      },
      {
        id: 'handoff',
        actor: 'team',
        kind: 'event',
        text: 'Handed to your team',
        status: 'With your team',
        note: {
          title: 'Your team closes the sale.',
          body: 'The visit, the quote and the decision are your team’s work. CloseAgain got Jordan this far.',
        },
      },
    ] satisfies readonly ExampleStep[],
    outcome: {
      title: 'Your team takes it from here.',
      body: 'A reply isn’t a customer, and an appointment isn’t revenue. CloseAgain makes sure interested people get an answer, a follow-up and a clear next step — so your team has more real chances to win the work.',
    },
  },

  capabilities: {
    eyebrow: 'Features',
    title: 'Four jobs that usually slip, handled.',
    link: { label: 'See how each one works', href: '/features' },
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'The right plan. Room to grow.',
    body: planTerms.join('\u00A0· '),
    link: { label: 'Compare plans', href: '/pricing' },
  },

  questions: {
    eyebrow: 'Before you get in touch',
    title: 'Good questions to ask.',
    /** FAQ entries shown on the homepage, by id (content/pages.ts → faq). */
    ids: ['find-leads', 'team-role', 'after-contact', 'contract'],
    link: { label: 'All questions', href: '/faq' },
  },

  closing: {
    title: 'Your next customer may already be in your inbox.',
    body: planTerms.join('\u00A0· '),
    cta: primaryCta,
    secondary: { label: 'See pricing', href: '/pricing' },
  },
} as const
