/**
 * Copy for the supporting pages. Each object is one route.
 *
 * Nothing here should describe capabilities, channels, integrations, timelines
 * or results that have not been confirmed. If the business adds verified
 * details later, add them here rather than in components.
 */

export const howItWorks = {
  meta: {
    title: 'How it works',
    description:
      'Reconnect with missed inquiries and older leads, and give the right conversations room to continue.',
  },
  eyebrow: 'How it works',
  title: 'A second chance starts with a follow-up.',
  lede: 'Reconnect with missed inquiries and older leads. Give the right conversations room to continue.',
  steps: [
    {
      number: '01',
      title: 'Find the conversations worth revisiting.',
      body: 'Start with missed inquiries, unanswered quotes, and leads that went quiet.',
      example: null,
    },
    {
      number: '02',
      title: 'Give them a reason to reply.',
      body: 'A thoughtful follow-up can reopen a conversation at the right moment.',
      example: { from: 'ask', text: 'Still thinking it over? Happy to pick this back up.' },
    },
    {
      number: '03',
      title: 'Take the next step together.',
      body: 'Turn renewed interest into a useful conversation about what comes next.',
      example: { from: 'reply', text: 'Yes — let’s find a time to talk.' },
    },
  ],
  exampleLabel: 'Illustrative example',
  closing: {
    title: 'Let’s see what could start again.',
    cta: { label: 'Book a demo', href: '/book-a-demo' },
  },
} as const

export const whoItsFor = {
  meta: {
    title: 'Who it’s for',
    description:
      'For businesses with unfinished conversations: missed inquiries, unanswered quotes, and older leads.',
  },
  eyebrow: 'Who it’s for',
  title: 'For businesses with unfinished conversations.',
  lede: 'If people inquire, consider, and sometimes go quiet, there may be a conversation worth restarting.',
  rows: [
    {
      number: '01',
      title: 'Missed inquiries.',
      body: 'For the people who reached out before a conversation could begin.',
      detail: 'Reached out',
    },
    {
      number: '02',
      title: 'Unanswered quotes.',
      body: 'For prospects who showed interest, then paused.',
      detail: 'Went quiet',
    },
    {
      number: '03',
      title: 'Older leads.',
      body: 'For past conversations that may still have a next chapter.',
      detail: 'Worth another look',
    },
  ],
  closing: {
    title: 'Sound familiar?',
    body: 'Let’s look at where follow-up could fit in your business.',
    cta: { label: 'Book a demo', href: '/book-a-demo' },
  },
  word: 'Reconnect.',
} as const

export const pricing = {
  meta: {
    title: 'Pricing',
    description:
      'Tell us what you want to reconnect with, then discuss scope and pricing in a demo.',
  },
  eyebrow: 'Pricing',
  title: 'Start with a conversation.',
  lede: 'Tell us what you want to reconnect with. Discuss the scope and pricing in a demo.',
  offer: {
    title: 'Explore CloseAgain',
    body: 'A conversation about your business, your leads, and the right next step.',
    rows: [
      { title: 'Your goals.', body: 'What you want to reconnect with, and why it matters now.' },
      {
        title: 'Your follow-up needs.',
        body: 'The inquiries, quotes, and older leads you would like to revisit.',
      },
      { title: 'Your questions.', body: 'Anything you want answered before you decide.' },
    ],
    cta: { label: 'Discuss pricing', href: '/book-a-demo' },
    /**
     * Shown until approved pricing exists. Replace `status` with 'published'
     * and fill `details` once prices are confirmed.
     */
    status: 'unconfirmed' as 'unconfirmed' | 'published',
    note: 'Pricing details to be confirmed.',
    details: [] as string[],
  },
  clarity: {
    word: 'Clarity.',
    title: 'Before you decide.',
    body: 'Use the demo to understand the approach and ask what matters to your business.',
  },
} as const

export const about = {
  meta: {
    title: 'About',
    description:
      'Good conversations deserve another chapter. CloseAgain makes room for the follow-up that might otherwise never happen.',
  },
  eyebrow: 'About CloseAgain',
  title: 'Good conversations deserve another chapter.',
  lede: 'People get busy. Priorities shift. Interest doesn’t always disappear just because a conversation goes quiet.',
  statement: {
    word: 'Again.',
    title: 'A simple idea.',
    body: 'Make room for the follow-up that might otherwise never happen.',
  },
  principles: [
    { title: 'Revisit.', body: 'Look back at conversations with unfinished potential.' },
    { title: 'Reconnect.', body: 'Reach out with a reason to talk again.' },
    { title: 'Continue.', body: 'See whether there’s a useful next step.' },
  ],
  closing: {
    title: 'The next chapter could start here.',
    cta: { label: 'Book a demo', href: '/book-a-demo' },
  },
} as const

