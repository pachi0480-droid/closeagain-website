/**
 * Copy for the supporting pages. Each object is one route.
 *
 * Describe what CloseAgain does; never invent results, customer counts,
 * testimonials, named integrations or timelines. Product views are sample
 * workflows with fictional people.
 */

export const howItWorks = {
  meta: {
    title: 'How it works',
    description:
      'Leads enter CloseAgain, follow-up goes out automatically, replies move forward, and your team takes over where it matters.',
  },
  eyebrow: 'How it works',
  title: 'One path from first message to customer.',
  lede: 'CloseAgain captures new leads, follows up automatically, and re-engages old opportunities — so more conversations become customers.',
  steps: [
    {
      number: '01',
      title: 'Leads enter CloseAgain.',
      body: 'New inquiries arrive from your connected sources. Older leads can come in too, ready for a second conversation.',
      preview: 'intake',
    },
    {
      number: '02',
      title: 'CloseAgain follows up.',
      body: 'Follow-ups go out automatically, on the schedule you choose, while interest is still high.',
      preview: 'sequence',
    },
    {
      number: '03',
      title: 'The lead replies.',
      body: 'Replies land in one inbox, organized by stage, with the whole conversation in view.',
      preview: 'reply',
    },
    {
      number: '04',
      title: 'The opportunity moves forward.',
      body: 'Interested leads move toward the next step — an appointment, a quote, a call.',
      preview: 'booking',
    },
    {
      number: '05',
      title: 'Your team takes over where needed.',
      body: 'Step in at any point. The context is already there, so nobody starts from zero.',
      preview: 'handoff',
    },
    {
      number: '06',
      title: 'Performance is tracked.',
      body: 'See new leads, recovered leads, replies and appointments in one dashboard.',
      preview: 'analytics',
    },
  ],
  closing: {
    title: 'Ready to close more conversations?',
    body: 'Plans start at $499/month. Monthly billing. Setup assistance included.',
    cta: { label: 'Contact to buy', href: '/contact' },
    secondary: { label: 'See pricing', href: '/pricing' },
  },
} as const

export const features = {
  meta: {
    title: 'Features',
    description:
      'Lead capture, automatic follow-up, old lead recovery, a smart inbox, appointment workflows, automations, analytics and integrations.',
  },
  eyebrow: 'Features',
  title: 'Everything a conversation needs to keep moving.',
  lede: 'Capture every new lead, follow up without thinking about it, and bring old opportunities back — all from one place.',
  items: [
    {
      id: 'capture',
      name: 'New Lead Capture',
      title: 'Every new lead, captured the moment it arrives.',
      body: 'Inquiries from your connected sources land in one place — with the source, the details and a next step attached.',
      preview: 'intake',
    },
    {
      id: 'follow-up',
      name: 'Automated Follow-Ups',
      title: 'Follow up while interest is still high.',
      body: 'CloseAgain sends the first reply fast and keeps following up on your schedule, until the lead answers.',
      preview: 'sequence',
    },
    {
      id: 'recovery',
      name: 'Old Lead Recovery',
      title: 'Bring quiet leads back into the conversation.',
      body: 'Reach back out to leads that went cold weeks or months ago — and reopen the ones that reply.',
      preview: 'reengage',
    },
    {
      id: 'channels',
      name: 'Multi-Channel Conversations',
      title: 'Meet leads where they reply.',
      body: 'Conversations across your connected channels stay together in a single thread.',
      preview: 'thread',
    },
    {
      id: 'inbox',
      name: 'Smart Inbox',
      title: 'An inbox organized by what happens next.',
      body: 'Replies are grouped by stage and next action, so your team always knows where to step in.',
      preview: 'inbox',
    },
    {
      id: 'appointments',
      name: 'Appointment Workflows',
      title: 'From reply to booked appointment.',
      body: 'Move interested leads to a booking, send reminders, and follow up when someone misses a time.',
      preview: 'booking',
    },
    {
      id: 'automations',
      name: 'Automations',
      title: 'Build the follow-up once.',
      body: 'Create sequences and rules for new leads, quiet leads and no-shows — then let them run.',
      preview: 'builder',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      title: 'See what’s working.',
      body: 'Track new leads, recovered leads, response rates and appointments — by source and over time.',
      preview: 'analytics',
    },
    {
      id: 'integrations',
      name: 'Integrations',
      title: 'Connect the tools you already use.',
      body: 'Bring leads in from your forms and systems, and keep your calendar and CRM in step.',
      preview: 'integrations',
    },
  ],
  closing: {
    title: 'See it working on your leads.',
    body: 'Plans start at $499/month. Monthly billing. Setup assistance included.',
    cta: { label: 'Contact to buy', href: '/contact' },
    secondary: { label: 'Explore the product demo', href: '/demo' },
  },
} as const

