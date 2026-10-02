import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  FileSpreadsheet,
  Globe,
  Mail,
  MessageCircle,
  MessageSquareReply,
  Phone,
  PlugZap,
  RotateCcw,
  Send,
  UserRound,
  Webhook,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/**
 * Product previews for the marketing pages: honest slices of CloseAgain's
 * interface, filled with sample data and fictional people. They are
 * decorative (hidden from assistive technology — the surrounding copy says
 * what they show) and carry no interactive controls, so nothing here can be
 * mistaken for a working button.
 */

export type PreviewKind =
  | 'intake'
  | 'sequence'
  | 'reengage'
  | 'thread'
  | 'inbox'
  | 'reply'
  | 'booking'
  | 'builder'
  | 'analytics'
  | 'integrations'
  | 'handoff'

const stagger = (i: number): CSSProperties => ({ '--i': i }) as CSSProperties

function Frame({
  title,
  short,
  meta,
  children,
  className,
}: {
  title: string
  /** Shown instead of a long title in phone-width frames. */
  short?: string
  meta?: string
  children: ReactNode
  className?: string
}) {
  // “Sample data” shortens to “Sample” in narrow frames, but never
  // disappears: the numbers in these windows are examples, not results.
  const [lead, ...rest] = (meta ?? 'Sample data').split(' ')
  return (
    <div className={['ui', 'ui-frame', 'pv', className].filter(Boolean).join(' ')} aria-hidden="true" inert>
      <div className="ui-frame__bar">
        <span className="ui-frame__dots">
          <span />
          <span />
          <span />
        </span>
        <span className="pv__title">
          {short ? (
            <>
              <span className="pv__title-long">{title}</span>
              <span className="pv__title-short">{short}</span>
            </>
          ) : (
            title
          )}
        </span>
        <span className="ui-sample pv__sample">
          <span>
            {lead}
            {rest.length > 0 && <span className="pv__sample-more"> {rest.join(' ')}</span>}
          </span>
        </span>
      </div>
      {children}
    </div>
  )
}

function Row({ i, className, children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <div className={['pv-row', className].filter(Boolean).join(' ')} style={stagger(i)} data-scroll="rise">
      {children}
    </div>
  )
}

function IconChip({ icon: Icon, tone }: { icon: LucideIcon; tone?: 'red' | 'ink' | 'positive' | 'cold' }) {
  return (
    <span className={['pv-icon', tone && `pv-icon--${tone}`].filter(Boolean).join(' ')}>
      <Icon size={15} strokeWidth={1.6} />
    </span>
  )
}

/* ── Intake: new leads arriving from connected sources ─────────────────── */

function IntakePreview() {
  const leads = [
    { name: 'Priya Raman', source: 'Website form', note: 'Asked about availability next week', time: 'Just now', fresh: true },
    { name: 'Marcus Hale', source: 'Landing page', note: 'Requested a quote', time: '4 min ago' },
    { name: 'Elena Ortiz', source: 'Phone inquiry', note: 'Left a callback request', time: '22 min ago' },
    { name: 'Sam Whitaker', source: 'Referral', note: 'Introduced by an existing client', time: '1 hr ago' },
  ]
  return (
    <Frame title="New leads" className="pv--intake">
      <div className="pv-toolbar">
        <span className="ui-label">Today</span>
        <span className="ui-badge ui-badge--red">4 new</span>
      </div>
      <div className="pv-list">
        {leads.map((lead, i) => (
          <Row key={lead.name} i={i} className={lead.fresh ? 'pv-row--fresh' : undefined}>
            <span className={['ui-avatar', lead.fresh && 'ui-avatar--red'].filter(Boolean).join(' ')}>
              {lead.name.split(' ').map((part) => part[0]).join('')}
            </span>
            <span className="pv-row__main">
              <span className="pv-row__title">{lead.name}</span>
              <span className="pv-row__meta">{lead.note}</span>
            </span>
            <span className="pv-row__side">
              <span className="ui-badge ui-badge--plain">{lead.source}</span>
              <span className="pv-row__time">{lead.time}</span>
            </span>
          </Row>
        ))}
      </div>
    </Frame>
  )
}

/* ── Sequence: scheduled follow-ups, a reply, and what happens next ────── */

