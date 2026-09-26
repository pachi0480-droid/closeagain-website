/**
 * Industry kits: what sample leads ask about and the short messages that
 * make up their threads. Questions are paired with the answers that fit them,
 * so generated threads read like real conversations.
 *
 * Placeholders: {first} (the lead), {agent} (a team member), {client} (the
 * business), {interest}, {day} and {time}. Everything here is illustrative
 * sample copy, not a record of any real conversation.
 */

import type { SourceId } from './types.ts'

export type KitId = 'real-estate' | 'hvac' | 'roofing' | 'med-spa' | 'law' | 'agency' | 'saas' | 'ecommerce'

/** Something CloseAgain says, and the replies that make sense after it. */
export type Exchange = { say: string; replies: string[] }

export type Flow = {
  interests: string[]
  inquiry: string[]
  firstTouch: Exchange[]
  missedCall: Exchange[]
  /** Replies from someone who went quiet and answered a later follow-up. */
  lateReplies: string[]
  qualify: Exchange[]
  team: string[]
  reactivate: Exchange[]
  won: string[]
  lost: string[]
  qualifiedNext: string[]
  appointmentTypes?: string[]
  tags?: string[]
}

export type Kit = {
  id: KitId
  tags: string[]
  appointmentTypes: string[]
  locations: string[]
  /** Estimated deal value range in USD, and the step to round to. */
  value: [number, number, number]
  valueLabel: string
  sources: ReadonlyArray<readonly [SourceId, number]>
  book: string[]
  confirm: string[]
  reminder: string[]
  /** Follow-ups when there is no reply: after 1 day, 4 days and 8 days. */
  nudge: [string[], string[], string[]]
  noShow: string[]
  reschedule: string[]
  main: Flow
  /** A second kind of lead (sellers, for real estate) and its share of new leads. */
  alt?: Flow & { share: number; label: string }
}