export const whoItsFor = {
  meta: {
    title: 'Who it’s for',
    description:
      'CloseAgain is for lead-driven businesses — real estate, home services, med spas, law firms, agencies, SaaS, e-commerce and more.',
  },
  eyebrow: 'Who it’s for',
  title: 'For businesses that live on conversations.',
  lede: 'If leads come in, go quiet and come back, CloseAgain keeps them moving.',
  industries: [
    {
      id: 'real-estate',
      formValue: 'Real estate',
      name: 'Real Estate',
      outcome: 'Follow up with every buyer and seller inquiry — and revisit past leads.',
      image: '/industries/real-estate.webp',
    },
    {
      id: 'home-services',
      formValue: 'Home services',
      name: 'Home Services',
      outcome: 'Answer new requests fast and bring back unanswered quotes.',
      image: '/industries/home-services.webp',
    },
    {
      id: 'med-spas',
      formValue: 'Med spa',
      name: 'Med Spas',
      outcome: 'Turn consultation inquiries into booked appointments.',
      image: '/industries/med-spas.webp',
    },
    {
      id: 'law-firms',
      formValue: 'Law firm',
      name: 'Law Firms',
      outcome: 'Respond to new inquiries and keep consultations moving.',
      image: '/industries/law-firms.webp',
    },
    {
      id: 'agencies',
      formValue: 'Agency',
      name: 'Agencies',
      outcome: 'Keep prospects warm from first inquiry to signed proposal.',
      image: '/industries/agencies.webp',
    },
    {
      id: 'saas',
      formValue: 'SaaS & technology',
      name: 'SaaS & Technology',
      outcome: 'Follow up on trials and sales inquiries before interest fades.',
      image: '/industries/saas.webp',
    },
    {
      id: 'ecommerce',
      formValue: 'E-commerce',
      name: 'E-commerce',
      outcome: 'Re-engage past customers and inquiries that went quiet.',
      image: '/industries/ecommerce.webp',
    },
    {
      id: 'other',
      formValue: 'Other lead-driven business',
      name: 'Other Lead-Driven Businesses',
      outcome: 'If leads come in and go quiet, CloseAgain keeps them moving.',
      image: '/industries/other.webp',
    },
  ],
  imageNote: 'Editorial imagery. Generated for this site; not customer photography.',
  closing: {
    title: 'Sound familiar?',
    body: 'Tell us about your leads and we’ll recommend the right plan.',
    cta: { label: 'Talk to us', href: '/contact' },
  },
  word: 'Reconnect.',
} as const

export const pricingPage = {
  meta: {
    title: 'Pricing',
    description:
      'CloseAgain plans: Core $499/month, Growth $899/month, Scale $1,499/month, and custom Enterprise. Monthly billing. Setup assistance included.',
  },
  eyebrow: 'Pricing',
  title: ['Simple pricing.', 'Serious results.'],
  lede: 'Choose the plan that fits your business. Monthly billing. Setup assistance included.',
  compare: { open: 'Compare all features', close: 'Hide comparison' },
  reassurance: [
    { title: 'Monthly billing.', body: 'Plans are billed month to month.' },
    { title: 'Setup assistance included.', body: 'We help configure CloseAgain for your business on every plan.' },
    { title: 'Not sure which plan?', body: 'Tell us about your leads and we’ll recommend one.' },
  ],
  closing: {
    title: 'Pick a plan, or talk it through.',
    body: 'Setup timing depends on your integrations and requirements.',
    cta: { label: 'Contact to buy', href: '/contact' },
    secondary: { label: 'What happens after you buy', href: '/after-you-buy' },
  },
} as const

