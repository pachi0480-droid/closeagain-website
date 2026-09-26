/**
 * Homepage copy. The hero headline is the brand — change it deliberately.
 *
 * Product views on this page show sample workflows with fictional people.
 * They demonstrate how CloseAgain works; they are not customer results.
 */

export const home = {
  meta: {
    title: 'CloseAgain — The conversation isn’t over',
    description:
      'CloseAgain captures new leads, follows up automatically, and re-engages old opportunities\u00A0— so more conversations become customers.',
  },

  hero: {
    /** Rendered as three spans so small screens can break after “The”. */
    headline: { lead: 'The', rest: 'conversation', close: 'isn’t over.' },
    /** Three lines on wide screens, as in the approved composition; wraps naturally elsewhere. */
    lede: [
      'CloseAgain captures new leads, follows up automatically,',
      'and re\u2011engages old opportunities\u00A0—',
      'so more conversations become customers.',
    ],
    primary: { label: 'Contact to buy', href: '/contact' },
    secondary: { label: 'See how it works', href: '/how-it-works' },
    terms: ['Plans start at $499/month', 'Monthly billing'],
    exchange: { ask: 'Still interested?', reply: 'Yes. Let’s talk.' },
  },

  again: {
    word: 'Again.',
    lines: [
      'People get busy.',
      'Good opportunities go cold.',
      'CloseAgain keeps new opportunities moving —',
      'and gives old conversations another chance.',
    ],
  },

  paths: {
    eyebrow: 'One system',
    title: ['New opportunities.', 'Old opportunities.', 'One system.'],
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

  story: {
    eyebrow: 'A morning with CloseAgain',
    title: 'From lead to customer.',
    body: 'Every step lands in one timeline — captured, followed up, answered and booked while interest is still high.',
    events: [
      { time: '9:12 AM', title: 'New lead captured', detail: 'Jordan Ellis · Website form', tone: 'ink' },
      { time: '9:13 AM', title: 'Follow-up sent', detail: '“Hi Jordan — thanks for reaching out. Could we find a time to talk this week?”', tone: 'ink' },
      { time: '9:18 AM', title: 'Lead replied', detail: '“Yes, Thursday afternoon works.”', tone: 'red' },
      { time: '9:21 AM', title: 'Appointment booked', detail: 'Thursday · 2:30 PM', tone: 'ink' },
      { time: '9:24 AM', title: 'Opportunity updated', detail: 'Stage moved to Appointment', tone: 'positive' },
    ],
  },

  followUp: {
    eyebrow: 'Automatic follow-up',
    title: 'Follow up without living in your inbox.',
    body: 'Set the sequence once. CloseAgain sends each follow-up on time, notices the reply, and hands you the next step.',
  },

  second: {
    eyebrow: 'Old leads',
    title: 'Some conversations just need another chance.',
    body: 'A lead that went quiet isn’t a lost lead. CloseAgain reaches back out — and when they answer, the conversation picks up where it left off.',
    lead: { name: 'Maya Chen', lastContact: '92 days ago' },
    steps: ['CloseAgain re-engages', 'Reply received', 'Opportunity reopened', 'Appointment booked'],
  },

  showcase: {
    eyebrow: 'The CloseAgain dashboard',
    title: 'One dashboard. Every conversation.',
    views: [
      { id: 'overview', label: 'Overview', body: 'New leads, active conversations and appointments at a glance.' },
      { id: 'conversations', label: 'Conversations', body: 'Every thread in one inbox, organized by stage.' },
      { id: 'leads', label: 'Leads', body: 'Source, score, status and the next action for every lead.' },
      { id: 'automations', label: 'Automations', body: 'Follow-up sequences, reply rates and what sends next.' },
      { id: 'appointments', label: 'Appointments', body: 'Upcoming bookings, no-shows and reminders.' },
      { id: 'analytics', label: 'Analytics', body: 'Where leads come from and how they convert.' },
    ],
    link: { label: 'Explore the product demo', href: '/demo' },
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Simple pricing. Serious results.',
    body: 'Monthly billing. Setup assistance included.',
    link: { label: 'Compare plans', href: '/pricing' },
  },

  closing: {
    title: 'Ready to close more conversations?',
    body: 'Plans start at $499/month. Monthly billing. Setup assistance included.',
    cta: { label: 'Contact to buy', href: '/contact' },
    secondary: { label: 'How getting started works', href: '/getting-started' },
  },
} as const
