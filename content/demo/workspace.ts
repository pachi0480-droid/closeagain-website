/**
 * The client dashboard's sample workspace: Juniper Row Realty, a fictional
 * brokerage. The most recent conversations are written by hand; the rest of
 * its 90-day history is generated (see generate.ts). All of it is invented.
 */

import { automationIdFor, clientAutomations, type TemplateId } from './automations.ts'
import { FEATURED_CLIENT_ID, clientById } from './clients.ts'
import { generateClient } from './generate.ts'
import { DEMO_NOW, HOUR, atLocal } from './time.ts'
import type {
  Appointment,
  AppointmentStatus,
  Channel,
  Client,
  IntegrationId,
  Lead,
  Outcome,
  Sender,
  SourceId,
  StageId,
  Task,
} from './types.ts'

const featured = clientById(FEATURED_CLIENT_ID)
if (!featured) throw new Error('Featured sample client is missing')
export const workspaceClient: Client = featured

const sep = (date: number, hour: number, minute = 0) => atLocal(2026, 8, date, hour, minute)
const aug = (date: number, hour: number, minute = 0) => atLocal(2026, 7, date, hour, minute)
const oct = (date: number, hour: number, minute = 0) => atLocal(2026, 9, date, hour, minute)

type Line = [Sender, Channel, number, string] | [Sender, Channel, number, string, string]

type AuthoredAppointment = {
  key: string
  type: string
  start: number
  durationMin: number
  location: string
  host: string
  status: AppointmentStatus
  bookedAt: number
}

type Authored = {
  key: string
  name: string
  source: SourceId
  interest: string
  tags: string[]
  score: number
  stage: StageId
  outcome?: Outcome
  owner: string
  value: number
  channel: 'text' | 'email'
  createdAt: number
  enrolledAt?: number
  /** Timestamp of the reply that brought a quiet lead back. */
  recoveredAt?: number
  template: TemplateId
  nextAction: string
  nextAt?: number
  unread: boolean
  lines: Line[]
  appointments?: AuthoredAppointment[]
  /** Which appointment is current, when there were several. */
  current?: string
}