export const afterYouBuy = {
  meta: {
    title: 'What happens after you buy',
    description:
      'Choose your plan, tell us about your business, connect your tools, and we configure CloseAgain with you before you go live.',
  },
  eyebrow: 'After you buy',
  title: 'What happens after you buy.',
  lede: 'A short, guided setup. Setup assistance is included on every plan.',
  steps: [
    { number: '01', title: 'Choose your plan', body: 'Pick the plan that fits your leads and goals — or ask us to recommend one.' },
    { number: '02', title: 'Tell us about your business', body: 'Your lead sources, the tools you use and how follow-up works today.' },
    { number: '03', title: 'Connect your tools', body: 'We help connect your lead sources, calendar and CRM.' },
    { number: '04', title: 'We configure CloseAgain', body: 'Follow-up sequences, re-engagement and workflows, set up for your business.' },
    { number: '05', title: 'Review your setup', body: 'You review the messages and workflows before anything goes live.' },
    { number: '06', title: 'Go live', body: 'CloseAgain starts capturing, following up and re-engaging.' },
  ],
  included: 'Setup assistance included.',
  timing: 'Setup timing depends on your integrations and requirements.',
  closing: {
    title: 'Ready when you are.',
    body: 'Plans start at $499/month. Monthly billing.',
    cta: { label: 'Contact to buy', href: '/contact' },
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
  statement: {
    word: 'Again.',
    title: 'Why CloseAgain exists.',
    body: [
      'CloseAgain keeps those conversations moving — capturing new leads as they arrive, following up automatically, and giving older opportunities another chance.',
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
    cta: { label: 'Contact to buy', href: '/contact' },
  },
} as const

export const faq = {
  meta: {
    title: 'FAQ',
    description: 'Answers about CloseAgain: new leads, old leads, automatic follow-up, channels, CRM connections, appointments, setup and plans.',
  },
  eyebrow: 'Questions, answered',
  title: 'Before you buy.',
  lede: 'The things people usually ask about CloseAgain.',
  items: [
    {
      q: 'What is CloseAgain?',
      a: 'CloseAgain captures new leads, follows up automatically, and re-engages old opportunities — so more conversations become customers.',
    },
    {
      q: 'Does CloseAgain work with new leads?',
      a: 'Yes. New leads from your connected sources are captured as they arrive, and CloseAgain follows up automatically while interest is high.',
    },
    {
      q: 'Can CloseAgain re-engage old leads?',
      a: 'Yes. CloseAgain can reach back out to leads that went quiet — weeks or months ago — and bring their replies into the same inbox.',
    },
    {
      q: 'How does automatic follow-up work?',
      a: 'You choose the follow-up sequence for your business. When a lead arrives, CloseAgain sends the first message and keeps following up on schedule until the lead replies or the sequence ends. Replies appear in your inbox so your team can take over.',
    },
    {
      q: 'What channels are supported?',
      a: 'CloseAgain is built for multi-channel conversations. The channels available for your business are confirmed during setup, based on your plan and the tools you already use.',
    },
    {
      q: 'Can I connect my CRM?',
      a: 'Every plan includes standard integrations; Growth and Scale add more, and Enterprise includes custom integrations. Tell us which CRM you use and we’ll confirm how it connects.',
    },
    {
      q: 'Does CloseAgain book appointments?',
      a: 'CloseAgain helps move replies toward a booked appointment. Appointment workflows — booking, reminders and no-show follow-up — are included from the Growth plan up.',
    },
    {
      q: 'Is setup included?',
      a: 'Yes. Every plan includes setup assistance. Setup timing depends on your integrations and requirements.',
    },
    {
      q: 'Is there an annual contract?',
      a: 'CloseAgain plans are billed monthly. Enterprise terms are agreed individually.',
    },
    {
      q: 'Which plan should I choose?',
      a: 'Core suits smaller businesses that need reliable capture and follow-up. Growth adds advanced automations and appointment workflows. Scale adds higher limits, custom workflows and multi-user collaboration. Enterprise is built around custom requirements. Not sure? Tell us about your business and we’ll recommend a fit.',
      links: [{ label: 'Compare plans', href: '/pricing' }],
    },
    {
      q: 'What happens after I contact you?',
      a: 'We review your details, confirm the right plan and setup, help connect your tools, and launch CloseAgain with you.',
      links: [{ label: 'What happens after you buy', href: '/after-you-buy' }],
    },
  ],
  closing: {
    title: 'Still have a question?',
    body: 'Ask us anything — we’ll point you to the right plan.',
    cta: { label: 'Talk to us', href: '/contact' },
  },
} as const

export const contact = {
  meta: {
    title: 'Contact to buy',
    description:
      'Tell us about your business and choose a plan. Plans start at $499/month with monthly billing and setup assistance included.',
  },
  eyebrow: 'Contact to buy',
  title: 'Ready to close more conversations?',
  lede: 'Tell us about your business. We’ll confirm the right plan and setup.',
  terms: ['Plans start at $499/month.', 'Monthly billing.', 'Setup assistance included.'],
  next: {
    title: 'What happens next',
    steps: ['Send your information', 'We confirm the right setup', 'Connect your tools', 'Launch CloseAgain'],
  },
  form: {
    submit: 'Send my details',
    guidance: 'No payment is taken here. Please don’t include sensitive information.',
  },
} as const

export const thankYou = {
  meta: { title: 'Thank you' },
  purchase: {
    eyebrow: 'Details received',
    title: 'The conversation starts here.',
    body: 'Thanks — we’ve received your details. Next, we’ll confirm the right plan and setup for your business.',
  },
  neutral: {
    eyebrow: 'CloseAgain',
    title: 'Let’s start a conversation.',
    body: 'Choose a plan or tell us about your business — whichever suits you.',
    actions: [
      { label: 'Contact to buy', href: '/contact' },
      { label: 'See pricing', href: '/pricing' },
    ],
  },
  actions: {
    primary: { label: 'What happens after you buy', href: '/after-you-buy' },
    secondary: { label: 'Back to home', href: '/' },
  },
  bubble: 'Let’s talk.',
} as const

export const notFound = {
  code: '404',
  title: 'Let’s try that again.',
  body: 'This page seems to have gone quiet. Let’s get you back to the conversation.',
  primary: { label: 'Back to home', href: '/' },
  secondary: { label: 'Contact to buy', href: '/contact' },
  links: [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
  ],
} as const
