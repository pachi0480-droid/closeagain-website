/**
 * Builds a client's sample history: leads, their conversation threads and
 * the appointments they book. Deterministic — the same client always yields
 * the same data — and consistent by construction: a lead's stage, reply,
 * recovery and appointment all come from its thread, and every count the
 * dashboards show is computed from these records.
 */

import { automationIdFor, initialDeployments } from './automations.ts'
import { fmtTime, fmtWeekdayDate } from './format.ts'
import { fill, kits, type Exchange, type Flow, type Kit } from './kits.ts'
import { emailDomains, firstNames, lastNames } from './names.ts'
import { createRng, poisson, type Rng } from './random.ts'
import { DAY, DEMO_NOW, HOUR, MINUTE, TODAY, atDay, atLocal, dayIndex, localParts } from './time.ts'
import type { Appointment, AppointmentStatus, Channel, Client, Lead, Message, Outcome, Sender, SourceId, StageId } from './types.ts'

/** Days of sample history behind DEMO_NOW. */
export const HISTORY_DAYS = 90

/** Relative lead volume by weekday, Sunday first. */
const WEEKDAY_FACTOR = [0.62, 1.14, 1.1, 1.06, 1.02, 0.94, 0.78]

const INQUIRY_HOURS: ReadonlyArray<readonly [number, number]> = [
  [0, 0.8], [1, 0.4], [5, 0.4], [6, 1], [7, 3], [8, 6], [9, 8], [10, 8], [11, 7], [12, 7], [13, 6],
  [14, 6], [15, 6], [16, 6], [17, 6], [18, 7], [19, 7], [20, 6], [21, 4], [22, 2], [23, 1.4],
]

const AREA_CODES: Record<string, string> = {
  'juniper-row': '843',
  'blue-heron': '813',
  bellwether: '614',
  'crescent-ridge': '919',
  solstice: '480',
  marigold: '512',
  'calder-wynn': '303',
  fieldnote: '503',
  tallyhouse: '612',
  'wren-loom': '828',
}

/**
 * Lead sources that stopped delivering: the sample “needs attention” story.
 * Crescent Ridge's quote form (on its site and its landing page) broke on Sep 3.
 */
export const OUTAGES: Record<string, { sources: SourceId[]; since: number }> = {
  'crescent-ridge': { sources: ['web-form', 'landing-page'], since: atLocal(2026, 8, 3, 14, 0) },
}

const HISTORY_REPLIES = [
  'Thanks {first} — happy to help whenever you’re ready.',
  'Thanks for reaching out, {first}. Let us know when the timing is right.',
  'Good to hear from you, {first}. We’ll keep an eye out for you.',
]

const REACTIVATION_NUDGES = [
  'Anything changed since we last spoke, {first}? Happy to pick this back up.',
  'Last check-in from me, {first}. Reply YES and I’ll reach out.',
]

const CANCELLATIONS = ['Something came up — can we reschedule later?', 'Sorry, I need to cancel. I’ll reach out when things settle.']

export type Dataset = { leads: Lead[]; appointments: Appointment[] }

export type GenerateOptions = {
  /** Short id prefix for records, e.g. “jr”. */
  prefix: string
  /** Names already taken by hand-written leads. */
  reserved?: Iterable<string>
  /**
   * Generated activity stops this long before DEMO_NOW, leaving the most
   * recent moments to hand-written threads.
   */
  quietBefore?: number
}

type Draft = {
  id: string
  client: Client
  kit: Kit
  flow: Flow
  alt: boolean
  first: string
  name: string
  email: string
  phone: string
  source: SourceId
  interest: string
  owner: string
  channel: 'text' | 'email'
  createdAt: number
  enrolledAt: number
  automationId: string
  messages: Message[]
  stage: StageId
  outcome?: Outcome
  repliedAt?: number
  recoveredAt?: number
  appointment?: Appointment
  appointmentCount: number
  nextAction?: string
  nextAt?: number
}

const firstName = (name: string) => name.replace(/^Dr\.\s+/, '').split(' ')[0]