const authored: Authored[] = [
  {
    key: 'a01',
    name: 'Maya Thompson',
    source: 'web-form',
    interest: 'the 3-bed on Rutledge Ave',
    tags: ['Buyer', 'Pre-approved'],
    score: 91,
    stage: 'appointment',
    owner: 'Marcus Bell',
    value: 14500,
    channel: 'text',
    createdAt: sep(22, 8, 4),
    template: 'tpl-new-lead',
    nextAction: 'Reply to Maya',
    unread: true,
    lines: [
      ['lead', 'web', sep(22, 8, 4), 'Hi, is the 3-bed on Rutledge Ave still available? We’d love to see it this week.'],
      ['closeagain', 'text', sep(22, 8, 5), 'Hi Maya, it’s Marcus with Juniper Row. Thanks for asking about the Rutledge Ave home — it’s still available. Are you hoping to tour this week?'],
      ['lead', 'text', sep(22, 9, 12), 'Yes! Saturday morning would be ideal. We’re pre-approved up to 575.'],
      ['closeagain', 'text', sep(22, 9, 13), 'Great — Saturday has openings at 10:00 and 11:30. Which works better?'],
      ['lead', 'text', sep(22, 9, 40), '10 works.'],
      ['closeagain', 'text', sep(22, 9, 41), 'You’re confirmed for Sat, Sep 26 at 10:00 AM with Marcus at 88 Rutledge Ave. Reply C to confirm or R to reschedule.'],
      ['lead', 'text', sep(22, 9, 44), 'C'],
      ['team', 'text', sep(22, 11, 20), 'Hi Maya, Marcus here — looking forward to Saturday. I’ll line up two similar homes nearby in case you want to see them the same morning.', 'Marcus Bell'],
      ['lead', 'text', sep(24, 10, 25), 'That would be great, thank you! Is it OK if my mom comes along?'],
    ],
    appointments: [
      { key: 'a', type: 'Showing', start: sep(26, 10), durationMin: 45, location: '88 Rutledge Ave', host: 'Marcus Bell', status: 'confirmed', bookedAt: sep(22, 9, 41) },
    ],
  },
  {
    key: 'a02',
    name: 'Luis Ortega',
    source: 'phone',
    interest: 'the listing on Folly Rd',
    tags: ['Buyer'],
    score: 74,
    stage: 'active',
    owner: 'Marcus Bell',
    value: 11800,
    channel: 'text',
    createdAt: sep(24, 10, 8),
    template: 'tpl-missed-inquiry',
    nextAction: 'Answer HOA question',
    unread: true,
    lines: [
      ['closeagain', 'text', sep(24, 10, 9), 'Hi, this is Juniper Row Realty — sorry we missed your call. How can we help? Reply here and Marcus will pick it up.'],
      ['lead', 'text', sep(24, 10, 16), 'Hi, I was calling about the house on Folly Rd. Is it still available?'],
      ['closeagain', 'text', sep(24, 10, 17), 'It is! Would you like to see it? We have times Friday afternoon and Saturday.'],
      ['lead', 'text', sep(24, 10, 48), 'Friday after 3 could work. Is there an HOA?'],
    ],
  },
  {
    key: 'a03',
    name: 'Hannah Brooks',
    source: 'import',
    interest: 'listing her home in West Ashley',
    tags: ['Recovered', 'Seller'],
    score: 88,
    stage: 'appointment',
    owner: 'Priya Raman',
    value: 16800,
    channel: 'text',
    createdAt: atLocal(2025, 4, 17, 13, 20),
    enrolledAt: sep(21, 10, 4),
    recoveredAt: sep(21, 18, 42),
    template: 'tpl-reactivation',
    nextAction: 'Listing appointment',
    nextAt: sep(28, 16),
    unread: false,
    lines: [
      ['lead', 'web', atLocal(2025, 4, 17, 13, 20), 'Signed in at the Wappoo Rd open house. We might sell next year — curious what our place is worth.'],
      ['team', 'email', atLocal(2025, 4, 18, 9, 10), 'Thanks for stopping by, Hannah! Happy to put together a value estimate whenever you’re ready.', 'Priya Raman'],
      ['closeagain', 'text', sep(21, 10, 4), 'Hi Hannah, it’s Priya at Juniper Row. We met at an open house last year when you were thinking about selling. Still interested?'],
      ['lead', 'text', sep(21, 18, 42), 'Yes — we’re finally ready to list. Can we talk this week?'],
      ['closeagain', 'text', sep(21, 18, 43), 'Wonderful. Priya has Monday at 4:00 PM or Tuesday at 11:00 AM for a listing consultation. Which works?'],
      ['lead', 'text', sep(21, 19, 15), 'Monday at 4.'],
      ['closeagain', 'text', sep(21, 19, 16), 'You’re confirmed for Mon, Sep 28 at 4:00 PM with Priya. Reply C to confirm or R to reschedule.'],
      ['team', 'text', sep(22, 9, 30), 'Hi Hannah — Priya here. I’ll bring recent sales from your street. See you Monday!', 'Priya Raman'],
      ['lead', 'text', sep(22, 9, 41), 'Perfect, see you then.'],
    ],
    appointments: [
      { key: 'a', type: 'Listing appointment', start: sep(28, 16), durationMin: 60, location: 'Client home', host: 'Priya Raman', status: 'confirmed', bookedAt: sep(21, 19, 16) },
    ],
  },
  {
    key: 'a04',
    name: 'Derek Nguyen',
    source: 'landing-page',
    interest: 'a home value estimate',
    tags: ['Seller'],
    score: 62,
    stage: 'new',
    owner: 'Priya Raman',
    value: 12900,
    channel: 'text',
    createdAt: sep(24, 10, 54),
    template: 'tpl-proposal',
    nextAction: 'Follow-up text',
    nextAt: sep(25, 10),
    unread: false,
    lines: [
      ['lead', 'web', sep(24, 10, 54), 'Home value request: 3 bed / 2 bath in West Ashley. Thinking about selling next spring.'],
      ['closeagain', 'text', sep(24, 10, 55), 'Hi Derek, it’s Priya with Juniper Row. Thanks for requesting a home value estimate. Is the West Ashley home where you live now?'],
    ],
  },
  {
    key: 'a05',
    name: 'Tasha Coleman',
    source: 'email',
    interest: 'the 2-bed condo on King St',
    tags: ['Buyer', 'First-time buyer'],
    score: 69,
    stage: 'active',
    owner: 'Marcus Bell',
    value: 9200,
    channel: 'email',
    createdAt: sep(23, 6, 52),
    template: 'tpl-new-lead',
    nextAction: 'Reply to Tasha',
    unread: true,
    lines: [
      ['lead', 'email', sep(23, 6, 52), 'Hello — can someone send details on the 2-bed condo on King St? Mainly wondering about HOA fees and parking.'],
      ['closeagain', 'email', sep(23, 6, 54), 'Hi Tasha, thanks for reaching out about the King St condo. The HOA is $385 a month and includes one assigned parking space. Would you like to see it?'],
      ['lead', 'email', sep(24, 8, 20), 'Thanks! Is the HOA going up next year? And are pets allowed?'],
    ],
  },
  {
    key: 'a06',
    name: 'Ben Carver',
    source: 'web-form',
    interest: 'the townhouse on Coleman Blvd',
    tags: ['Buyer'],
    score: 80,
    stage: 'appointment',
    owner: 'Marcus Bell',
    value: 10400,
    channel: 'text',
    createdAt: sep(15, 19, 40),
    template: 'tpl-new-lead',
    nextAction: 'Showing',
    nextAt: sep(27, 13),
    unread: false,
    lines: [
      ['lead', 'web', sep(15, 19, 40), 'Is the townhouse on Coleman Blvd still available? I’d like to see it after work one day.'],
      ['closeagain', 'text', sep(15, 19, 41), 'Hi Ben, it’s Marcus with Juniper Row. Thanks for asking about the Coleman Blvd townhouse! Evenings work — would Tuesday at 5:30 PM suit you?'],
      ['lead', 'text', sep(15, 20, 2), 'Tuesday works.'],
      ['closeagain', 'text', sep(15, 20, 3), 'You’re confirmed for Tue, Sep 22 at 5:30 PM with Marcus. Reply C to confirm or R to reschedule.'],
      ['closeagain', 'text', sep(21, 17, 30), 'Reminder: you’re seeing Marcus tomorrow at 5:30 PM at 1240 Coleman Blvd. Reply C to confirm or R to reschedule.'],
      ['closeagain', 'text', sep(22, 20, 15), 'Sorry we missed you today, Ben. Want to pick a new time? Reply with a day that works.'],
      ['lead', 'text', sep(23, 8, 15), 'So sorry — got stuck at work. Could we try Sunday?'],
      ['closeagain', 'text', sep(23, 8, 16), 'No problem! Sunday at 1:00 PM or 3:00 PM?'],
      ['lead', 'text', sep(23, 8, 20), '1 PM please.'],
      ['closeagain', 'text', sep(23, 8, 21), 'You’re confirmed for Sun, Sep 27 at 1:00 PM with Marcus. Reply C to confirm or R to reschedule.'],
    ],
    appointments: [
      { key: 'a1', type: 'Showing', start: sep(22, 17, 30), durationMin: 45, location: '1240 Coleman Blvd', host: 'Marcus Bell', status: 'no-show', bookedAt: sep(15, 20, 3) },
      { key: 'a2', type: 'Showing', start: sep(27, 13), durationMin: 45, location: '1240 Coleman Blvd', host: 'Marcus Bell', status: 'scheduled', bookedAt: sep(23, 8, 21) },
    ],
    current: 'a2',
  },
  {
    key: 'a07',
    name: 'Olivia Grant',
    source: 'web-form',
    interest: 'homes near Hampton Park',
    tags: ['Buyer', 'Relocating'],
    score: 98,
    stage: 'closed',
    outcome: 'won',
    owner: 'Marcus Bell',
    value: 19500,
    channel: 'text',
    createdAt: aug(31, 18, 15),
    template: 'tpl-new-lead',
    nextAction: 'Ask for a review',
    unread: false,
    lines: [
      ['lead', 'web', aug(31, 18, 15), 'Hi! We’re relocating from Charlotte in October and looking at homes near Hampton Park.'],
      ['closeagain', 'text', aug(31, 18, 16), 'Hi Olivia, it’s Marcus with Juniper Row — welcome (almost) to Charleston! What’s your price range, and how many bedrooms do you need?'],
      ['lead', 'text', aug(31, 18, 40), 'Up to 650, three bedrooms, and a yard for our dog.'],
      ['team', 'text', sep(1, 9, 5), 'Perfect. I found four that fit. Could you do a video walkthrough this Thursday evening?', 'Marcus Bell'],
      ['lead', 'text', sep(1, 9, 30), 'Yes, Thursday evening!'],
      ['closeagain', 'text', sep(1, 9, 31), 'You’re confirmed for Thu, Sep 3 at 6:00 PM with Marcus. Reply C to confirm or R to reschedule.'],
      ['lead', 'text', sep(1, 9, 33), 'C'],
      ['team', 'text', sep(12, 16, 20), 'Offer accepted on Sumter St! Congratulations. I’ll send the inspection schedule shortly.', 'Marcus Bell'],
      ['lead', 'text', sep(23, 14, 10), 'We’re under contract! Thank you for everything.'],
    ],
    appointments: [
      { key: 'a', type: 'Video walkthrough', start: sep(3, 18), durationMin: 60, location: 'Video call', host: 'Marcus Bell', status: 'completed', bookedAt: sep(1, 9, 31) },
    ],
  },
  {
    key: 'a08',
    name: 'Ryan McAllister',
    source: 'web-form',
    interest: 'new construction in Summerville',
    tags: ['Buyer', 'After hours'],
    score: 31,
    stage: 'reengage',
    owner: 'Marcus Bell',
    value: 9800,
    channel: 'text',
    createdAt: sep(12, 21, 12),
    template: 'tpl-new-lead',
    nextAction: 'Re-engage next month',
    nextAt: oct(20, 10),
    unread: false,
    lines: [
      ['lead', 'web', sep(12, 21, 12), 'Looking at new construction in Summerville. Are you taking new buyers?'],
      ['closeagain', 'text', sep(12, 21, 13), 'Hi Ryan, it’s Marcus with Juniper Row. Thanks for asking about new construction in Summerville. Are you hoping to buy this year?'],
      ['closeagain', 'text', sep(13, 10), 'Hi Ryan, just checking in on new construction in Summerville. Still interested?'],
      ['closeagain', 'email', sep(16, 10), 'A few new-construction communities in Summerville are releasing lots this fall. Want the list?'],
      ['closeagain', 'text', sep(20, 10), 'No rush, Ryan. If the timing isn’t right, reply LATER and we’ll check back next month.'],
    ],
  },
  {
    key: 'a09',
    name: 'Grace Kim',
    source: 'email',
    interest: 'a 4-bed on Daniel Island',
    tags: ['Buyer', 'Relocating'],
    score: 86,
    stage: 'qualified',
    owner: 'Dana Whitfield',
    value: 26400,
    channel: 'email',
    createdAt: sep(23, 15, 22),
    template: 'tpl-new-lead',
    nextAction: 'Send Daniel Island listings',
    nextAt: sep(24, 15),
    unread: false,
    lines: [
      ['lead', 'email', sep(23, 15, 22), 'Hi — my husband and I are moving from Denver in January. Looking for a 4-bed on Daniel Island, ideally near the schools.'],
      ['closeagain', 'email', sep(23, 15, 24), 'Hi Grace, thanks for reaching out — Daniel Island is a great fit for schools. What price range are you considering, and will you sell in Denver first?'],
      ['lead', 'email', sep(23, 20, 5), 'Around $1.1M. We’ll sell our place in Denver in November.'],
      ['team', 'email', sep(24, 8, 50), 'Hi Grace, Dana here — I’ll put together the Daniel Island homes that fit, plus a short guide to the school zones. Would a video call Friday help?', 'Dana Whitfield'],
    ],
  },
  {
    key: 'a10',
    name: 'Andre Wallace',
    source: 'landing-page',
    interest: 'the cottage on Tradd St',
    tags: ['Buyer', 'Cash buyer'],
    score: 84,
    stage: 'appointment',
    owner: 'Priya Raman',
    value: 21000,
    channel: 'text',
    createdAt: sep(19, 11, 30),
    template: 'tpl-new-lead',
    nextAction: 'Showing',
    nextAt: sep(25, 9, 30),
    unread: false,
    lines: [
      ['lead', 'web', sep(19, 11, 30), 'Could I see the cottage on Tradd St sometime next week?'],
      ['closeagain', 'text', sep(19, 11, 31), 'Hi Andre, it’s Priya with Juniper Row. Happy to show you the Tradd St cottage! Do mornings work? Friday at 9:30 AM is open.'],
      ['lead', 'text', sep(19, 12, 2), 'Friday 9:30 is perfect.'],
      ['closeagain', 'text', sep(19, 12, 3), 'You’re confirmed for Fri, Sep 25 at 9:30 AM with Priya. Reply C to confirm or R to reschedule.'],
      ['closeagain', 'text', sep(24, 9, 30), 'Reminder: you’re seeing Priya tomorrow at 9:30 AM at 17 Tradd St. Reply C to confirm or R to reschedule.'],
      ['lead', 'text', sep(24, 9, 47), 'C — see you tomorrow!'],
    ],
    appointments: [
      { key: 'a', type: 'Showing', start: sep(25, 9, 30), durationMin: 45, location: '17 Tradd St', host: 'Priya Raman', status: 'confirmed', bookedAt: sep(19, 12, 3) },
    ],
  },
  {
    key: 'a11',
    name: 'Kelsey Park',
    source: 'crm',
    interest: 'buying a first home',
    tags: ['Recovered', 'First-time buyer'],
    score: 77,
    stage: 'qualified',
    owner: 'Dana Whitfield',
    value: 8400,
    channel: 'text',
    createdAt: atLocal(2025, 2, 8, 14, 14),
    enrolledAt: sep(23, 10, 5),
    recoveredAt: sep(23, 12, 48),
    template: 'tpl-reactivation',
    nextAction: 'Send lender intro',
    nextAt: sep(25, 10),
    unread: false,
    lines: [
      ['lead', 'web', atLocal(2025, 2, 8, 14, 14), 'We’re thinking about buying our first home next year. Can someone tell us about first-time buyer programs?'],
      ['team', 'email', atLocal(2025, 2, 9, 10, 2), 'Hi Kelsey — congrats on starting the search! Here’s a short guide to first-time buyer programs. Reach out whenever you’re ready.', 'Dana Whitfield'],
      ['closeagain', 'text', sep(23, 10, 5), 'Hi Kelsey, it’s Dana at Juniper Row. We talked last year about buying your first home. Still interested?'],
      ['lead', 'text', sep(23, 12, 48), 'Yes. Let’s talk.'],
      ['closeagain', 'text', sep(23, 12, 49), 'Wonderful! Is a quick call this week easiest, or would you rather meet at the office?'],
      ['lead', 'text', sep(23, 13, 30), 'A call is great. Anytime after 5.'],
      ['team', 'call', sep(23, 17, 40), 'Call note: talked for 20 minutes. Budget around $420k. Wants a lender intro and to start touring in October.', 'Dana Whitfield'],
    ],
  },
  {
    key: 'a12',
    name: 'Samuel Ortiz',
    source: 'web-form',
    interest: 'a duplex or small multifamily',
    tags: ['Recovered', 'Investor', 'After hours'],
    score: 72,
    stage: 'active',
    owner: 'Marcus Bell',
    value: 15600,
    channel: 'text',
    createdAt: sep(20, 23, 48),
    recoveredAt: sep(24, 10, 37),
    template: 'tpl-new-lead',
    nextAction: 'Send the duplex listing',
    unread: true,
    lines: [
      ['lead', 'web', sep(20, 23, 48), 'Do you work with investors? Looking for a duplex or small multifamily.'],
      ['closeagain', 'text', sep(20, 23, 49), 'Hi Samuel, it’s Marcus with Juniper Row. We do! Are you hoping to buy this year, and do you have a budget in mind?'],
      ['closeagain', 'text', sep(21, 10), 'Hi Samuel, a duplex near the Upper Peninsula just came up. Want me to send it over?'],
      ['closeagain', 'email', sep(24, 10), 'A few multifamily listings that fit what you described — happy to set up tours.'],
      ['lead', 'text', sep(24, 10, 37), 'Yes, budget is around 700k. Sorry for the slow reply — send the duplex!'],
    ],
  },
  {
    key: 'a13',
    name: 'Nora Fitzgerald',
    source: 'landing-page',
    interest: 'a home value estimate',
    tags: ['Seller'],
    score: 95,
    stage: 'appointment',
    owner: 'Priya Raman',
    value: 29500,
    channel: 'text',
    createdAt: sep(16, 8, 20),
    template: 'tpl-proposal',
    nextAction: 'Send listing agreement',
    unread: true,
    lines: [
      ['lead', 'web', sep(16, 8, 20), 'Home value request: 4 bed / 3 bath in Mount Pleasant. Planning to list in October.'],
      ['closeagain', 'text', sep(16, 8, 21), 'Hi Nora, it’s Priya with Juniper Row. Thanks for requesting a value estimate! Would you like me to walk through the house and give you a precise number?'],
      ['lead', 'text', sep(16, 9, 2), 'Yes please. Tuesday afternoon?'],
      ['closeagain', 'text', sep(16, 9, 3), 'You’re confirmed for Tue, Sep 22 at 2:00 PM with Priya. Reply C to confirm or R to reschedule.'],
      ['lead', 'text', sep(16, 9, 5), 'C'],
      ['team', 'text', sep(22, 17, 10), 'Thanks for having me today, Nora! I’ll send the pricing analysis and listing agreement tomorrow.', 'Priya Raman'],
      ['team', 'email', sep(23, 11, 30), 'Here’s the pricing analysis we discussed. Suggested list range: $1.18M–$1.24M.', 'Priya Raman'],
      ['lead', 'email', sep(24, 7, 55), 'Thanks Priya — we’d like to go with the higher end. Can we sign this week?'],
    ],
    appointments: [
      { key: 'a', type: 'Listing appointment', start: sep(22, 14), durationMin: 60, location: 'Client home', host: 'Priya Raman', status: 'completed', bookedAt: sep(16, 9, 3) },
    ],
  },
  {
    key: 'a14',
    name: 'Jamal Price',
    source: 'email',
    interest: 'the rental property on Meeting St',
    tags: ['Investor'],
    score: 79,
    stage: 'qualified',
    owner: 'Marcus Bell',
    value: 13200,
    channel: 'email',
    createdAt: sep(22, 6, 30),
    template: 'tpl-new-lead',
    nextAction: 'Waiting on reply',
    unread: false,
    lines: [
      ['lead', 'email', sep(22, 6, 30), 'Looking at the rental property on Meeting St. Do you have a rent roll or cap rate info?'],
      ['closeagain', 'email', sep(22, 6, 32), 'Hi Jamal, thanks for asking about the Meeting St property. Marcus will send the rent roll. Are you buying with cash or financing?'],
      ['lead', 'email', sep(22, 13, 15), 'Financing, 25% down.'],
      ['team', 'email', sep(23, 10, 20), 'Hi Jamal — rent roll attached. The cap rate is about 6.1% at list. Want to see it this weekend?', 'Marcus Bell'],
    ],
  },
  {
    key: 'a15',
    name: 'Emily Sanders',
    source: 'web-form',
    interest: 'a 2-bed near the Battery',
    tags: ['Buyer'],
    score: 22,
    stage: 'closed',
    outcome: 'lost',
    owner: 'Dana Whitfield',
    value: 7600,
    channel: 'text',
    createdAt: aug(29, 16, 12),
    template: 'tpl-new-lead',
    nextAction: 'Check back next summer',
    nextAt: atLocal(2027, 5, 1, 10),
    unread: false,
    lines: [
      ['lead', 'web', aug(29, 16, 12), 'Looking for a 2-bed near the Battery — open to renting or buying.'],
      ['closeagain', 'text', aug(29, 16, 13), 'Hi Emily, it’s Dana with Juniper Row. Happy to help! Are you leaning toward buying, or would a rental be better for now?'],
      ['lead', 'text', aug(29, 18, 2), 'Probably buying if the numbers work.'],
      ['team', 'text', aug(31, 10, 15), 'Sending a few 2-beds near the Battery with estimated monthly costs so you can compare with renting.', 'Dana Whitfield'],
      ['lead', 'text', sep(18, 18, 20), 'We decided to rent for another year. Thanks though!'],
      ['team', 'text', sep(19, 9), 'Totally understand, Emily. We’ll check in next summer — good luck with the move!', 'Dana Whitfield'],
    ],
  },
  {
    key: 'a16',
    name: 'Chris Delgado',
    source: 'web-form',
    interest: 'homes under $450k in North Charleston',
    tags: ['Buyer', 'First-time buyer', 'After hours'],
    score: 73,
    stage: 'qualified',
    owner: 'Marcus Bell',
    value: 7900,
    channel: 'text',
    createdAt: sep(23, 21, 40),
    template: 'tpl-new-lead',
    nextAction: 'Call after 5 PM',
    nextAt: sep(24, 17),
    unread: false,
    lines: [
      ['lead', 'web', sep(23, 21, 40), 'Interested in homes under $450k in North Charleston. First-time buyer.'],
      ['closeagain', 'text', sep(23, 21, 41), 'Hi Chris, it’s Marcus with Juniper Row. Congrats on starting your search! Have you talked with a lender yet?'],
      ['lead', 'text', sep(24, 7, 12), 'Not yet. Could someone call me after 5 today?'],
      ['closeagain', 'text', sep(24, 7, 13), 'Of course. Marcus will call you after 5 PM today. Anything you’d like him to prepare?'],
      ['lead', 'text', sep(24, 7, 20), 'Maybe a lender intro. Thanks!'],
    ],
  },
]

