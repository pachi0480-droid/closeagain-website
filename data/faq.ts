export type FaqItem = { id: string; q: string; a: string }

export const faq: FaqItem[] = [
  {
    id: 'what',
    q: 'What is CloseAgain?',
    a: 'A revenue recovery layer for home-service businesses. It covers what happens after a customer has already shown interest — a missed call, an unanswered lead, a quiet estimate, a missed appointment — and tries to turn more of them into booked work.',
  },
  {
    id: 'crm',
    q: 'Is CloseAgain a CRM?',
    a: 'No. CloseAgain is being designed as a recovery layer focused on opportunities that begin slipping after initial interest. It is meant to complement the systems you already run rather than force you to replace them.',
  },
  {
    id: 'who',
    q: 'Who is CloseAgain for?',
    a: 'Home-service businesses with real inbound demand and real revenue lost to missed calls, slow follow-up, cold estimates, no-shows and forgotten opportunities. The initial focus is HVAC, plumbing and electrical.',
  },
  {
    id: 'staff',
    q: 'Does CloseAgain replace my office staff?',
    a: 'No. It covers the hours and the volume a person cannot — the 6:42 PM call, the fifth follow-up, the lead that went quiet three months ago. Anything that needs judgment, pricing or a real conversation goes to your team with the full context attached.',
  },
  {
    id: 'ai',
    q: 'Does CloseAgain use AI?',
    a: 'Yes, underneath. It reads what a customer wrote, works out what they need, and keeps the conversation moving toward a booking. That is a means, not the point — you should be able to judge CloseAgain entirely on how much work it recovers.',
  },
  {
    id: 'systems',
    q: 'What systems will CloseAgain connect with?',
    a: 'CloseAgain is being designed around the lead, scheduling and communication tools home-service teams already use. No integrations are being claimed as available yet. Specific connections will be confirmed as they are built, and pilot partners help set that order.',
  },
  {
    id: 'pricing',
    q: 'How is pricing structured?',
    a: 'Monthly plans, starting at $499 per month. Plans differ by how much of the lead lifecycle CloseAgain is recovering. There is no annual commitment and no annual pricing.',
  },
  {
    id: 'availability',
    q: 'Is CloseAgain available now?',
    a: 'Not yet. CloseAgain is pre-launch and currently accepting early-access and pilot interest. Product views shown on this site are illustrative of how the system is being designed to work, not screenshots of live customer activity.',
  },
]