export function generateClient(client: Client, options: GenerateOptions): Dataset {
  const rng = createRng(`closeagain-demo:${client.id}`)
  const kit = kits[client.kit]
  const cutoff = DEMO_NOW - (options.quietBefore ?? 12 * MINUTE)
  const used = new Set(options.reserved ?? [])
  const deployed = new Set<string>(initialDeployments[client.id] ?? [])
  const has = (templateId: string) => deployed.has(templateId)
  const outage = OUTAGES[client.id]
  const areaCode = AREA_CODES[client.id] ?? '555'
  const reminderAutomation = automationIdFor(client.id, 'tpl-reminder')
  const noShowAutomation = automationIdFor(client.id, 'tpl-no-show')

  const leads: Lead[] = []
  const appointments: Appointment[] = []
  let seq = 0

  const firstDay = TODAY - (HISTORY_DAYS - 1)
  const startDay = Math.max(firstDay, dayIndex(client.since))
  const endDay = client.paused ? dayIndex(client.paused.at) : TODAY
  const stopAt = client.paused ? Math.min(cutoff, client.paused.at) : cutoff

  // ── helpers ────────────────────────────────────────────────────────────

  const pickName = () => {
    for (let tries = 0; tries < 60; tries++) {
      const first = rng.pick(firstNames)
      const last = rng.pick(lastNames)
      const full = `${first} ${last}`
      if (!used.has(full)) {
        used.add(full)
        return { first, last, full }
      }
    }
    const first = rng.pick(firstNames)
    const last = `${rng.pick(lastNames)}-${rng.pick(lastNames)}`
    return { first, last, full: `${first} ${last}` }
  }

  const agents = client.team.filter((person) => !/coordinator|operations|office|paralegal|front desk/i.test(person.role))
  const pickOwner = (alt: boolean) => {
    if (alt && client.kit === 'real-estate') {
      const lister = agents.find((person) => /listing/i.test(person.role))
      if (lister) return lister.name
    }
    // Owners and partners take fewer first conversations than the people they employ.
    return rng.weighted(agents.map((person) => [person.name, /owner|partner|director|founder|head/i.test(person.role) ? 2 : 4] as const))
  }

  const pickSource = (at: number): SourceId | null => {
    const source = rng.weighted(kit.sources)
    if (source === 'phone' && !has('tpl-missed-inquiry')) return rng.chance(0.5) ? 'web-form' : 'email'
    // The broken form: those inquiries never arrived.
    if (outage && outage.sources.includes(source) && at >= outage.since) return null
    return source
  }

  const delay = (min: number, max: number) => Math.round(rng.range(min, max))

  /** A reply delay that lands before the next scheduled follow-up. */
  const replyDelay = () =>
    rng.weighted([
      [() => delay(4 * MINUTE, 55 * MINUTE), 40],
      [() => delay(1 * HOUR, 6 * HOUR), 35],
      [() => delay(6 * HOUR, 16 * HOUR), 25],
    ] as const)()

  /** Follow-ups go out mid-morning. */
  const sendingTime = (ms: number) => atDay(dayIndex(ms), 10, delay(0, 25))

  /** People on the team reply during working hours. */
  const workingTime = (ms: number) => {
    const { hour } = localParts(ms)
    if (hour < 8) return atDay(dayIndex(ms), 8, delay(5, 50))
    if (hour >= 19) return atDay(dayIndex(ms) + 1, 8, delay(5, 50))
    return ms
  }

  const words = (draft: Draft, extra: Record<string, string> = {}) => ({
    first: draft.first,
    client: client.short,
    agent: firstName(draft.owner),
    interest: draft.interest,
    ...extra,
  })
  const say = (draft: Draft, list: string[], extra?: Record<string, string>) => fill(rng.pick(list), words(draft, extra))
  const exchange = (draft: Draft, list: Exchange[]) => {
    const picked = rng.pick(list)
    return { say: fill(picked.say, words(draft)), replies: picked.replies }
  }

  const add = (draft: Draft, from: Sender, channel: Channel, at: number, body: string, author?: string, via?: string) => {
    draft.messages.push({
      id: `${draft.id}.${draft.messages.length + 1}`,
      from,
      channel,
      at,
      body,
      ...(author ? { author } : {}),
      ...(from === 'closeagain' ? { via: via ?? draft.automationId } : {}),
    })
  }

  const slotAfter = (t: number) => {
    let day = dayIndex(t) + rng.weighted([[1, 22], [2, 20], [3, 18], [4, 12], [5, 10], [6, 8], [7, 4], [8, 3], [9, 3]] as const)
    const weekday = localParts(atDay(day, 12)).weekday
    if (weekday === 0 && client.kit !== 'real-estate') day += 1
    const hour = rng.weighted([[9, 5], [10, 7], [11, 7], [12, 3], [13, 5], [14, 7], [15, 7], [16, 6], [17, 4]] as const)
    return atDay(day, hour, rng.pick([0, 0, 30]))
  }

  const pickTarget = (ageDays: number): StageId => {
    if (ageDays < 0.25) return rng.weighted([['active', 80], ['qualified', 20]] as const)
    if (ageDays < 2) return rng.weighted([['active', 45], ['qualified', 35], ['appointment', 20]] as const)
    if (ageDays < 7) return rng.weighted([['active', 20], ['qualified', 25], ['appointment', 40], ['closed', 15]] as const)
    if (ageDays < 21) return rng.weighted([['active', 10], ['qualified', 15], ['appointment', 35], ['closed', 40]] as const)
    return rng.weighted([['active', 5], ['qualified', 8], ['appointment', 20], ['closed', 67]] as const)
  }

  const newDraft = (createdAt: number, source: SourceId, template: string): Draft => {
    const { first, last, full } = pickName()
    const alt = Boolean(kit.alt && rng.chance(kit.alt.share))
    const flow = alt && kit.alt ? kit.alt : kit.main
    const interest = rng.pick(flow.interests)
    const owner = pickOwner(alt)
    const handle = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, '')
    const automation = template === 'tpl-new-lead' && alt && has('tpl-proposal') ? 'tpl-proposal' : template
    return {
      id: `${options.prefix}-${String(++seq).padStart(4, '0')}`,
      client,
      kit,
      flow,
      alt,
      first,
      name: full,
      email: `${handle}@${rng.pick(emailDomains)}`,
      phone: `(${areaCode}) 555-01${String(rng.int(0, 99)).padStart(2, '0')}`,
      source,
      interest,
      owner,
      channel: source === 'email' ? 'email' : rng.chance(0.82) ? 'text' : 'email',
      createdAt,
      enrolledAt: createdAt,
      automationId: automationIdFor(client.id, automation),
      messages: [],
      stage: 'new',
      appointmentCount: 0,
    }
  }

  /**
   * Follow-ups after the first message. The lead replies after touch
   * `replyAfter` (0 = the first message), or never when it is −1.
   */
  const runTouches = (
    draft: Draft,
    firstTouchAt: number,
    replyAfter: number,
    gaps: number[],
    nudge: (index: number) => { channel: 'text' | 'email'; body: string },
    firstReplies: string[],
  ): { replyAt?: number; replyIndex?: number; pendingAt?: number } => {
    let touchAt = firstTouchAt
    for (let k = 0; ; k++) {
      if (k === replyAfter) {
        const replyAt = touchAt + replyDelay()
        if (replyAt < stopAt) {
          add(draft, 'lead', draft.channel, replyAt, rng.pick(k === 0 ? firstReplies : draft.flow.lateReplies))
          return { replyAt, replyIndex: k }
        }
      }
      if (k >= gaps.length) return {}
      const nextAt = sendingTime(touchAt + gaps[k] * DAY)
      if (nextAt >= stopAt) return { pendingAt: nextAt }
      touchAt = nextAt
      const next = nudge(k)
      add(draft, 'closeagain', next.channel, touchAt, next.body)
    }
  }

  const makeAppointment = (draft: Draft, bookedAt: number, start: number): Appointment => {
    draft.appointmentCount++
    const types = draft.flow.appointmentTypes ?? kit.appointmentTypes
    const appointment: Appointment = {
      id: `${draft.id}.a${draft.appointmentCount}`,
      clientId: client.id,
      leadId: draft.id,
      leadName: draft.name,
      type: rng.pick(types),
      start,
      durationMin: rng.pick([30, 45, 60, 60]),
      location: rng.pick(kit.locations),
      host: draft.owner,
      status: 'scheduled',
      bookedAt,
    }
    appointments.push(appointment)
    draft.appointment = appointment
    return appointment
  }

  const confirmations = (draft: Draft) => (draft.channel === 'email' ? kit.confirm.filter((text) => text !== 'C') : kit.confirm)

  /** Book a slot and play the appointment out as far as the clock allows. */
  const book = (draft: Draft, at: number, closeAfter: boolean): void => {
    const start = slotAfter(at)
    add(draft, 'closeagain', draft.channel, at, fill(rng.pick(kit.book), words(draft, { day: fmtWeekdayDate(start), time: fmtTime(start) })))
    const appointment = makeAppointment(draft, at, start)
    draft.stage = 'appointment'

    let confirmed = false
    let lastAt = at
    const confirmAt = at + delay(1 * MINUTE, 2 * HOUR)
    if (confirmAt < stopAt && confirmAt < start && rng.chance(0.78)) {
      add(draft, 'lead', draft.channel, confirmAt, rng.pick(confirmations(draft)))
      confirmed = true
      lastAt = confirmAt
    }
    if (has('tpl-reminder')) {
      const reminderAt = start - DAY
      if (reminderAt > lastAt + HOUR && reminderAt < stopAt) {
        add(draft, 'closeagain', 'text', reminderAt, fill(rng.pick(kit.reminder), words(draft, { day: 'tomorrow', time: fmtTime(start) })), undefined, reminderAutomation)
        lastAt = reminderAt
        const ack = reminderAt + delay(3 * MINUTE, 90 * MINUTE)
        if (ack < stopAt && rng.chance(0.7)) {
          add(draft, 'lead', 'text', ack, rng.pick(['C', 'C — see you then', 'Confirmed']))
          confirmed = true
          lastAt = ack
        }
      }
    }

    const end = start + appointment.durationMin * MINUTE
    if (end >= stopAt) {
      appointment.status = confirmed ? 'confirmed' : 'scheduled'
      return
    }
    const status: AppointmentStatus = rng.weighted([['completed', 80], ['no-show', 12], ['cancelled', 8]] as const)
    appointment.status = status
    if (status === 'cancelled') {
      const cancelAt = Math.max(lastAt + 10 * MINUTE, start - delay(3 * HOUR, 20 * HOUR))
      if (cancelAt < start && cancelAt < stopAt) add(draft, 'lead', draft.channel, cancelAt, rng.pick(CANCELLATIONS))
      draft.stage = 'reengage'
      draft.nextAction = 'Offer new times'
      return
    }
    if (status === 'no-show') {
      draft.stage = 'reengage'
      draft.nextAction = 'Rebook after no-show'
      if (!has('tpl-no-show')) return
      const followAt = end + 2 * HOUR
      if (followAt >= stopAt) return
      add(draft, 'closeagain', 'text', followAt, say(draft, kit.noShow), undefined, noShowAutomation)
      // Many people rebook once someone reaches out.
      if (draft.appointmentCount < 2 && rng.chance(0.45)) {
        const replyAt = followAt + delay(20 * MINUTE, 14 * HOUR)
        if (replyAt >= stopAt) return
        add(draft, 'lead', 'text', replyAt, rng.pick(kit.reschedule))
        const rebookAt = replyAt + delay(1 * MINUTE, 4 * MINUTE)
        if (rebookAt >= stopAt) return
        draft.nextAction = undefined
        book(draft, rebookAt, closeAfter)
      }
      return
    }
    if (closeAfter) {
      const closeAt = end + delay(1 * DAY, 6 * DAY)
      if (closeAt < stopAt) {
        const won = rng.chance(0.45)
        add(draft, 'lead', draft.channel, closeAt, say(draft, won ? draft.flow.won : draft.flow.lost))
        draft.stage = 'closed'
        draft.outcome = won ? 'won' : 'lost'
      }
    }
  }

  /** Everything after the lead's first reply, stopping where the clock runs out. */
  const progressAfterReply = (draft: Draft, repliedAt: number) => {
    draft.repliedAt = repliedAt
    draft.stage = 'active'
    const target = pickTarget((stopAt - repliedAt) / DAY)
    let t = repliedAt + delay(50_000, 3 * MINUTE)
    if (t >= stopAt) return
    const question = exchange(draft, draft.flow.qualify)
    add(draft, 'closeagain', draft.channel, t, question.say)
    if (target === 'active') return

    if (target === 'closed' && rng.chance(0.35)) {
      const lostAt = t + delay(1 * DAY, 8 * DAY)
      if (lostAt < stopAt) {
        add(draft, 'lead', draft.channel, lostAt, say(draft, draft.flow.lost))
        draft.stage = 'closed'
        draft.outcome = 'lost'
      }
      return
    }

    t += delay(10 * MINUTE, 8 * HOUR)
    if (t >= stopAt) return
    add(draft, 'lead', draft.channel, t, rng.pick(question.replies))
    t = workingTime(t + delay(12 * MINUTE, 3 * HOUR))
    if (t >= stopAt) return
    add(draft, 'team', draft.channel, t, say(draft, draft.flow.team, { day: rng.pick(['Friday', 'Saturday', 'Monday', 'Tuesday']) }), draft.owner)
    draft.stage = 'qualified'
    if (target === 'qualified') return

    t = workingTime(t + delay(6 * MINUTE, 20 * HOUR))
    if (t >= stopAt) return
    book(draft, t, target === 'closed')
  }

  // ── new leads, day by day ──────────────────────────────────────────────

  const freshGaps = [1, 3, 4]
  for (let day = startDay; day <= endDay; day++) {
    const ago = TODAY - day
    const progress = 1 - ago / (HISTORY_DAYS - 1)
    const weekday = localParts(atDay(day, 12)).weekday
    let mean = client.rate * WEEKDAY_FACTOR[weekday] * (1 + client.trend * (progress - 0.5))
    if (day === TODAY) mean *= 0.34
    const count = poisson(rng, Math.max(0, mean))
    for (let i = 0; i < count; i++) {
      const hour = rng.weighted(INQUIRY_HOURS)
      const createdAt = atDay(day, hour, rng.int(0, 59)) + rng.int(0, 59) * 1000
      const source = pickSource(createdAt)
      if (source === null || createdAt >= stopAt - 6 * MINUTE) continue
      const draft = newDraft(createdAt, source, source === 'phone' ? 'tpl-missed-inquiry' : 'tpl-new-lead')

      let t = createdAt
      let opener: { say: string; replies: string[] }
      if (source === 'phone') {
        t += delay(70_000, 3 * MINUTE)
        opener = exchange(draft, draft.flow.missedCall)
        add(draft, 'closeagain', 'text', t, opener.say)
      } else {
        add(draft, 'lead', source === 'email' ? 'email' : 'web', t, say(draft, draft.flow.inquiry))
        t += delay(40_000, 3 * MINUTE)
        opener = exchange(draft, draft.flow.firstTouch)
        add(draft, 'closeagain', draft.channel, t, opener.say)
      }

      const willReply = rng.chance(client.replyRate)
      const replyAfter = willReply ? rng.weighted([[0, 70], [1, 22], [2, 8]] as const) : -1
      const result = runTouches(
        draft,
        t,
        replyAfter,
        freshGaps,
        (k) => ({ channel: k === 1 ? 'email' : draft.channel, body: say(draft, kit.nudge[k]) }),
        opener.replies,
      )
      if (result.replyAt !== undefined) {
        // Someone who went quiet for days and came back counts as recovered.
        if ((result.replyIndex ?? 0) >= 2) draft.recoveredAt = result.replyAt
        progressAfterReply(draft, result.replyAt)
      } else if (result.pendingAt !== undefined) {
        const touchesSent = draft.messages.filter((message) => message.from === 'closeagain').length
        draft.stage = touchesSent >= 3 ? 'reengage' : 'new'
        draft.nextAction = touchesSent >= 3 ? 'Final check-in' : `Follow-up ${touchesSent === 1 ? 'text' : 'email'}`
        draft.nextAt = result.pendingAt > DEMO_NOW ? result.pendingAt : DEMO_NOW + rng.int(12, 260) * MINUTE
      } else {
        draft.stage = 'reengage'
        draft.nextAction = 'Waiting for the next reactivation wave'
      }
      leads.push(finalize(draft, rng))
    }
  }

  // ── older leads brought back by reactivation ───────────────────────────

  for (let i = 0; i < client.pool; i++) {
    const wave = rng.weighted(client.waves.map((w) => [w, w.share] as const))
    let day = TODAY - rng.int(wave.to, wave.from)
    if (day < startDay) day = startDay
    if (day > endDay) continue
    const enrolledAt = atDay(day, rng.int(9, 10), rng.int(0, 59))
    if (enrolledAt >= stopAt - 30 * MINUTE) continue
    const createdAt = enrolledAt - rng.int(95, 540) * DAY - rng.int(0, 600) * MINUTE
    const source: SourceId = rng.chance(0.55) ? 'crm' : 'import'
    const draft = newDraft(createdAt, source, 'tpl-reactivation')
    draft.automationId = automationIdFor(client.id, 'tpl-reactivation')
    draft.enrolledAt = enrolledAt

    add(draft, 'lead', rng.chance(0.6) ? 'web' : 'email', createdAt, say(draft, draft.flow.inquiry))
    add(draft, 'team', 'email', workingTime(createdAt + delay(2 * HOUR, 26 * HOUR)), say(draft, HISTORY_REPLIES), draft.owner)
    const opener = exchange(draft, draft.flow.reactivate)
    add(draft, 'closeagain', draft.channel, enrolledAt, opener.say)

    const willReply = rng.chance(client.replyRate * 0.52)
    const replyAfter = willReply ? rng.weighted([[0, 72], [1, 20], [2, 8]] as const) : -1
    const result = runTouches(
      draft,
      enrolledAt,
      replyAfter,
      [3, 7],
      (k) => ({ channel: k === 0 ? 'email' : draft.channel, body: fill(REACTIVATION_NUDGES[k], { first: draft.first }) }),
      opener.replies,
    )
    if (result.replyAt !== undefined) {
      draft.recoveredAt = result.replyAt
      progressAfterReply(draft, result.replyAt)
    } else {
      draft.stage = 'reengage'
      if (result.pendingAt !== undefined) {
        const step = draft.messages.filter((message) => message.from === 'closeagain').length + 1
        draft.nextAction = `Reactivation step ${step} of 3`
        draft.nextAt = result.pendingAt > DEMO_NOW ? result.pendingAt : DEMO_NOW + rng.int(12, 260) * MINUTE
      } else {
        draft.nextAction = 'Sequence complete · check back in 90 days'
      }
    }
    leads.push(finalize(draft, rng))
  }

  leads.sort((a, b) => b.lastContactAt - a.lastContactAt)
  appointments.sort((a, b) => a.start - b.start)
  return { leads, appointments }
}