const handle = (name: string) => name.toLowerCase().replace(/[^a-z ]/g, '').replace(' ', '.')

function buildAuthored(spec: Authored, index: number): { lead: Lead; appointments: Appointment[] } {
  const id = `jr-${spec.key}`
  const automationId = automationIdFor(FEATURED_CLIENT_ID, spec.template)
  const viaFor = (body: string) =>
    body.startsWith('Reminder:')
      ? automationIdFor(FEATURED_CLIENT_ID, 'tpl-reminder')
      : body.startsWith('Sorry we missed you')
        ? automationIdFor(FEATURED_CLIENT_ID, 'tpl-no-show')
        : automationId
  const thread = spec.lines.map(([from, channel, at, body, author], position) => ({
    id: `${id}.${position + 1}`,
    from,
    channel,
    at,
    body,
    ...(author ? { author } : {}),
    ...(from === 'closeagain' ? { via: viaFor(body) } : {}),
  }))
  const firstOutbound = thread.findIndex((message) => message.from !== 'lead')
  const reply = thread.find((message, position) => message.from === 'lead' && position > firstOutbound && message.at >= (spec.enrolledAt ?? spec.createdAt))
  const appointments: Appointment[] = (spec.appointments ?? []).map((appointment) => ({
    id: `${id}.${appointment.key}`,
    clientId: FEATURED_CLIENT_ID,
    leadId: id,
    leadName: spec.name,
    type: appointment.type,
    start: appointment.start,
    durationMin: appointment.durationMin,
    location: appointment.location,
    host: appointment.host,
    status: appointment.status,
    bookedAt: appointment.bookedAt,
  }))
  const currentKey = spec.current ?? spec.appointments?.[spec.appointments.length - 1]?.key
  const first = spec.name.split(' ')[0]
  const lead: Lead = {
    id,
    clientId: FEATURED_CLIENT_ID,
    name: spec.name,
    first,
    email: `${handle(spec.name)}@example.com`,
    phone: `(843) 555-01${String(40 + index).padStart(2, '0')}`,
    source: spec.source,
    interest: spec.interest,
    tags: spec.tags,
    score: spec.score,
    stage: spec.stage,
    ...(spec.outcome ? { outcome: spec.outcome } : {}),
    createdAt: spec.createdAt,
    enrolledAt: spec.enrolledAt ?? spec.createdAt,
    ...(spec.recoveredAt ? { recoveredAt: spec.recoveredAt } : {}),
    ...(reply ? { repliedAt: reply.at } : {}),
    lastContactAt: thread[thread.length - 1].at,
    owner: spec.owner,
    automationId,
    sent: thread.filter((message) => message.from === 'closeagain').length,
    value: spec.value,
    nextAction: spec.nextAction,
    ...(spec.nextAt ? { nextAt: spec.nextAt } : {}),
    channel: spec.channel,
    ...(currentKey ? { appointmentId: `${id}.${currentKey}` } : {}),
    unread: spec.unread,
    thread,
  }
  return { lead, appointments }
}

