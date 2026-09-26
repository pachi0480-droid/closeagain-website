/** Homepage copy. The hero wording is approved — change it deliberately. */

export const home = {
  meta: {
    title: 'CloseAgain — The conversation isn’t over',
    description:
      'Follow up with missed inquiries and older leads. Restart the conversations that could become your next opportunity.',
  },

  hero: {
    /** Rendered as three spans so small screens can break after “The”. */
    headline: { lead: 'The', rest: 'conversation', close: 'isn’t over.' },
    lede: [
      'Follow up with missed inquiries and older leads.',
      'Restart the conversations that could become',
      'your next opportunity.',
    ],
    primary: { label: 'Book a demo', href: '/book-a-demo' },
    secondary: { label: 'See how it works', href: '/how-it-works' },
    exchange: { ask: 'Still interested?', reply: 'Yes. Let’s talk.' },
  },

  again: {
    word: 'Again.',
    lines: [
      'People get busy.',
      'Good opportunities go cold.',
      'CloseAgain helps you reach out again,',
      'so the right conversations get a second chance.',
    ],
  },

  revisit: {
    eyebrow: 'Worth revisiting',
    title: 'Three kinds of conversation that deserve another look.',
    items: [
      {
        title: 'Missed inquiries',
        body: 'For the people who reached out before a conversation could begin.',
      },
      {
        title: 'Unanswered quotes',
        body: 'For prospects who showed interest, then paused.',
      },
      {
        title: 'Older leads',
        body: 'For past conversations that may still have a next chapter.',
      },
    ],
    link: { label: 'Who it’s for', href: '/who-its-for' },
  },

  approach: {
    eyebrow: 'The approach',
    title: 'A second chance starts with a follow-up.',
    steps: [
      {
        title: 'Find the conversations worth revisiting.',
        body: 'Start with missed inquiries, unanswered quotes, and leads that went quiet.',
      },
      {
        title: 'Give them a reason to reply.',
        body: 'A thoughtful follow-up can reopen a conversation at the right moment.',
      },
      {
        title: 'Take the next step together.',
        body: 'Turn renewed interest into a useful conversation about what comes next.',
      },
    ],
    link: { label: 'See how it works', href: '/how-it-works' },
  },

  questions: {
    eyebrow: 'Questions, answered',
    title: 'Before we talk.',
    /** Answers are pulled from the FAQ page so the two never disagree. */
    pick: ['What is CloseAgain?', 'Is this about finding brand-new leads?', 'What happens in a demo?'],
    link: { label: 'All questions', href: '/faq' },
  },

  closing: {
    title: 'Let’s see what could start again.',
    cta: { label: 'Book a demo', href: '/book-a-demo' },
    secondary: { label: 'Ask a question', href: '/contact' },
  },
} as const