export const kits: Record<KitId, Kit> = {
  'real-estate': {
    id: 'real-estate',
    tags: ['Buyer', 'Pre-approved', 'First-time buyer', 'Relocating', 'Investor', 'Open house', 'Cash buyer'],
    appointmentTypes: ['Showing', 'Buyer consultation', 'Video walkthrough'],
    locations: ['On site', 'Office', 'Video call'],
    value: [6000, 24000, 250],
    valueLabel: 'Est. commission',
    sources: [
      ['web-form', 34],
      ['landing-page', 22],
      ['phone', 20],
      ['email', 14],
      ['referral', 10],
    ],
    book: [
      'You’re confirmed for {day} at {time} with {agent}. Reply C to confirm or R to reschedule.',
      'Booked: {day} at {time}. {agent} will meet you there. Reply here if anything changes.',
    ],
    confirm: ['C', 'Confirmed, thank you!', 'Perfect, see you then.'],
    reminder: ['Reminder: you’re seeing {agent} {day} at {time}. Reply C to confirm or R to reschedule.'],
    nudge: [
      ['Hi {first}, just checking in on {interest}. Still interested?', '{first}, happy to answer any questions about {interest}. Want me to send a few similar homes?'],
      ['{first}, a couple of new listings just came up that might fit. Want me to send them?', 'Hi {first} — prices moved a little this week. Want an updated list?'],
      ['No rush, {first}. If the timing isn’t right, reply LATER and we’ll check back next month.'],
    ],
    noShow: ['Sorry we missed you today, {first}. Want to pick a new time? Reply with a day that works.'],
    reschedule: ['So sorry — something came up. Could we try another day?', 'Sorry about that! Is Sunday open?'],
    main: {
      interests: [
        'the 3-bed on Magnolia St',
        'homes under $550k',
        'a 2-bed condo downtown',
        'new construction nearby',
        'the listing on Harbor View Rd',
        'a home in a good school zone',
        'a 4-bed with a pool',
        'the townhouse on Cedar Ln',
        'a starter home',
        'the bungalow on Palmetto Ave',
        'a rental property to invest in',
      ],
      inquiry: [
        'Hi, is {interest} still available? We’d love to see it this week.',
        'Interested in {interest}. What’s the best way to set up a tour?',
        'Hello — can someone send me more details on {interest}?',
        'We’re starting to look at {interest}. Are you taking new clients?',
      ],
      firstTouch: [
        {
          say: 'Hi {first}, it’s {agent} with {client}. Thanks for asking about {interest}. Are you hoping to tour this week, or getting a feel for the market?',
          replies: ['Just getting a feel for now, but we’d like to move by spring.', 'Tour this week if possible. Saturday works best.', 'Hoping to see it this week — we’re pre-approved.'],
        },
        {
          say: 'Hi {first} — {agent} here from {client}. Happy to help with {interest}. When’s a good time for a quick call?',
          replies: ['After 5 is easiest for me.', 'Tomorrow at lunch works.', 'Texting is easier for now, if that’s OK.'],
        },
        {
          say: 'Thanks for reaching out, {first}! This is {agent} at {client}. Are you already working with a lender, or would an intro help?',
          replies: ['We’re pre-approved already.', 'An intro would help, thanks.', 'Paying cash, actually.'],
        },
      ],
      missedCall: [
        {
          say: 'Hi, this is {client} — sorry we missed your call. How can we help? Reply here and {agent} will pick it up.',
          replies: ['Calling about a listing I saw online. Is it still available?', 'Wanted to set up a few showings this weekend.'],
        },
        {
          say: 'Sorry we missed you! It’s {agent} at {client}. Were you calling about a listing? Happy to help by text.',
          replies: ['Yes — the one on Harbor View Rd.', 'Yes, is it still on the market?'],
        },
      ],
      lateReplies: ['Sorry for the slow reply — yes, still interested!', 'Yes, still looking. Things got busy.', 'Still interested. Can we talk this week?'],
      qualify: [
        { say: 'Great. What price range feels comfortable, and how many bedrooms do you need?', replies: ['Under 550 and at least 3 bedrooms. A yard for the dog.', 'Around 450, two or three bedrooms.'] },
        { say: 'Got it. Any must-haves — yard, garage, school zone?', replies: ['Garage and a short commute downtown.', 'A yard and a good school zone.'] },
        { say: 'Perfect. Are you selling a home as well, or buying first?', replies: ['Buying first. Our lease is up in March.', 'We’d need to sell first. Can you help with that too?'] },
      ],
      team: [
        'Hi {first}, {agent} here — I pulled three homes that fit. Sending them over now.',
        'Thanks {first}! I can show you two options {day} morning. Want me to line them up?',
        'Hi {first}, I just tried you by phone and left a voicemail. Text me whenever suits.',
      ],
      reactivate: [
        { say: 'Hi {first}, it’s {agent} at {client}. We talked a while back about {interest}. Still interested?', replies: ['Yes. Let’s talk.', 'Actually yes — we’re ready to start looking again.', 'Yes! Can we talk this week?'] },
        { say: 'Hi {first} — rates have shifted since we last spoke. Still thinking about {interest}?', replies: ['Good timing. We just got pre-approved.', 'Yes, we’ve been watching rates.'] },
        { say: '{first}, it’s been a while! Are you still planning a move? Happy to pick this back up.', replies: ['We are! Spring is the plan now.', 'Yes. Let’s talk.'] },
      ],
      won: ['We’re under contract! Thank you for everything.', 'Offer accepted — thank you for staying in touch.'],
      lost: ['We decided to rent another year. Thanks though.', 'We went with a builder directly. Appreciate the help.'],
      qualifiedNext: ['Send matching listings', 'Offer showing times', 'Call to discuss budget', 'Intro to a lender'],
    },
    alt: {
      share: 0.2,
      label: 'Seller',
      interests: ['selling our townhouse', 'a home value estimate', 'listing our house this fall', 'selling a rental we own', 'downsizing next year'],
      inquiry: [
        'We’re thinking about {interest}. Could someone tell us what our place might be worth?',
        'Home value request — we’re considering {interest}.',
        'Hi, we’d like to talk to someone about {interest}.',
      ],
      firstTouch: [
        {
          say: 'Hi {first}, it’s {agent} with {client}. Thanks for reaching out about {interest}. Is the home you’re selling where you live now?',
          replies: ['Yes, we’ve been here eight years.', 'No, it’s a rental we own.'],
        },
        {
          say: 'Hi {first} — {agent} here from {client}. Happy to put together a value estimate. When are you hoping to sell?',
          replies: ['Ideally before the holidays.', 'Probably spring, but we want a number now.'],
        },
      ],
      missedCall: [
        {
          say: 'Hi, this is {client} — sorry we missed your call. How can we help? Reply here and {agent} will pick it up.',
          replies: ['Calling about selling our house. Can someone give us a value estimate?'],
        },
      ],
      lateReplies: ['Sorry, busy week — yes, still thinking about selling.', 'Yes, still interested in a value estimate.'],
      qualify: [
        { say: 'Great. Would a quick walkthrough help me give you a precise number?', replies: ['Yes please. Tuesday afternoon?', 'Sure, weekends are best.'] },
        { say: 'Got it. Have you made any updates to the home recently?', replies: ['New roof two years ago and a kitchen refresh.', 'Nothing major, just paint.'] },
      ],
      team: [
        'Hi {first}, {agent} here — I pulled recent sales on your street. Sending them over now.',
        'Thanks {first}! I can walk through the house {day} and bring a pricing analysis.',
      ],
      reactivate: [
        {
          say: 'Hi {first}, it’s {agent} at {client}. You asked about {interest} a while back. Still thinking about selling?',
          replies: ['Yes — we’re finally ready to list.', 'Yes. Let’s talk.', 'Maybe next spring. What are homes going for now?'],
        },
      ],
      won: ['Signed the listing agreement — excited to get started!', 'We accepted an offer! Thank you.'],
      lost: ['We decided to stay put for now.', 'We’re going to rent it out instead.'],
      qualifiedNext: ['Send pricing analysis', 'Schedule walkthrough', 'Send listing agreement'],
      appointmentTypes: ['Listing appointment'],
      tags: ['Seller', 'Downsizing', 'Relocating'],
    },
  },

  hvac: {
    id: 'hvac',
    tags: ['Repair', 'Replacement', 'Maintenance plan', 'Financing', 'Emergency', 'Heat pump', 'Warranty'],
    appointmentTypes: ['Service visit', 'Estimate', 'Maintenance visit', 'Install consult'],
    locations: ['Customer home'],
    value: [180, 14000, 20],
    valueLabel: 'Est. job value',
    sources: [
      ['phone', 34],
      ['web-form', 30],
      ['landing-page', 16],
      ['email', 10],
      ['referral', 10],
    ],
    book: ['You’re booked for {day} at {time}. Your tech will text when on the way.', 'Confirmed: {day} at {time}. Reply R to reschedule.'],
    confirm: ['Thanks!', 'Great, see you then.', 'Perfect.'],
    reminder: ['Reminder: your {client} visit is {day} at {time}. Reply C to confirm or R to reschedule.'],
    nudge: [
      ['Hi {first}, following up on {interest}. Want us to hold a spot this week?'],
      ['{first}, our schedule is filling up for next week. Still want someone to take a look?'],
      ['No problem if you’re all set — reply STOP and we won’t follow up.'],
    ],
    noShow: ['Hi {first}, our tech stopped by but missed you. Want to pick another time?'],
    reschedule: ['Sorry! Got called in to work. Can we do Saturday?', 'My mistake — could you come Monday instead?'],
    main: {
      interests: [
        'a new AC unit',
        'a furnace tune-up',
        'an AC blowing warm air',
        'a heat pump quote',
        'duct cleaning',
        'a noisy furnace',
        'a second opinion on a replacement quote',
        'a maintenance plan',
        'a smart thermostat install',
        'no heat upstairs',
      ],
      inquiry: ['Hi, I need someone to look at {interest}. Anything this week?', 'Can I get a quote for {interest}?', 'Looking for help with {interest}. What does a visit cost?'],
      firstTouch: [
        {
          say: 'Hi {first}, this is {agent} with {client}. Sorry to hear about {interest} — is it urgent, or can it wait a day or two?',
          replies: ['Not an emergency, but it’s getting worse.', 'It’s urgent — the upstairs is 84 degrees.', 'It can wait a couple of days.'],
        },
        { say: 'Thanks for reaching out, {first}! {agent} at {client} here. When are you usually home?', replies: ['Mornings are best. We’re home before 11.', 'After 3 on weekdays.'] },
      ],
      missedCall: [
        {
          say: 'Hi, it’s {client} — sorry we missed your call. Is this about a repair or a quote? Reply here and we’ll get you scheduled.',
          replies: ['A repair — the AC is blowing warm air.', 'A quote for a new system.'],
        },
        {
          say: 'Sorry we missed you! {agent} at {client}. If your system is down, reply URGENT and we’ll call right back.',
          replies: ['URGENT — no cooling at all.', 'Not urgent, just want a tune-up.'],
        },
      ],
      lateReplies: ['Sorry, just seeing this. Yes, still need someone.', 'Yes please — it’s acting up again.'],
      qualify: [
        { say: 'Got it. How old is the system, roughly?', replies: ['About 14 years old.', 'Maybe 8 or 9 years.'] },
        { say: 'Thanks. Is it the indoor unit, the outdoor unit, or not sure?', replies: ['The outdoor unit makes a buzzing sound.', 'Not sure, honestly.'] },
        { say: 'Understood. Would you like repair options, replacement options, or both?', replies: ['Both, if a replacement makes more sense.', 'Repair if possible.'] },
      ],
      team: ['Hi {first}, {agent} here. I can get a tech out {day} morning. Want me to lock it in?', 'Thanks {first} — I’ll send two replacement options with financing.'],
      reactivate: [
        { say: 'Hi {first}, it’s {client}. Last year you asked about {interest}. Want a fresh quote before winter?', replies: ['Yes, let’s schedule it.', 'Good reminder. Next week works.'] },
        { say: 'Hi {first} — {agent} at {client}. It’s tune-up season. Want us to check your system before it gets cold?', replies: ['Yes please — it’s been making noise again.', 'Yes. Let’s talk.'] },
      ],
      won: ['Install went great. Thanks!', 'All fixed — thank you!'],
      lost: ['We went with another company, thanks.', 'Decided to hold off until spring.'],
      qualifiedNext: ['Send repair options', 'Schedule estimate', 'Send financing options'],
    },
  },

  roofing: {
    id: 'roofing',
    tags: ['Inspection', 'Replacement', 'Repair', 'Insurance claim', 'Gutters', 'Storm damage', 'Financing'],
    appointmentTypes: ['Roof inspection', 'Estimate', 'Repair visit'],
    locations: ['Customer home'],
    value: [350, 22000, 50],
    valueLabel: 'Est. job value',
    sources: [
      ['phone', 30],
      ['web-form', 32],
      ['landing-page', 20],
      ['email', 8],
      ['referral', 10],
    ],
    book: ['Inspection booked for {day} at {time}. We’ll text when we’re on the way.', 'Confirmed for {day} at {time}. Reply R to reschedule.'],
    confirm: ['Great, thanks.', 'Sounds good.', 'See you then.'],
    reminder: ['Reminder: your roof inspection is {day} at {time}. Reply C to confirm.'],
    nudge: [
      ['Hi {first}, checking in on {interest}. Want us to take a look this week?'],
      ['{first}, storm season is busy — we still have a few inspection slots. Want one?'],
      ['If it’s handled, no worries — reply STOP and we’ll close this out.'],
    ],
    noShow: ['Hi {first}, we came by for the inspection but missed you. Want to reschedule?'],
    reschedule: ['Sorry, I forgot! Could you come Friday?', 'My fault — next week works better.'],
    main: {
      interests: ['a roof inspection', 'a leak over the kitchen', 'storm damage', 'a quote for a new roof', 'gutter replacement', 'missing shingles', 'an insurance claim inspection', 'a skylight leak'],
      inquiry: ['We have {interest}. Can someone come out this week?', 'Looking for a quote on {interest}.', 'Hi, need help with {interest}.'],
      firstTouch: [
        {
          say: 'Hi {first}, it’s {agent} at {client}. Thanks for reaching out about {interest}. Is water coming in right now?',
          replies: ['Not leaking now, but there’s a stain on the ceiling.', 'Yes, after last night’s storm.'],
        },
        { say: 'Thanks {first}! {agent} from {client} here. What day works for someone to take a look?', replies: ['Can you come Thursday?', 'Any weekday morning.'] },
      ],
      missedCall: [
        {
          say: 'Sorry we missed your call — it’s {client}. Is this about a leak or a quote? Reply and we’ll set up an inspection.',
          replies: ['A leak over the garage.', 'A quote for a full replacement.'],
        },
      ],
      lateReplies: ['Sorry for the delay — yes, still need an inspection.', 'Yes, the leak came back.'],
      qualify: [
        { say: 'Got it. Do you know roughly how old the roof is?', replies: ['Around 18 years.', 'It was replaced about 10 years ago.'] },
        { say: 'Thanks. Are you filing an insurance claim, or paying directly?', replies: ['Probably insurance.', 'Paying directly.'] },
      ],
      team: ['Hi {first}, {agent} here. We can inspect {day} morning and send photos after.', 'Thanks {first}. I’ll bring samples so you can compare shingle colors.'],
      reactivate: [
        { say: 'Hi {first}, it’s {client}. We looked at your roof last year. Want a free check before winter?', replies: ['Yes, let’s do it.', 'Actually yes, the leak is back.'] },
        { say: 'Hi {first} — {agent} here. You asked about {interest} a while back. Still on your list?', replies: ['Yes. Let’s talk.', 'Yes, finally ready to get it done.'] },
      ],
      won: ['Roof looks great. Thanks!', 'All done, thank you.'],
      lost: ['We went with our insurance company’s pick.', 'Holding off for now.'],
      qualifiedNext: ['Schedule inspection', 'Send estimate', 'Check claim status'],
    },
  },

  'med-spa': {
    id: 'med-spa',
    tags: ['New client', 'Returning client', 'Injectables', 'Laser', 'Facial', 'Membership', 'Referral', 'Gift card'],
    appointmentTypes: ['Consultation', 'Treatment', 'Follow-up visit'],
    locations: ['Studio'],
    value: [250, 3500, 25],
    valueLabel: 'Est. treatment value',
    sources: [
      ['landing-page', 30],
      ['web-form', 28],
      ['phone', 18],
      ['email', 8],
      ['referral', 16],
    ],
    book: ['You’re booked for {day} at {time}. Reply C to confirm. Please arrive 10 minutes early.', 'All set for {day} at {time}! We’ll send a reminder the day before.'],
    confirm: ['C', 'Confirmed!', 'Thank you!'],
    reminder: ['Reminder: your appointment at {client} is {day} at {time}. Reply C to confirm.'],
    nudge: [
      ['Hi {first}, still thinking about {interest}? We have a few openings this week.'],
      ['{first}, just a heads up — consult spots for next week are almost full.'],
      ['No pressure at all, {first}. Reply LATER and we’ll check back next month.'],
    ],
    noShow: ['Hi {first}, we missed you today! Life happens — want to pick a new time?'],
    reschedule: ['So sorry! Can I come Thursday instead?', 'Oops — could we do next Saturday?'],
    main: {
      interests: ['a Botox consult', 'laser hair removal', 'a hydrating facial', 'lip filler', 'a skin consultation', 'microneedling', 'laser resurfacing', 'a chemical peel', 'body contouring', 'a membership'],
      inquiry: ['Hi! I’m interested in {interest}. Any availability next week?', 'How much is {interest}?', 'Can I book {interest}?'],
      firstTouch: [
        {
          say: 'Hi {first}! It’s {agent} at {client}. Thanks for your interest in {interest}. Have you had it before, or would this be your first time?',
          replies: ['First time! A little nervous.', 'I’ve had it before, about a year ago.'],
        },
        { say: 'Hi {first}, {agent} from {client} here. We’d love to help with {interest}. Are weekdays or weekends better for you?', replies: ['Weekends are better.', 'Weekday afternoons.'] },
      ],
      missedCall: [
        {
          say: 'Hi, it’s {client} — sorry we missed your call! Looking to book or have a question? Reply here anytime.',
          replies: ['Looking to book a consult.', 'What does laser hair removal cost?'],
        },
      ],
      lateReplies: ['Sorry, just saw this! Yes, still interested.', 'Yes — is there anything next week?'],
      qualify: [
        { say: 'Totally normal! A free consult is a great first step. Do mornings or afternoons work better?', replies: ['Afternoons please.', 'Mornings, before work.'] },
        { say: 'Pricing depends on the area — the consult is free and we’ll give you an exact quote. Want me to find a time?', replies: ['Sure, a consult sounds good.', 'Saturday morning if you have it.'] },
      ],
      team: ['Hi {first}! {agent} here — I have a 2:30 on Thursday. Want it?', 'Hi {first}, I added you to our Saturday waitlist too, in case something opens.'],
      reactivate: [
        { say: 'Hi {first}! It’s been a while since your last visit. Want to get something on the calendar?', replies: ['Yes! I’ve been meaning to book.', 'Yes, do you have anything Saturday?'] },
        { say: 'Hi {first}, it’s {client}. You asked about {interest} earlier this year. Still interested?', replies: ['Yes. Let’s talk.', 'Yes please!'] },
      ],
      won: ['Loved it, thank you!', 'Booked my next one already.'],
      lost: ['I found somewhere closer, thanks.', 'Going to wait for now.'],
      qualifiedNext: ['Offer consult times', 'Send pricing guide', 'Follow up on waitlist'],
    },
  },

  law: {
    id: 'law',
    tags: ['Personal injury', 'Family law', 'Consultation', 'Referral', 'Urgent', 'Spanish speaker', 'Insurance involved'],
    appointmentTypes: ['Case review', 'Consultation', 'Document review'],
    locations: ['Office', 'Video call', 'Phone'],
    value: [2500, 40000, 500],
    valueLabel: 'Est. case value',
    sources: [
      ['web-form', 36],
      ['phone', 26],
      ['landing-page', 14],
      ['email', 10],
      ['referral', 14],
    ],
    book: ['Your consultation is booked for {day} at {time}. Reply C to confirm.', 'Confirmed: {day} at {time} with our team. We’ll send a reminder.'],
    confirm: ['Confirmed.', 'Thank you.', 'C'],
    reminder: ['Reminder: your consultation with {client} is {day} at {time}. Reply C to confirm.'],
    nudge: [
      ['Hi {first}, checking in about {interest}. Would a short call this week help?'],
      ['{first}, some claims have deadlines. Happy to review yours at no cost.'],
      ['If you’ve found help elsewhere, no problem — reply STOP and we’ll close your file.'],
    ],
    noShow: ['Hi {first}, we missed you for your consultation today. Would you like to reschedule?'],
    reschedule: ['I’m sorry, I couldn’t get off work. Is Friday possible?', 'Apologies — could we move it to next week?'],
    main: {
      interests: ['a car accident claim', 'a free case review', 'a slip-and-fall injury', 'a custody question', 'a divorce consultation', 'a workplace injury claim', 'child support changes', 'a dog bite injury'],
      inquiry: ['I’d like to talk to someone about {interest}.', 'Do you handle {interest}?', 'Hi, I need advice on {interest}.'],
      firstTouch: [
        { say: 'Hi {first}, this is {agent} with {client}. Thank you for reaching out. When would be a good time for a short, confidential call?', replies: ['Afternoons work.', 'As soon as possible.'] },
        { say: 'Hi {first}, {agent} at {client} here. We can help with {interest}. Is phone or video better for a first consultation?', replies: ['Phone is fine.', 'Video please.'] },
      ],
      missedCall: [{ say: 'Hi, this is {client}. Sorry we missed your call. Reply with a good time and we’ll call you back.', replies: ['Anytime after 2 today.', 'Tomorrow morning please.'] }],
      lateReplies: ['Sorry for the delay. Yes, I still need help.', 'Yes — can we talk this week?'],
      qualify: [
        { say: 'Understood. When did this happen, roughly?', replies: ['About two weeks ago.', 'Last month.'] },
        { say: 'Thank you. Has an insurance company contacted you yet?', replies: ['Yes, they called yesterday.', 'Not yet.'] },
        { say: 'The first consultation is free. Would tomorrow afternoon work?', replies: ['Tomorrow works.', 'Could we do Friday instead?'] },
      ],
      team: ['Hi {first}, {agent} here. I’ve set aside time with an attorney. Please bring any photos or letters you have.', 'Thanks {first}. Please don’t sign anything from the insurer before we talk.'],
      reactivate: [
        {
          say: 'Hi {first}, {client} here. You reached out earlier this year about {interest}. Is this still something we can help with?',
          replies: ['Yes, I still need help.', 'Yes. Let’s talk.', 'Actually yes, it came back up.'],
        },
      ],
      won: ['Thank you for taking my case.', 'Signed the agreement. Thanks.'],
      lost: ['I went with another firm.', 'We settled it on our own.'],
      qualifiedNext: ['Schedule attorney call', 'Request documents', 'Conflict check'],
    },
  },

  agency: {
    id: 'agency',
    tags: ['Web', 'Brand', 'Retainer', 'Project', 'Referral', 'Startup'],
    appointmentTypes: ['Discovery call', 'Proposal review', 'Kickoff'],
    locations: ['Video call', 'Studio'],
    value: [4000, 45000, 500],
    valueLabel: 'Est. project value',
    sources: [
      ['web-form', 40],
      ['referral', 26],
      ['email', 18],
      ['landing-page', 10],
      ['phone', 6],
    ],
    book: ['Discovery call booked for {day} at {time}. The video link is on the invite.', 'Confirmed for {day} at {time}.'],
    confirm: ['Great, talk then.', 'Confirmed.', 'Thanks!'],
    reminder: ['Reminder: discovery call with {client} {day} at {time}.'],
    nudge: [
      ['Hi {first}, following up on {interest}. Happy to share a rough estimate if helpful.', 'Hi {first}, did you get a chance to look at the proposal? Happy to walk through it.'],
      ['{first}, we have an opening in our November schedule. Want to talk before it fills?'],
      ['No worries if the timing changed — reply LATER and we’ll check back next quarter.'],
    ],
    noShow: ['Hi {first}, sorry we missed each other today. Want to find a new time?'],
    reschedule: ['Apologies — a meeting ran over. Tomorrow?', 'Sorry! Could we do Monday?'],
    main: {
      interests: ['a website redesign', 'a brand refresh', 'a product launch campaign', 'a social media retainer', 'a new logo', 'a landing page', 'packaging design'],
      inquiry: ['We’re looking for help with {interest}. Do you have capacity this quarter?', 'Could we get a quote for {interest}?', 'Hi — exploring studios for {interest}.'],
      firstTouch: [
        { say: 'Hi {first}, {agent} from {client} here. Thanks for reaching out about {interest}. What’s your timeline looking like?', replies: ['Hoping to launch by January.', 'Sometime next quarter.'] },
        { say: 'Hi {first}! We’d love to hear more about {interest}. Is there a budget range you’re working with?', replies: ['Budget is flexible for the right team.', 'Somewhere around 20 to 30k.'] },
      ],
      missedCall: [{ say: 'Hi, it’s {client} — sorry we missed your call. Want to book a quick discovery call? Reply with a time.', replies: ['Thursday afternoon works.'] }],
      lateReplies: ['Sorry for the slow reply — yes, still exploring.', 'Yes, can you share some case studies?'],
      qualify: [
        { say: 'Great. Who else will be involved in the decision?', replies: ['Me and our COO.', 'Our founder and me.'] },
        { say: 'Makes sense. Would a 30-minute discovery call this week help?', replies: ['Yes, Thursday works.', 'Sure, send some times.'] },
      ],
      team: ['Hi {first}, {agent} here. Sharing two case studies close to what you described.', 'Thanks {first} — I’ll have a proposal to you by Friday.'],
      reactivate: [
        {
          say: 'Hi {first}, {agent} at {client}. We spoke earlier this year about {interest}. Is that project back on the table?',
          replies: ['Yes, budget just got approved.', 'Yes. Let’s talk.', 'Good timing, actually.'],
        },
      ],
      won: ['Signed! Excited to get started.', 'Proposal approved. Let’s kick off.'],
      lost: ['We’re going in-house for now.', 'Went with a larger agency, thanks.'],
      qualifiedNext: ['Send proposal', 'Share case studies', 'Book discovery call'],
    },
  },

  saas: {
    id: 'saas',
    tags: ['Trial', 'Demo request', 'Team plan', 'Annual', 'Migration', 'Past customer', 'Upgrade'],
    appointmentTypes: ['Product demo', 'Onboarding call', 'Renewal call'],
    locations: ['Video call'],
    value: [1200, 18000, 100],
    valueLabel: 'Est. annual value',
    sources: [
      ['landing-page', 38],
      ['web-form', 30],
      ['email', 16],
      ['referral', 10],
      ['phone', 6],
    ],
    book: ['Demo booked for {day} at {time}. The link is in your inbox.', 'Confirmed for {day} at {time}.'],
    confirm: ['Thanks!', 'Confirmed.', 'See you then.'],
    reminder: ['Reminder: your {client} demo is {day} at {time}.'],
    nudge: [
      ['Hi {first}, checking in on {interest}. Any questions I can answer?'],
      ['{first}, want me to extend your trial a week so the team can try it?'],
      ['No worries if now isn’t the time — reply LATER and we’ll check back.'],
    ],
    noShow: ['Hi {first}, sorry we missed you for the demo. Want to grab another time?'],
    reschedule: ['Sorry — double-booked. Thursday?', 'Apologies! Next week works better.'],
    main: {
      interests: ['a product demo', 'pricing for a team of 10', 'the free trial', 'moving off spreadsheets', 'the accountant plan', 'an integration question'],
      inquiry: ['Can we get {interest}?', 'Interested in {interest}. What’s the best next step?', 'Hi, question about {interest}.'],
      firstTouch: [
        { say: 'Hi {first}, {agent} from {client} here. Thanks for asking about {interest}. How many people would be using it?', replies: ['About 12 people.', 'Just 4 of us for now.'] },
        { say: 'Hi {first}! Happy to help with {interest}. What are you using today?', replies: ['Spreadsheets, mostly.', 'An older desktop tool.'] },
      ],
      missedCall: [{ say: 'Hi, it’s {client} — sorry we missed your call. Want to book a demo? Reply with a time.', replies: ['Wednesday afternoon works.'] }],
      lateReplies: ['Sorry — busy month. Yes, still interested.', 'Yes, can we see a demo next week?'],
      qualify: [
        { say: 'Got it. Would a 20-minute demo this week help?', replies: ['Yes, Wednesday afternoon.', 'Sure, send a link.'] },
        { say: 'Makes sense. Are you looking to switch this quarter?', replies: ['Ideally before year end.', 'Yes, before our renewal.'] },
      ],
      team: ['Hi {first}, {agent} here. I set up a trial workspace for your team.', 'Thanks {first} — I’ll tailor the demo to month-end close.'],
      reactivate: [
        {
          say: 'Hi {first}, it’s {agent} at {client}. You looked at us earlier this year. We’ve shipped a lot since — want a quick tour?',
          replies: ['Sure, send some times.', 'Yes. Let’s talk.', 'Actually yes, our current tool isn’t working out.'],
        },
      ],
      won: ['We’re in. Sending the signed order form.', 'Upgraded — thanks for the help.'],
      lost: ['We picked another tool for now.', 'Budget got cut this quarter.'],
      qualifiedNext: ['Book demo', 'Send trial invite', 'Share pricing'],
    },
  },

  ecommerce: {
    id: 'ecommerce',
    tags: ['Wholesale', 'Custom order', 'Past customer', 'Cart', 'Gift', 'Event'],
    appointmentTypes: ['Wholesale call', 'Custom order consult'],
    locations: ['Video call', 'Phone'],
    value: [80, 6000, 10],
    valueLabel: 'Est. order value',
    sources: [
      ['web-form', 36],
      ['email', 26],
      ['landing-page', 20],
      ['referral', 10],
      ['phone', 8],
    ],
    book: ['Call booked for {day} at {time}. Talk soon!', 'Confirmed for {day} at {time}.'],
    confirm: ['Thanks!', 'Perfect.', 'Confirmed.'],
    reminder: ['Reminder: your call with {client} is {day} at {time}.'],
    nudge: [
      ['Hi {first}, still interested in {interest}? Happy to answer questions.'],
      ['{first}, the colors you asked about are back in stock this week.'],
      ['No worries if you’re all set — reply STOP and we’ll leave you be.'],
    ],
    noShow: ['Hi {first}, sorry we missed you on the call. Want to pick another time?'],
    reschedule: ['So sorry — can we try Friday?', 'Apologies! Monday morning?'],
    main: {
      interests: ['a wholesale account', 'a custom table linen order', 'a bulk order for an event', 'an order that didn’t go through', 'restocking the linen throw', 'a corporate gift order'],
      inquiry: ['Hi, I’m interested in {interest}.', 'Can you help with {interest}?', 'Question about {interest}.'],
      firstTouch: [
        { say: 'Hi {first}, it’s {agent} at {client}. Thanks for reaching out about {interest}! What quantities are you thinking?', replies: ['Around 40 pieces.', 'Maybe 100 to start.'] },
        { say: 'Hi {first}! {agent} here from {client}. Happy to help with {interest}. When do you need it by?', replies: ['By mid-November if possible.', 'Early December.'] },
      ],
      missedCall: [{ say: 'Hi, it’s {client} — sorry we missed your call. Reply here and we’ll help with your order.', replies: ['Calling about a wholesale account.'] }],
      lateReplies: ['Sorry for the delay — yes, still interested.', 'Yes please, send the details.'],
      qualify: [
        { say: 'We can do that. Would a quick call to go over colors help?', replies: ['A call would be great.', 'Friday works.'] },
        { say: 'Yes, we send samples. What’s the best shipping address?', replies: ['Sure, I’ll send it over.', 'Sending it now.'] },
      ],
      team: ['Hi {first}, {agent} here. I’ve put together a wholesale price sheet for you.', 'Thanks {first} — samples ship tomorrow.'],
      reactivate: [
        { say: 'Hi {first}! It’s been a while since your last order. Want first look at the fall collection?', replies: ['Yes please!', 'Oh nice, send it over.'] },
        { say: 'Hi {first}, it’s {client}. Still thinking about {interest}?', replies: ['Yes. Let’s talk.', 'Yes, we’re ordering for the holidays.'] },
      ],
      won: ['Order placed. Thank you!', 'Just paid the invoice — thanks!'],
      lost: ['Going to pass this season.', 'Found something closer to our budget.'],
      qualifiedNext: ['Send price sheet', 'Ship samples', 'Confirm quantities'],
    },
  },
}

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}