const built = authored.map(buildAuthored)
const generated = generateClient(workspaceClient, {
  prefix: 'jr',
  reserved: authored.map((spec) => spec.name),
  quietBefore: 2.5 * HOUR,
})

export const workspaceLeads: Lead[] = [...built.map((entry) => entry.lead), ...generated.leads].sort(
  (a, b) => b.lastContactAt - a.lastContactAt,
)
export const workspaceAppointments: Appointment[] = [
  ...built.flatMap((entry) => entry.appointments),
  ...generated.appointments,
].sort((a, b) => a.start - b.start)

export const workspaceAutomations = clientAutomations[FEATURED_CLIENT_ID]

/** Follow-up tasks for the team, tied to real threads above. */
export const workspaceTasks: Task[] = [
  { id: 'task-1', leadId: 'jr-a02', title: 'Answer Luis Ortega’s HOA question', detail: 'Folly Rd listing · asked by text this morning', due: sep(24, 11, 30), priority: 'high' },
  { id: 'task-2', leadId: 'jr-a13', title: 'Send the listing agreement to Nora Fitzgerald', detail: 'Wants to list at the higher end and sign this week', due: sep(24, 14), priority: 'high' },
  { id: 'task-3', leadId: 'jr-a16', title: 'Call Chris Delgado after 5 PM', detail: 'First-time buyer · wants a lender intro', due: sep(24, 17), priority: 'high' },
  { id: 'task-4', leadId: 'jr-a05', title: 'Reply to Tasha Coleman about pets and the HOA', detail: 'King St condo · emailed at 8:20 AM', due: sep(24, 12), priority: 'normal' },
  { id: 'task-5', leadId: 'jr-a09', title: 'Send Daniel Island listings to Grace Kim', detail: 'Relocating from Denver · around $1.1M', due: sep(24, 15), priority: 'normal' },
  { id: 'task-6', leadId: 'jr-a01', title: 'Confirm Maya Thompson’s mom can join Saturday', detail: 'Showing Sat 10:00 AM · 88 Rutledge Ave', due: sep(24, 16), priority: 'normal' },
  { id: 'task-7', leadId: 'jr-a11', title: 'Send a lender intro to Kelsey Park', detail: 'Recovered lead · budget around $420k', due: sep(25, 10), priority: 'normal' },
  { id: 'task-8', leadId: 'jr-a07', title: 'Send a closing gift to Olivia Grant', detail: 'Under contract on Sumter St', due: sep(24, 9), priority: 'normal' },
]