export const faq = {
  meta: {
    title: 'FAQ',
    description: 'A few things you might be wondering about CloseAgain before booking a demo.',
  },
  eyebrow: 'Questions, answered',
  title: 'Before we talk.',
  lede: 'A few things you might be wondering about CloseAgain.',
  items: [
    {
      q: 'What is CloseAgain?',
      a: 'A service focused on following up with missed inquiries and older leads.',
    },
    {
      q: 'Who is it for?',
      a: 'Businesses with inquiries, quotes, or past conversations worth revisiting.',
    },
    {
      q: 'Is this about finding brand-new leads?',
      a: 'The focus here is reconnecting with people who have already shown interest.',
    },
    {
      q: 'What happens in a demo?',
      a: 'We discuss your business, your follow-up needs, and whether CloseAgain could fit.',
    },
    {
      q: 'How much does it cost?',
      a: 'Pricing details are to be confirmed. Ask about scope and pricing in your demo.',
    },
    {
      q: 'Where should I start?',
      a: 'Book a demo or send us a question.',
      links: [
        { label: 'Book a demo', href: '/book-a-demo' },
        { label: 'Send a question', href: '/contact' },
      ],
    },
  ],
  closing: {
    title: 'Ask away.',
    cta: { label: 'Contact us', href: '/contact' },
  },
} as const

export const contact = {
  meta: {
    title: 'Contact',
    description: 'Have a question about CloseAgain? Tell us what’s on your mind.',
  },
  eyebrow: 'Contact',
  title: 'Let’s keep the conversation going.',
  lede: 'Have a question about CloseAgain? Tell us what’s on your mind.',
  form: {
    submit: 'Send message',
    guidance: 'Please avoid sharing sensitive information.',
  },
  lower: {
    title: 'Prefer to see how it works?',
    body: 'Start with a demo focused on your business.',
    cta: { label: 'Book a demo', href: '/book-a-demo' },
  },
} as const

export const bookDemo = {
  meta: {
    title: 'Book a demo',
    description:
      'Tell us a little about your business and request a CloseAgain demo. A meeting time is arranged after your request.',
  },
  eyebrow: 'Book a demo',
  title: 'See what could start again.',
  lede: 'Tell us a little about your business. Let’s explore where CloseAgain could fit.',
  form: {
    submit: 'Request a demo',
    guidance: 'This is a demo request. A meeting time is not yet reserved.',
  },
  lower: {
    title: 'A conversation about your business.',
    columns: [
      { title: 'Your leads.', body: 'Where inquiries come from, and which ones tend to go quiet.' },
      { title: 'Your follow-up.', body: 'How follow-up happens today, and where conversations stall.' },
      { title: 'Your next step.', body: 'Whether CloseAgain could fit, and what a sensible start looks like.' },
    ],
  },
} as const

export const thankYou = {
  meta: { title: 'Thank you' },
  demo: {
    eyebrow: 'Request received',
    title: 'The conversation starts here.',
    body: 'Thanks for your interest in CloseAgain. Your demo request has been received. A meeting time has not been confirmed yet.',
  },
  contact: {
    eyebrow: 'Message received',
    title: 'Thanks for reaching out.',
    body: 'Your message has been received.',
  },
  neutral: {
    eyebrow: 'CloseAgain',
    title: 'Let’s start a conversation.',
    body: 'Request a demo, or send us a question — whichever suits you.',
    actions: [
      { label: 'Book a demo', href: '/book-a-demo' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  actions: {
    primary: { label: 'Explore how it works', href: '/how-it-works' },
    secondary: { label: 'Back to home', href: '/' },
  },
  bubble: 'Let’s talk.',
} as const

export const notFound = {
  code: '404',
  title: 'Let’s try that again.',
  body: 'This page seems to have gone quiet. Let’s get you back to the conversation.',
  primary: { label: 'Back to home', href: '/' },
  secondary: { label: 'Contact us', href: '/contact' },
  links: [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Who it’s for', href: '/who-its-for' },
    { label: 'Book a demo', href: '/book-a-demo' },
  ],
} as const
