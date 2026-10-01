/**
 * One landing page per industry, at /who-its-for/<slug>.
 *
 * Names, one-line outcomes and the contact-form value come from
 * `whoItsFor` in pages.ts, so the overview and these pages can never
 * disagree. Everything else here is written for the industry: where its leads
 * slip, what CloseAgain does about it, and sample follow-up wording.
 *
 * Honesty rules for this file:
 * - Describe what CloseAgain does and the plain outcome (more of their leads
 *   become customers). Never a number, a result, a response time, a
 *   testimonial or a named customer.
 * - Every leak names the comparison row that covers it, so the page says
 *   which plans include it straight from content/pricing.ts.
 * - Sample messages are fictional wording for fictional people. They never
 *   give advice, name a real business or promise a booking mechanism.
 */

import { pricingPage, whoItsFor } from './pages.ts'
import { availability, billingNote, planTerms, startingPriceText } from './pricing.ts'
import { primaryCta } from './site.ts'

type Base = (typeof whoItsFor.industries)[number]
export type IndustryId = Base['id']

/** The product views an industry page can show (components/previews). */
export type IndustryPreviewKind = 'intake' | 'reengage' | 'booking' | 'handoff' | 'sequence' | 'builder' | 'inbox' | 'thread'

/** Where leads slip, and what CloseAgain does about it. */
export type IndustryLeak = {
  title: string
  body: string
  fix: string
  /** The comparison row in content/pricing.ts that covers the fix. */
  row: string
}

/** Sample wording: when it would go out, the message, and an optional reply. */
export type SampleMessage = { moment: string; message: string; reply?: string }

type IndustryCopy = {
  slug: string
  /** Completes the title: “Lead follow-up for <audience>”. */
  audience: string
  /** Meta description: about 150 characters, plain, money first. */
  description: string
  lede: string
  leaksTitle: string
  leaks: readonly [IndustryLeak, IndustryLeak, IndustryLeak]
  examples: readonly SampleMessage[]
  preview: { kind: IndustryPreviewKind; title: string; body: string; row: string }
  /** Other industry pages worth reading next. */
  related: readonly IndustryId[]
  closingTitle: string
}

export type Industry = IndustryCopy & {
  id: IndustryId
  name: string
  outcome: string
  /** The contact form’s industry option (content/forms.ts). */
  industryValue: string
  title: string
  path: string
  /** Contact to buy, with this industry already chosen. */
  contactHref: string
}

/** Shared words for every industry page. */
export const industryPage = {
  eyebrow: whoItsFor.eyebrow,
  overview: { label: whoItsFor.eyebrow, href: '/who-its-for' },
  titleLead: 'Lead follow-up',
  cta: primaryCta.label,
  secondary: { label: 'See pricing', href: '/pricing' },
  terms: [startingPriceText, billingNote],
  leaks: {
    eyebrow: 'Where leads slip',
    fixLabel: 'With CloseAgain',
    plansLabel: 'Included on',
  },
  examples: {
    eyebrow: 'What CloseAgain sends',
    title: 'Follow‑up in your words, sent on time.',
    note: 'Sample wording with fictional people. Your follow-up uses wording you approve.',
    sent: 'Sent automatically',
    replied: 'Reply received — follow-up stops',
  },
  /** Beside the title: this industry's inbox, with its sample leads' replies arriving. */
  moment: {
    title: 'Inbox',
    tag: 'Sample',
    replied: 'Replied',
    following: 'Following up',
    note: 'Follow-up stops the moment they reply.',
  },
  preview: {
    eyebrow: 'Inside CloseAgain',
    link: { label: 'Explore the features', href: '/features' },
  },
  pricing: {
    eyebrow: 'Pricing',
    title: pricingPage.title.join(' '),
    body: planTerms.join(' · '),
    link: { label: 'Compare all plans', href: '/pricing' },
  },
  related: {
    lead: 'CloseAgain also works for',
    link: { label: 'All industries', href: '/who-its-for' },
    /** The link on each card on the /who-its-for overview. */
    go: 'See how it works',
  },
  closing: {
    body: planTerms.join(' · '),
    secondary: { label: 'See how it works', href: '/how-it-works' },
  },
} as const