/** Tasks already checked off when the sample workspace opens. */
export const initiallyDoneTasks = ['task-8']

export type TeamMember = {
  name: string
  title: string
  email: string
  role: 'Owner' | 'Admin' | 'Agent' | 'Viewer'
  lastActive: number
}

export const workspaceTeam: TeamMember[] = [
  { name: 'Dana Whitfield', title: 'Owner · Broker', email: workspaceClient.team[0].email, role: 'Owner', lastActive: DEMO_NOW - 4 * 60_000 },
  { name: 'Marcus Bell', title: 'Buyer’s agent', email: workspaceClient.team[1].email, role: 'Agent', lastActive: DEMO_NOW - 22 * 60_000 },
  { name: 'Priya Raman', title: 'Listing agent', email: workspaceClient.team[2].email, role: 'Agent', lastActive: DEMO_NOW - 2 * HOUR },
  { name: 'Elena Soto', title: 'Transaction coordinator', email: workspaceClient.team[3].email, role: 'Admin', lastActive: DEMO_NOW - 26 * HOUR },
]

export const workspaceAccount = {
  businessName: 'Juniper Row Realty',
  senderName: 'Juniper Row Realty',
  replyTo: 'hello@juniperrow.example',
  timezone: 'Eastern Time (ET)',
  hours: 'Mon–Sat, 8:00 AM – 7:00 PM',
  quietHours: '9 PM to 8 AM',
}