function SequencePreview() {
  const sent = [
    { when: 'Instantly', title: 'Welcome message', state: 'Sent · 9:13 AM' },
    { when: 'Day 1 · 9:00 AM', title: 'Follow-up #1', state: 'Sent' },
  ]
  return (
    <Frame title="Automation · New lead follow-up" short="New lead follow-up" className="pv--sequence">
      <div className="pv-toolbar">
        <span className="ui-badge ui-badge--positive">Active</span>
        <span className="pv-toolbar__meta">3 steps · stops when the lead replies</span>
      </div>
      <ol className="pv-steps">
        {sent.map((step, i) => (
          <li key={step.title} className="pv-step" style={stagger(i)} data-scroll="rise">
            <IconChip icon={Send} tone="ink" />
            <span className="pv-step__main">
              <span className="pv-step__when">{step.when}</span>
              <span className="pv-step__title">{step.title}</span>
            </span>
            <span className="ui-badge ui-badge--plain">{step.state}</span>
          </li>
        ))}
        <li className="pv-step pv-step--reply" style={stagger(2)} data-scroll="rise">
          <IconChip icon={MessageSquareReply} tone="red" />
          <span className="pv-step__main">
            <span className="pv-step__when">Day 2 · 4:41 PM</span>
            <span className="pv-step__title">Reply detected — sequence stopped</span>
          </span>
          <span className="ui-badge ui-badge--red">Reply</span>
        </li>
        <li className="pv-step" style={stagger(3)} data-scroll="rise">
          <IconChip icon={Clock} tone="cold" />
          <span className="pv-step__main">
            <span className="pv-step__when">Day 3 · 10:00 AM</span>
            <span className="pv-step__title">Follow-up #2</span>
          </span>
          <span className="ui-badge ui-badge--cold">Not needed</span>
        </li>
        <li className="pv-step" style={stagger(4)} data-scroll="rise">
          <IconChip icon={ArrowRight} tone="ink" />
          <span className="pv-step__main">
            <span className="pv-step__when">Next action</span>
            <span className="pv-step__title">Offer appointment times</span>
          </span>
        </li>
        <li className="pv-step pv-step--won" style={stagger(5)} data-scroll="rise">
          <IconChip icon={CalendarCheck} tone="positive" />
          <span className="pv-step__main">
            <span className="pv-step__when">Booked</span>
            <span className="pv-step__title">Appointment · Thursday, 2:30 PM</span>
          </span>
          <span className="ui-badge ui-badge--positive">Booked</span>
        </li>
      </ol>
      <div className="pv-message" data-scroll="rise" style={stagger(2)}>
        <span className="pv-message__label">Sent message · Follow-up #1</span>
        <p className="pv-message__text">“Hi Jordan — just checking in. Would a quick call this week help you decide?”</p>
      </div>
    </Frame>
  )
}

/* ── Re-engage: a cold lead gets another chance ────────────────────────── */

export function ReengagePreview({
  name = 'Maya Chen',
  lastContact = '92 days ago',
  steps = ['CloseAgain re‑engages', 'Reply received', 'Opportunity reopened', 'Appointment booked'],
}: {
  name?: string
  lastContact?: string
  steps?: readonly string[]
}) {
  const icons: LucideIcon[] = [RotateCcw, MessageSquareReply, Zap, CalendarCheck]
  return (
    <Frame title="Lead · Maya Chen" meta="Sample workflow" className="pv--reengage">
      <div className="pv-lead">
        <span className="ui-avatar ui-avatar--red pv-lead__avatar">MC</span>
        <span className="pv-lead__main">
          <span className="pv-lead__name">{name}</span>
          <span className="pv-lead__meta">Quote request · Last contact {lastContact}</span>
        </span>
        <span className="pv-status" data-scroll="status">
          <span className="ui-badge ui-badge--cold pv-status__cold">Cold</span>
          <span className="ui-badge ui-badge--red pv-status__open">Reopened</span>
        </span>
      </div>
      <ol className="pv-track">
        {steps.map((step, i) => (
          <li key={step} className="pv-track__step" style={stagger(i)} data-scroll="rise">
            <IconChip icon={icons[i] ?? Check} tone={i === steps.length - 1 ? 'positive' : i === 0 ? 'ink' : 'red'} />
            <span className="pv-track__label">{step}</span>
          </li>
        ))}
      </ol>
      <div className="pv-bubbles" data-scroll="rise" style={stagger(2)}>
        <p className="pv-bubble pv-bubble--out">“Hi Maya — are you still thinking about the project we quoted in June?”</p>
        <p className="pv-bubble pv-bubble--in">“Yes, still interested. Can we talk next week?”</p>
      </div>
    </Frame>
  )
}