const copy: Record<IndustryId, IndustryCopy> = {
  'real-estate': {
    slug: 'real-estate',
    audience: 'real estate',
    description:
      'CloseAgain follows up with every buyer and seller inquiry automatically and checks back with past leads — so more of your real estate leads become clients.',
    lede: 'CloseAgain follows up with every buyer and seller inquiry automatically, and checks back with the people who weren’t ready yet — so more of your leads become clients.',
    leaksTitle: 'Where real estate leads slip away.',
    leaks: [
      {
        title: 'Listing inquiries that wait until evening',
        body: 'A buyer asks about a home while you’re at a showing. By the time you call back, they’ve already talked to another agent.',
        fix: 'CloseAgain answers the inquiry while you’re busy and follows up on schedule, stopping as soon as they reply.',
        row: 'Automated follow-up',
      },
      {
        // Non-breaking hyphens: the title never splits “sign‑ins” across lines.
        title: 'Open‑house sign‑ins nobody follows up',
        body: 'The sign-in sheet goes into a folder. A week later the names are cold, and nobody knows who was serious.',
        fix: 'Bring the sign-ins into CloseAgain and every visitor gets a thank-you and a follow-up on your schedule.',
        row: 'Follow-up sequences',
      },
      {
        title: 'Past clients and old buyers who went quiet',
        body: 'The buyer who paused last spring and the seller who wasn’t ready are still in your database. When they move, they’ll call whoever reached out last.',
        fix: 'CloseAgain checks back with old leads and past clients, and reopens the conversation when they reply.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'New inquiry on a listing, in the evening',
        message:
          'Hi Dana — thanks for asking about the house on Linden Avenue. It’s still available. Would Saturday morning or Sunday afternoon work for a showing?',
        reply: 'Saturday morning works.',
      },
      {
        moment: 'Open-house visitor, the next day',
        message:
          'Hi Marco — thanks for stopping by the open house on Sunday. Was it close to what you’re looking for? I can send a few similar homes if that helps.',
        reply: 'Yes, please send them.',
      },
      {
        moment: 'Buyer who went quiet months ago',
        message: 'Hi Elise — it’s been a while since we looked at homes together. Are you still thinking about moving this year?',
      },
    ],
    preview: {
      kind: 'intake',
      title: 'Every inquiry lands in one place.',
      body: 'New leads arrive from the sources you connect, each with where it came from and what it asked about — so no one waits on a callback.',
      row: 'New lead capture',
    },
    related: ['home-services', 'law-firms', 'other'],
    closingTitle: 'Follow up with every buyer and seller.',
  },

  'home-services': {
    slug: 'home-services',
    audience: 'home services',
    description:
      'CloseAgain answers new service requests and follows up on estimates that went quiet, automatically — so more of your home service quotes become booked jobs.',
    lede: 'CloseAgain answers new service requests, follows up on every estimate you send and brings back the ones that were never accepted — so more of your quotes become booked jobs.',
    leaksTitle: 'Where home service jobs slip away.',
    leaks: [
      {
        title: 'Requests that come in while you’re on a job',
        body: 'Your crew is on a roof when the form comes in. The homeowner has asked three companies, and books whoever gets back first.',
        fix: 'CloseAgain replies while you work and asks when a visit would suit them.',
        row: 'Automated follow-up',
      },
      {
        title: 'Estimates that never get a second call',
        body: 'You drive out, measure up and send the quote. Then the week fills up, and nobody calls to ask whether they have questions.',
        fix: 'CloseAgain follows up on every estimate on the schedule you set, and stops when the homeowner replies.',
        row: 'Follow-up sequences',
      },
      {
        title: 'Old quotes that were never accepted',
        body: 'Last season’s estimates are people who already wanted the work done. Plenty of them just put it off.',
        fix: 'CloseAgain reaches back out to old quotes before your busy season, and reopens the ones that reply.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'New request, mid-afternoon',
        message:
          'Hi Sam — thanks for reaching out about your water heater. We can take a look this week. Would Wednesday morning or Thursday afternoon suit you?',
        reply: 'Thursday afternoon works.',
      },
      {
        moment: 'Estimate sent, no reply yet',
        message:
          'Hi Lauren — just checking in on the fence estimate we sent over. Any questions I can answer, or anything you’d like us to change?',
      },
      {
        moment: 'Last fall’s quote, before the season',
        message:
          'Hi Chris — last fall we quoted your gutter replacement. Our spring calendar is filling up. Would you like us to hold a spot for you?',
        reply: 'Yes, let’s get it scheduled.',
      },
    ],
    preview: {
      kind: 'reengage',
      title: 'Old quotes get another chance.',
      body: 'CloseAgain reaches back out to leads that went quiet and reopens the conversation when they reply, so the job can still go on your calendar.',
      row: 'Old lead re-engagement',
    },
    related: ['real-estate', 'med-spas', 'ecommerce'],
    closingTitle: 'Turn more estimates into booked jobs.',
  },

  'med-spas': {
    slug: 'med-spas',
    audience: 'med spas',
    description:
      'CloseAgain follows up with every consultation inquiry and checks back with past clients, automatically — so more of your med spa inquiries become booked treatments.',
    lede: 'CloseAgain answers consultation inquiries, follows up on schedule, and checks back with past clients who are due for another visit — so more inquiries become booked treatments.',
    leaksTitle: 'Where med spa bookings slip away.',
    leaks: [
      {
        title: 'Consultation inquiries that sit overnight',
        body: 'Someone reads about a treatment late at night and fills out your form. By the time the front desk opens, they’ve booked somewhere else.',
        fix: 'CloseAgain answers the inquiry when it arrives and asks when they’d like to come in.',
        row: 'Automated follow-up',
      },
      {
        title: 'Consultations that turn into no‑shows',
        body: 'A booked consultation only counts if they walk in. A missed visit often never gets rescheduled, because no one has time to chase it.',
        fix: 'When someone misses a visit, CloseAgain follows up to find a new time.',
        row: 'No-show recovery',
      },
      {
        title: 'Past clients who are due to come back',
        body: 'Clients who loved their first treatment still need a nudge to book the next one — and that nudge usually falls to a busy front desk.',
        fix: 'CloseAgain checks back with past clients and old inquiries, and brings the replies into one inbox.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'Consultation inquiry, late evening',
        message:
          'Hi Ava — thanks for asking about a consultation. We’d love to see you. Do weekday mornings or Saturday afternoons suit you better?',
        reply: 'Saturday afternoon, please.',
      },
      {
        moment: 'Missed consultation, the same day',
        message: 'Hi Nicole — we missed you at your consultation today. No problem at all. Would you like to pick a new time this week?',
        reply: 'Sorry! Is Thursday open?',
      },
      {
        moment: 'Past client, a few months on',
        message: 'Hi Jess — it’s been a few months since your last visit. Would you like us to find you a time before the holidays?',
      },
    ],
    preview: {
      kind: 'booking',
      title: 'From reply to booked consultation.',
      body: 'Interested clients move toward a booking, and reminders go out before the visit — so fewer appointments go missing.',
      row: 'Appointment workflows',
    },
    related: ['home-services', 'law-firms', 'real-estate'],
    closingTitle: 'Turn more inquiries into booked consultations.',
  },

  'law-firms': {
    slug: 'law-firms',
    audience: 'law firms',
    description:
      'CloseAgain answers new client inquiries, follows up on schedule and checks back with the ones who went quiet — so more of your law firm’s inquiries become clients.',
    lede: 'CloseAgain answers new inquiries, including the ones that arrive after hours, and follows up on schedule — so more of the people who contact your firm become clients.',
    leaksTitle: 'Where potential clients slip away.',
    leaks: [
      {
        title: 'Inquiries that arrive after hours',
        body: 'People often look for a lawyer in the evening, once the day is done. By morning, they may have contacted the next firm on the list.',
        fix: 'CloseAgain answers the inquiry when it arrives and asks for a good time to talk.',
        row: 'Automated follow-up',
      },
      {
        title: 'Consultations that never get scheduled',
        body: 'An interested caller says they’ll check their calendar and get back to you. Then no one follows up, and the matter goes elsewhere.',
        fix: 'CloseAgain follows up on schedule and stops when they reply; every reply lands in one inbox for your intake team.',
        row: 'Unified conversation inbox',
      },
      {
        title: 'Past inquiries who weren’t ready',
        body: 'Some people reach out and then wait. The problem doesn’t go away, and when they’re ready they’ll call whoever is in front of them.',
        fix: 'CloseAgain checks back with older inquiries and reopens the conversation when they reply.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'Web inquiry, after hours',
        message:
          'Hi Daniel — thank you for contacting us. We’ve received your message. Would a short call tomorrow morning or afternoon work, so we can hear more about your situation?',
        reply: 'Tomorrow morning is best.',
      },
      {
        moment: 'Consultation not yet scheduled',
        message: 'Hi Rosa — following up on your inquiry last week. We’d still be glad to talk it through. Is there a day this week that suits you?',
      },
      {
        moment: 'Older inquiry, a few months later',
        message: 'Hi Tom — you reached out to us earlier this year. If you’d still like to talk, we’re here. Just reply and we’ll find a time.',
        reply: 'Thank you — next week, if possible.',
      },
    ],
    preview: {
      kind: 'handoff',
      title: 'Your team steps in with the whole story.',
      body: 'Take over any conversation with every earlier message in view. The consultation and the advice always stay with your people.',
      row: 'Unified conversation inbox',
    },
    related: ['med-spas', 'agencies', 'real-estate'],
    closingTitle: 'Answer every inquiry, even after hours.',
  },

  agencies: {
    slug: 'agencies',
    audience: 'agencies',
    description:
      'CloseAgain follows up with new inquiries and sent proposals automatically, and reopens old prospects — so more of your agency’s prospects become signed clients.',
    lede: 'CloseAgain replies to new inquiries, follows up on the proposals you send and reopens prospects who went quiet — so more conversations turn into signed clients.',
    leaksTitle: 'Where agency prospects slip away.',
    leaks: [
      {
        title: 'Inquiries that wait for a free moment',
        body: 'Client work always comes first, so new inquiries wait until someone has time. Meanwhile, the prospect is on calls with other agencies.',
        fix: 'CloseAgain replies for you and asks for a good time for an intro call.',
        row: 'Automated follow-up',
      },
      {
        title: 'Proposals sent into silence',
        body: 'You send the proposal and wait. A week later, nobody is sure whether to nudge or give up — so nobody does either.',
        fix: 'CloseAgain follows up on the schedule you set, and stops as soon as the prospect replies.',
        row: 'Follow-up sequences',
      },
      {
        title: 'Prospects who said “not right now”',
        body: 'Budgets reopen and priorities change. The prospect who wasn’t ready last quarter might be ready now.',
        fix: 'CloseAgain checks back with old prospects and hands the ones who reply to your team.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'New inquiry from your website',
        message:
          'Hi Hannah — thanks for getting in touch about your rebrand. Would a short intro call this week be useful? Tuesday or Thursday both work on our side.',
        reply: 'Thursday works.',
      },
      {
        moment: 'Proposal sent, no reply yet',
        message:
          'Hi Owen — just checking in on the proposal we sent last week. Happy to walk through it on a call, or adjust the scope if that would help.',
        reply: 'Can we do a call Friday?',
      },
      {
        moment: 'Prospect from last quarter',
        message: 'Hi Mei — we spoke earlier in the year about your new website. Is it still on your list? We’d be glad to pick it back up.',
      },
    ],
    preview: {
      kind: 'sequence',
      title: 'Follow‑up that stops when they answer.',
      body: 'Each follow-up goes out on the schedule you approve. When the prospect replies, the sequence stops and your team picks it up.',
      row: 'Follow-up sequences',
    },
    related: ['saas', 'law-firms', 'ecommerce'],
    closingTitle: 'Turn more proposals into signed clients.',
  },

  saas: {
    slug: 'saas-technology',
    audience: 'SaaS and technology',
    description:
      'CloseAgain follows up on demo requests and quiet trials automatically, and reopens stalled opportunities — so more of your SaaS sign-ups become paying customers.',
    lede: 'CloseAgain follows up on demo requests, checks in on trials that went quiet and reopens stalled opportunities — so more of your sign-ups become paying customers.',
    leaksTitle: 'Where trials and demos slip away.',
    leaks: [
      {
        title: 'Demo requests that wait for a rep',
        body: 'A prospect asks for a demo late on a Friday. By Monday, they’re on a call with a competitor.',
        fix: 'CloseAgain replies while interest is high and asks when they’d like to talk.',
        row: 'Automated follow-up',
      },
      {
        title: 'Trials that go quiet',
        body: 'Someone signs up, looks around once and gets busy. Without a person checking in, the trial simply runs out.',
        fix: 'CloseAgain follows up with each new sign-up, and brings any replies to your team in one inbox.',
        row: 'Follow-up sequences',
      },
      {
        title: 'Opportunities that stalled',
        body: 'The deal that went quiet after a good demo, the team that said “next quarter” — they’re still sitting in your CRM.',
        fix: 'CloseAgain re-engages old opportunities and reopens the ones that reply.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'Demo request, Friday evening',
        message:
          'Hi Leo — thanks for requesting a demo. Would Monday or Tuesday work for a short call? Let us know what you’d most like to see.',
        reply: 'Tuesday morning works.',
      },
      {
        moment: 'Trial, quiet since sign-up',
        message:
          'Hi Grace — how is your trial going so far? If anything is holding you up, reply here and someone from our team will help.',
        reply: 'I can’t get our calendar connected.',
      },
      {
        moment: 'Stalled opportunity, next quarter',
        message: 'Hi Ben — last quarter you mentioned revisiting this after planning season. Is now a better time to pick it back up?',
      },
    ],
    preview: {
      kind: 'builder',
      title: 'Build the follow‑up once.',
      body: 'Set the rules for new sign-ups, demo requests and quiet trials once, then let them run while your team works the replies.',
      row: 'Custom automation rules',
    },
    related: ['agencies', 'ecommerce', 'other'],
    closingTitle: 'Turn more trials and demos into customers.',
  },

  ecommerce: {
    slug: 'e-commerce',
    audience: 'e-commerce',
    description:
      'CloseAgain answers wholesale, bulk and custom-order inquiries and follows up on quotes automatically — so more of your e-commerce inquiries become orders.',
    lede: 'Not every sale goes through the cart. CloseAgain follows up on wholesale, bulk and custom-order inquiries, and checks back on quotes that went quiet — so more of them become orders.',
    leaksTitle: 'Where the bigger orders slip away.',
    leaks: [
      {
        title: 'Wholesale inquiries in a shared inbox',
        body: 'A shop asks about stocking your products. The email sits in the general inbox for days while orders get packed.',
        fix: 'CloseAgain answers the inquiry and asks the questions you need for a quote.',
        row: 'Automated follow-up',
      },
      {
        title: 'Custom quotes nobody chases',
        body: 'You price up a bulk or custom order and send it over. If they don’t reply, it usually just disappears.',
        fix: 'CloseAgain follows up on every quote on your schedule, and stops when they answer.',
        row: 'Follow-up sequences',
      },
      {
        title: 'Past buyers and stockists who went quiet',
        body: 'The store that ordered twice last year and the company that bought gifts last holiday already know your products. They just haven’t heard from you.',
        fix: 'CloseAgain checks back with past inquiries and buyers, and reopens the ones who reply.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'Wholesale inquiry',
        message:
          'Hi Tara — thanks for your interest in stocking our candles. To put a quote together, could you tell us roughly how many you’d need, and by when?',
        reply: 'A few cases a month, starting in spring.',
      },
      {
        moment: 'Custom-order quote, no reply yet',
        message:
          'Hi Felix — just checking that you received the quote for the custom mugs. Happy to adjust quantities or timing if that helps.',
      },
      {
        moment: 'Last year’s holiday buyer',
        message:
          'Hi Irene — last year you ordered gift boxes for your team. Planning something again this season? We’d be glad to put options together.',
        reply: 'Yes! Can you send last year’s options?',
      },
    ],
    preview: {
      kind: 'inbox',
      title: 'Every reply, sorted by what happens next.',
      body: 'Replies are grouped by stage and next action, so whoever handles orders knows exactly where to step in.',
      row: 'Unified conversation inbox',
    },
    related: ['saas', 'agencies', 'home-services'],
    closingTitle: 'Turn more inquiries into orders.',
  },

  other: {
    slug: 'lead-driven-businesses',
    audience: 'lead-driven businesses',
    description:
      'If your business runs on inquiries, quotes and callbacks, CloseAgain follows up with every lead automatically — so more of them become paying customers.',
    lede: 'Event venues, tutoring centers, fitness studios, contractors, consultants: if leads come in and go quiet, CloseAgain follows up with every one and brings old leads back — so more of them become paying customers.',
    leaksTitle: 'Where leads slip away.',
    leaks: [
      {
        title: 'Inquiries that arrive at a bad time',
        body: 'Leads don’t wait for a quiet moment. The ones that come in while you’re busy are the ones that go cold.',
        fix: 'CloseAgain replies to every new lead and follows up on schedule until they answer or the sequence ends.',
        row: 'Automated follow-up',
      },
      {
        title: 'Follow‑up that depends on someone remembering',
        body: 'A sticky note, a calendar reminder, a spreadsheet — follow-up that relies on memory is the first thing to slip in a busy week.',
        fix: 'CloseAgain runs the follow-up you approve, on schedule, and stops when the lead replies.',
        row: 'Follow-up sequences',
      },
      {
        title: 'Old leads nobody has time for',
        body: 'Every business has a list of people who asked, got a quote and went quiet. Some of them still want what you sell.',
        fix: 'CloseAgain reaches back out to old leads and reopens the conversations that reply.',
        row: 'Old lead re-engagement',
      },
    ],
    examples: [
      {
        moment: 'New inquiry from your website',
        message: 'Hi Ruth — thanks for getting in touch. Happy to help. Would a quick call tomorrow or Thursday be easiest?',
        reply: 'Thursday works for me.',
      },
      {
        moment: 'Quote sent, no reply yet',
        message: 'Hi Alex — just checking in on the quote we sent. Any questions, or anything we should change?',
      },
      {
        moment: 'Lead from earlier in the year',
        message: 'Hi Sofia — you asked about this a few months ago. Is it still something you’re thinking about? We’d be glad to help.',
        reply: 'It is — can you call me Monday?',
      },
    ],
    preview: {
      kind: 'thread',
      title: 'One conversation, wherever they reply.',
      body: 'Email and text replies stay together in a single thread, so nobody has to piece the story back together.',
      row: 'Email + SMS workflows',
    },
    related: ['home-services', 'agencies', 'saas'],
    closingTitle: 'Follow up with every lead.',
  },
}

/** Every industry page, in the order of the “Who it’s for” overview. */
export const industries: readonly Industry[] = whoItsFor.industries.map((base) => {
  const page = copy[base.id]
  return {
    ...page,
    id: base.id,
    name: base.name,
    outcome: base.outcome,
    industryValue: base.formValue,
    title: `${industryPage.titleLead} for ${page.audience}`,
    path: `/who-its-for/${page.slug}`,
    contactHref: `/contact?industry=${encodeURIComponent(base.formValue)}`,
  }
})

export const industryBySlug = (slug: string) => industries.find((industry) => industry.slug === slug)

export const industryById = (id: IndustryId) => {
  const industry = industries.find((candidate) => candidate.id === id)
  if (!industry) throw new Error(`No industry with id “${id}”`)
  return industry
}

/** “Included on every plan”, “Included on Growth and up”: read from the pricing data. */
export const includedOn = (row: string) => {
  const { summary } = availability(row)
  return summary === 'Every plan' ? 'every plan' : summary
}