export type NotificationSetting = { id: string; label: string; detail: string; on: boolean }

export const workspaceNotifications: NotificationSetting[] = [
  { id: 'new-lead', label: 'New lead arrives', detail: 'Email and push to the lead’s owner', on: true },
  { id: 'reply', label: 'A lead replies', detail: 'Push to the lead’s owner', on: true },
  { id: 'recovered', label: 'An older lead re-engages', detail: 'Email to Dana and the lead’s owner', on: true },
  { id: 'booked', label: 'An appointment is booked', detail: 'Calendar invite and email', on: true },
  { id: 'no-show', label: 'Someone misses an appointment', detail: 'Push to the host', on: true },
  { id: 'digest', label: 'Daily summary at 8 AM', detail: 'Email to the whole team', on: true },
  { id: 'weekly', label: 'Weekly performance report', detail: 'Email to owners every Monday', on: false },
]

export const integrationCatalog: Array<{ id: IntegrationId; name: string; description: string }> = [
  { id: 'web-forms', name: 'Website forms', description: 'Capture inquiries from the contact and listing forms on your site.' },
  { id: 'landing-pages', name: 'Landing pages', description: 'Bring in leads from campaign and home-value pages.' },
  { id: 'crm', name: 'CRM', description: 'Keep contacts, stages and notes in sync both ways.' },
  { id: 'calendar', name: 'Calendar', description: 'Offer real availability and book appointments for your team.' },
  { id: 'email-inbox', name: 'Email inbox', description: 'Send follow-ups from your own address and catch every reply.' },
  { id: 'phone-text', name: 'Phone & text', description: 'Text back missed calls and hold two-way text conversations.' },
  { id: 'webhooks', name: 'Webhooks', description: 'Send lead and stage events to the other tools you use.' },
  { id: 'spreadsheet', name: 'Spreadsheet import', description: 'Upload older lead lists so they can be re-engaged.' },
]

/** Per-client notes shown on integrations that need attention. */
export const attentionNotes: Record<string, string> = {
  'juniper-row.email-inbox': 'Access expired Sep 23. Reconnect to keep sending from your own address.',
  'crescent-ridge.web-forms': 'No submissions since Sep 3. The form on the quote page may have changed.',
  'bellwether.webhooks': 'Endpoint returning 410 Gone since Sep 20. Events are queued for retry.',
}