/* ── Thread: one conversation across channels ──────────────────────────── */

function ThreadPreview() {
  const messages = [
    { from: 'lead', channel: 'Email', text: 'Hi — do you have availability for a consultation?', time: 'Mon 8:02 AM' },
    { from: 'us', channel: 'Email', text: 'We do. Would Wednesday or Thursday afternoon suit you?', time: 'Mon 8:03 AM' },
    { from: 'lead', channel: 'Text', text: 'Thursday works. Around 3?', time: 'Mon 12:40 PM' },
    { from: 'us', channel: 'Text', text: 'Perfect — you’re booked for Thursday at 3:00 PM.', time: 'Mon 12:41 PM' },
  ]
  return (
    <Frame title="Conversation · Priya Raman" className="pv--thread">
      <div className="pv-thread">
        {messages.map((message, i) => (
          <div
            key={message.time}
            className={['pv-msg', `pv-msg--${message.from}`].join(' ')}
            style={stagger(i)}
            data-scroll="rise"
          >
            <span className="pv-msg__meta">
              {message.channel === 'Email' ? <Mail size={12} strokeWidth={1.8} /> : <Phone size={12} strokeWidth={1.8} />}
              {message.channel} · {message.time}
            </span>
            <p className="pv-msg__text">{message.text}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ── Inbox: organized by stage and next action ─────────────────────────── */

function InboxPreview({ focus = false }: { focus?: boolean }) {
  const stages = ['All', 'New', 'Active', 'Qualified', 'Appointment', 'Re-engage']
  const threads = [
    { name: 'Jordan Ellis', preview: 'Yes, Thursday afternoon works.', stage: 'Qualified', time: '9:18 AM', unread: true },
    { name: 'Maya Chen', preview: 'Still interested. Can we talk next week?', stage: 'Re-engage', time: '8:51 AM', unread: true },
    { name: 'Marcus Hale', preview: 'Could you send the quote again?', stage: 'Active', time: 'Yesterday' },
    { name: 'Nora Blake', preview: 'Booked — see you on the 3rd.', stage: 'Appointment', time: 'Yesterday' },
  ]
  return (
    <Frame title={focus ? 'Inbox · Reply detected' : 'Inbox'} className="pv--inbox">
      <div className="pv-tabs">
        {stages.map((stage, i) => (
          <span key={stage} className={['pv-tab', i === 0 && 'is-active'].filter(Boolean).join(' ')}>
            {stage}
          </span>
        ))}
      </div>
      <div className="pv-list">
        {threads.map((thread, i) => (
          <Row key={thread.name} i={i} className={thread.unread ? 'pv-row--unread' : undefined}>
            <span className="ui-avatar ui-avatar--sm">
              {thread.name.split(' ').map((part) => part[0]).join('')}
            </span>
            <span className="pv-row__main">
              <span className="pv-row__title">
                {thread.name}
                {thread.unread && <span className="ui-dot pv-row__dot" />}
              </span>
              <span className="pv-row__meta">{thread.preview}</span>
            </span>
            <span className="pv-row__side">
              <span
                className={[
                  'ui-badge',
                  thread.stage === 'Re-engage' ? 'ui-badge--red' : thread.stage === 'Appointment' ? 'ui-badge--positive' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {thread.stage}
              </span>
              <span className="pv-row__time">{thread.time}</span>
            </span>
          </Row>
        ))}
      </div>
    </Frame>
  )
}

/* ── Booking: from reply to appointment ────────────────────────────────── */

/** A calendar entry: the time above the name, so narrow day columns never
    strand a lone separator on its own line. */
function Slot({
  time,
  who,
  className,
  ...rest
}: { time: string; who: string; className?: string } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={['pv-slot', className].filter(Boolean).join(' ')} {...rest}>
      <span className="pv-slot__time">{time}</span> <span className="pv-slot__who">{who}</span>
    </span>
  )
}

function BookingPreview() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const dates = [21, 22, 23, 24, 25]
  return (
    <Frame title="Appointments · This week" className="pv--booking">
      <div className="pv-week">
        {days.map((day, i) => (
          <div key={day} className={['pv-day', i === 3 && 'is-today'].filter(Boolean).join(' ')}>
            <span className="pv-day__name">{day}</span>
            <span className="pv-day__date">{dates[i]}</span>
            {i === 1 && <Slot time="10:00" who="Nora B." />}
            {i === 3 && <Slot time="2:30" who="Jordan E." className="pv-slot--new" data-scroll="rise" style={stagger(1)} />}
            {i === 4 && <Slot time="11:00" who="No-show" className="pv-slot--missed" />}
          </div>
        ))}
      </div>
      <div className="pv-list">
        <Row i={2}>
          <IconChip icon={CalendarCheck} tone="positive" />
          <span className="pv-row__main">
            <span className="pv-row__title">Jordan Ellis booked</span>
            <span className="pv-row__meta">Thursday, 2:30 PM · confirmation sent</span>
          </span>
        </Row>
        <Row i={3}>
          <IconChip icon={Clock} tone="ink" />
          <span className="pv-row__main">
            <span className="pv-row__title">Reminder scheduled</span>
            <span className="pv-row__meta">Wednesday, 2:30 PM · 24 hours before</span>
          </span>
        </Row>
        <Row i={4}>
          <IconChip icon={RotateCcw} tone="red" />
          <span className="pv-row__main">
            <span className="pv-row__title">No-show follow-up</span>
            <span className="pv-row__meta">Friday’s missed visit · reschedule offer queued</span>
          </span>
        </Row>
      </div>
    </Frame>
  )
}

/* ── Builder: the follow-up, built once ────────────────────────────────── */

function BuilderPreview() {
  const nodes = [
    { kind: 'Trigger', title: 'New lead arrives', detail: 'From any connected source', icon: Zap, tone: 'red' as const },
    { kind: 'Message', title: 'Send welcome message', detail: 'Immediately', icon: Send, tone: 'ink' as const },
    { kind: 'Wait', title: 'Wait 1 day', detail: 'Unless the lead replies', icon: Clock, tone: 'cold' as const },
    { kind: 'Condition', title: 'Replied?', detail: 'Yes → move to inbox · No → follow up', icon: MessageCircle, tone: 'ink' as const },
    { kind: 'Action', title: 'Offer appointment times', detail: 'When the lead is qualified', icon: CalendarDays, tone: 'positive' as const },
  ]
  return (
    <Frame title="Automation builder · New lead follow-up" short="Automation builder" className="pv--builder">
      <ol className="pv-nodes">
        {nodes.map((node, i) => (
          <li key={node.title} className="pv-node" style={stagger(i)} data-scroll="rise">
            <IconChip icon={node.icon} tone={node.tone} />
            <span className="pv-node__main">
              <span className="pv-node__kind">{node.kind}</span>
              <span className="pv-node__title">{node.title}</span>
              <span className="pv-node__detail">{node.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  )
}

/* ── Analytics: restrained, readable, sample numbers ───────────────────── */

function AnalyticsPreview() {
  // Thirty sample days: new leads (ink) and recovered leads (vermilion).
  const fresh = [22, 26, 24, 29, 31, 28, 33, 30, 35, 34, 37, 33, 38, 41, 39, 42, 40, 44, 43, 47, 45, 48, 46, 50, 49, 52, 51, 55, 53, 57]
  const recovered = [4, 5, 5, 6, 6, 7, 6, 8, 8, 9, 9, 8, 10, 11, 10, 12, 12, 13, 12, 14, 14, 15, 15, 16, 15, 17, 17, 18, 18, 19]
  const w = 520
  const h = 150
  const max = 60
  const toPath = (values: number[]) =>
    values
      .map((value, i) => `${i === 0 ? 'M' : 'L'} ${((i / (values.length - 1)) * w).toFixed(1)} ${(h - (value / max) * h).toFixed(1)}`)
      .join(' ')
  const metrics = [
    { label: 'New leads', value: 1184, suffix: '' },
    { label: 'Recovered', value: 336, suffix: '' },
    { label: 'Response rate', value: 41, suffix: '%' },
    { label: 'Appointments', value: 212, suffix: '' },
  ]
  return (
    <Frame title="Analytics · Last 30 days" className="pv--analytics">
      <div className="pv-metrics">
        {metrics.map((metric, i) => (
          <div key={metric.label} className="pv-metric" style={stagger(i)} data-scroll="rise">
            <span className="ui-label">{metric.label}</span>
            <span className="ui-metric">
              {metric.value.toLocaleString('en-US')}
              {metric.suffix}
            </span>
          </div>
        ))}
      </div>
      <div className="pv-chart">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="pv-chart__svg">
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} className="pv-chart__grid" />
          ))}
          <path d={`${toPath(fresh)} L ${w} ${h} L 0 ${h} Z`} className="pv-chart__area" />
          <path d={toPath(fresh)} className="pv-chart__line" pathLength={1} data-scroll="draw" />
          <path d={toPath(recovered)} className="pv-chart__line pv-chart__line--red" pathLength={1} data-scroll="draw" />
        </svg>
        <div className="pv-legend">
          <span>
            <span className="pv-legend__key" /> New leads
          </span>
          <span>
            <span className="pv-legend__key pv-legend__key--red" /> Recovered leads
          </span>
        </div>
      </div>
    </Frame>
  )
}

/* ── Integrations: generic categories, never borrowed brand names ──────── */

function IntegrationsPreview() {
  const items = [
    { name: 'Website forms', state: 'Connected', icon: Globe },
    { name: 'CRM', state: 'Connected', icon: UserRound },
    { name: 'Calendar', state: 'Connected', icon: CalendarDays },
    { name: 'Email inbox', state: 'Connected', icon: Mail },
    { name: 'Phone & text', state: 'Available', icon: Phone },
    { name: 'Webhooks', state: 'Available', icon: Webhook },
    { name: 'Spreadsheet import', state: 'Available', icon: FileSpreadsheet },
    { name: 'Lead sources', state: 'Connected', icon: PlugZap },
  ]
  return (
    <Frame title="Integrations" className="pv--integrations">
      <div className="pv-tiles">
        {items.map((item, i) => (
          <div
            key={item.name}
            className={['pv-tile', item.state === 'Connected' && 'is-connected'].filter(Boolean).join(' ')}
            style={stagger(i)}
            data-scroll="rise"
          >
            <IconChip icon={item.icon} tone={item.state === 'Connected' ? 'ink' : 'cold'} />
            <span className="pv-tile__name">{item.name}</span>
            <span className={['ui-badge', item.state === 'Connected' ? 'ui-badge--positive' : 'ui-badge--cold'].join(' ')}>
              {item.state}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ── Handoff: the team steps in with context ───────────────────────────── */

function HandoffPreview() {
  return (
    <Frame title="Conversation · Marcus Hale" className="pv--handoff">
      <div className="pv-thread">
        <div className="pv-msg pv-msg--lead" style={stagger(0)} data-scroll="rise">
          <span className="pv-msg__meta">Lead · 10:02 AM</span>
          <p className="pv-msg__text">Before I book — can someone walk me through the options?</p>
        </div>
        <div className="pv-note" style={stagger(1)} data-scroll="rise">
          <UserRound size={14} strokeWidth={1.8} />
          <span>
            <strong>Alex</strong> took over this conversation · automation paused
          </span>
        </div>
        <div className="pv-msg pv-msg--team" style={stagger(2)} data-scroll="rise">
          <span className="pv-msg__meta">Alex · 10:06 AM</span>
          <p className="pv-msg__text">Happy to. I’ve read your earlier notes — here’s what I’d suggest.</p>
        </div>
      </div>
    </Frame>
  )
}

export function ProductPreview({ kind }: { kind: Exclude<PreviewKind, 'reengage'> }) {
  switch (kind) {
    case 'intake':
      return <IntakePreview />
    case 'sequence':
      return <SequencePreview />
    case 'thread':
      return <ThreadPreview />
    case 'inbox':
      return <InboxPreview />
    case 'reply':
      return <InboxPreview focus />
    case 'booking':
      return <BookingPreview />
    case 'builder':
      return <BuilderPreview />
    case 'analytics':
      return <AnalyticsPreview />
    case 'integrations':
      return <IntegrationsPreview />
    case 'handoff':
      return <HandoffPreview />
  }
}