/** The team's next working moment at or after a time: 9 AM–6 PM, weekdays and Saturdays. */
function workingSlot(ms: number): number {
  let day = dayIndex(ms)
  let { hour } = localParts(ms)
  let minute = localParts(ms).minute
  if (hour >= 18) {
    day += 1
    hour = 9
    minute = 0
  } else if (hour < 9) {
    hour = 9
    minute = 0
  }
  if (localParts(atDay(day, 12)).weekday === 0) {
    day += 1
    hour = 9
    minute = 0
  }
  return atDay(day, hour, minute - (minute % 15))
}

/** Derive the summary fields of a lead from its thread and stage. */
function finalize(draft: Draft, rng: Rng): Lead {
  const { kit, flow } = draft
  const messages = draft.messages
  const last = messages[messages.length - 1]
  let stage = draft.stage
  let nextAction = draft.nextAction
  let nextAt = draft.nextAt

  // Quiet open conversations move to Re-engage after three weeks, as the
  // New Lead Follow-Up sequence does.
  if ((stage === 'active' || stage === 'qualified') && DEMO_NOW - last.at > 21 * DAY) {
    stage = 'reengage'
    nextAction = 'Moved to re-engage after 3 quiet weeks'
    nextAt = undefined
  }
  // A visit that happened weeks ago without a decision is worth a fresh check-in.
  if (stage === 'appointment' && draft.appointment && draft.appointment.start < DEMO_NOW - 14 * DAY) {
    stage = 'reengage'
    nextAction = 'Check in after the visit'
    nextAt = workingSlot(DEMO_NOW + rng.int(2, 30) * HOUR)
  }

  if (!nextAction) {
    if (stage === 'active') {
      nextAction = last.from === 'lead' ? `Reply to ${draft.first}` : 'Waiting on reply'
    } else if (stage === 'qualified') {
      nextAction = rng.pick(flow.qualifiedNext)
      nextAt = workingSlot(DEMO_NOW + rng.int(1, 30) * HOUR)
    } else if (stage === 'appointment' && draft.appointment) {
      if (draft.appointment.start > DEMO_NOW) {
        nextAction = draft.appointment.type
        nextAt = draft.appointment.start
      } else {
        nextAction = 'Post-visit follow-up'
        nextAt = workingSlot(DEMO_NOW + rng.int(2, 26) * HOUR)
      }
    } else if (stage === 'closed') {
      nextAction = draft.outcome === 'won' ? 'Ask for a review' : 'Check back in 6 months'
      nextAt = draft.outcome === 'won' ? undefined : last.at + 182 * DAY
    } else if (stage === 'reengage') {
      nextAction = 'Offer new times'
      nextAt = workingSlot(DEMO_NOW + rng.int(2, 20) * HOUR)
    } else {
      nextAction = 'Follow-up text'
      nextAt = workingSlot(DEMO_NOW + rng.int(1, 20) * HOUR)
    }
  }

  const recovered = draft.recoveredAt !== undefined
  const tagPool = flow.tags ?? kit.tags
  let tags: string[]
  if (draft.client.kit === 'real-estate') {
    const lead = draft.alt ? 'Seller' : 'Buyer'
    tags = [lead, ...rng.sample(tagPool.filter((tag) => tag !== lead), rng.int(0, 1))]
  } else {
    tags = rng.sample(tagPool, rng.int(1, 2))
  }
  const inquiryHour = localParts(draft.createdAt).hour
  if (draft.source !== 'crm' && draft.source !== 'import' && (inquiryHour >= 20 || inquiryHour < 7)) tags.push('After hours')
  if (recovered) tags.unshift('Recovered')

  const scoreRange: Record<StageId, [number, number]> = {
    new: [36, 70],
    active: [46, 82],
    qualified: [64, 92],
    appointment: [72, 96],
    closed: draft.outcome === 'won' ? [88, 99] : [10, 36],
    reengage: [12, 44],
  }
  const [low, high] = scoreRange[stage]
  const score = Math.min(99, rng.int(low, high) + (draft.source === 'referral' ? 5 : 0) + (recovered ? 4 : 0))
  const [min, max, step] = kit.value
  const value = Math.round(rng.range(min, max) / step) * step

  return {
    id: draft.id,
    clientId: draft.client.id,
    name: draft.name,
    first: draft.first,
    email: draft.email,
    phone: draft.phone,
    source: draft.source,
    interest: draft.interest,
    tags,
    score,
    stage,
    ...(draft.outcome && stage === 'closed' ? { outcome: draft.outcome } : {}),
    createdAt: draft.createdAt,
    enrolledAt: draft.enrolledAt,
    ...(draft.recoveredAt !== undefined ? { recoveredAt: draft.recoveredAt } : {}),
    ...(draft.repliedAt !== undefined ? { repliedAt: draft.repliedAt } : {}),
    lastContactAt: last.at,
    owner: draft.owner,
    automationId: draft.automationId,
    sent: messages.filter((message) => message.from === 'closeagain').length,
    value,
    nextAction,
    ...(nextAt !== undefined ? { nextAt } : {}),
    channel: draft.channel,
    ...(draft.appointment ? { appointmentId: draft.appointment.id } : {}),
    unread: last.from === 'lead' && stage !== 'closed' && DEMO_NOW - last.at < 30 * HOUR,
    thread: messages,
  }
}
