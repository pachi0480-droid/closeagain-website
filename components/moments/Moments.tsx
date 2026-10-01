import {
  Check,
  Inbox,
  ListChecks,
  MessageSquareReply,
  MessagesSquare,
  RotateCcw,
  SlidersHorizontal,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { Bubble } from '@/components/art/Bubble'
import { industries, industryPage, type Industry } from '@/content/industries'
import { about, afterYouBuy, faq, features, howItWorks, pricingPage, whoItsFor } from '@/content/pages'
import { plans, priceLabel } from '@/content/pricing'

/**
 * Product moments: a small piece of CloseAgain beside each page's title,
 * playing out one beat at a time as it arrives (motion.css, “moments”) — the
 * way the homepage hero shows its four steps. Every word comes from the
 * content files; the people in them are fictional.
 *
 * They illustrate what the page says in words, so they are hidden from
 * assistive technology (the page's own text carries the meaning) — except
 * the pricing meter, whose bars are real links to each plan.
 *
 * At rest (no script, reduced motion) each moment is simply shown finished.
 */

const beat = (i: number) => ({ '--beat': i }) as CSSProperties

function Moment({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={['moment', className].filter(Boolean).join(' ')} data-moment aria-hidden="true">
      <div className="moment__float">
        <div className="moment__card">{children}</div>
      </div>
    </div>
  )
}

function Head({
  icon: Icon,
  title,
  detail,
  tag,
  status,
}: {
  icon: LucideIcon
  title: string
  detail?: string
  tag?: string
  status?: ReactNode
}) {
  return (
    <div className="moment__head">
      <span className="moment__icon">
        <Icon size={16} strokeWidth={1.7} />
      </span>
      <span className="moment__heading">
        <span className="moment__title">{title}</span>
        {detail && <span className="moment__detail">{detail}</span>}
      </span>
      {tag && <span className="moment__tag">{tag}</span>}
      {status}
    </div>
  )
}

/** A status that changes once the story reaches beat `at`: New → Booked, Cold → Reopened. */
function Flip({ from, to, at, tone = 'red' }: { from: string; to: string; at: number; tone?: 'red' | 'positive' }) {
  return (
    <span className="flip" style={beat(at)}>
      <span className="flip__a moment-pill">{from}</span>
      <span className={`flip__b moment-pill moment-pill--${tone}`}>{to}</span>
    </span>
  )
}

function Tick() {
  return (
    <span className="tick">
      <Check size={12} strokeWidth={2.6} />
    </span>
  )
}

/* ── How it works: one lead, six steps ─────────────────────────────────── */

export function JourneyMoment() {
  const { title, detail, status, rows } = howItWorks.moment
  return (
    <Moment className="moment--journey">
      <Head icon={UserRound} title={title} detail={detail} status={<Flip from={status.from} to={status.to} at={3.4} />} />
      <ol className="moment__rows">
        {rows.map((row, i) => (
          <li key={row.label} className="moment-row beat" style={beat(i)}>
            <Tick />
            <span className="moment-row__text">
              <span className="moment-row__label">{row.label}</span>
              <span className="moment-row__meta">{row.meta}</span>
            </span>
            <span className={`moment-who moment-who--${row.who === 'You' ? 'team' : 'auto'}`}>{row.who}</span>
          </li>
        ))}
      </ol>
    </Moment>
  )
}

/* ── Features: switching them on ───────────────────────────────────────── */

export function FeaturesMoment() {
  const { title, tag, running, shown } = features.moment
  const names = features.items.slice(0, shown).map((item) => item.name)
  return (
    <Moment className="moment--features">
      <Head icon={SlidersHorizontal} title={title} tag={tag} />
      <ul className="moment__rows">
        {names.map((name, i) => (
          <li key={name} className="moment-row beat" style={beat(i)}>
            <span className="moment-row__label">{name}</span>
            <span className="switch" style={beat(i)}>
              <i />
            </span>
          </li>
        ))}
      </ul>
      <p className="moment__foot beat" style={beat(names.length)}>
        <span className="live-dot" />
        {running}
      </p>
    </Moment>
  )
}

/* ── Who it's for: replies from different industries ───────────────────── */

/** The first sample reply on an industry's page. */
const firstReply = (industry: Industry) => industry.examples.find((example) => example.reply)?.reply

export function RepliesMoment() {
  const { title, time, shown } = whoItsFor.moment
  const rows = industries.filter((industry) => industry.id !== 'other' && firstReply(industry)).slice(0, shown)
  return (
    <Moment className="moment--replies">
      <Head
        icon={MessageSquareReply}
        title={title}
        status={
          <span className="moment-count beat" style={beat(rows.length)}>
            {rows.length}
          </span>
        }
      />
      <ul className="moment__rows">
        {rows.map((industry, i) => (
          <li key={industry.id} className="moment-row moment-row--reply beat" style={beat(i)}>
            <span className="moment-row__text">
              <span className="moment-row__kicker">{industry.name}</span>
              <span className="moment-row__quote">“{firstReply(industry)}”</span>
            </span>
            <span className="moment-row__time">{time}</span>
          </li>
        ))}
      </ul>
    </Moment>
  )
}

/* ── An industry page: its inbox ───────────────────────────────────────── */

/** “Hi Dana — …” → “Dana”. */
const firstName = (message: string) => message.match(/^Hi ([A-Z][a-z]+)/)?.[1] ?? 'Lead'

export function IndustryInboxMoment({ industry }: { industry: Industry }) {
  const { title, tag, replied, following, note } = industryPage.moment
  return (
    <Moment className="moment--inbox">
      <Head icon={Inbox} title={`${title} · ${industry.name}`} tag={tag} />
      <ul className="moment__rows">
        {industry.examples.map((example, i) => {
          const name = firstName(example.message)
          return (
            <li key={example.moment} className="moment-row beat" style={beat(i)}>
              <span className="moment-avatar">{name.charAt(0)}</span>
              <span className="moment-row__text">
                <span className="moment-row__label">{name}</span>
                <span className="moment-row__meta">{example.reply ? `“${example.reply}”` : example.moment}</span>
              </span>
              {example.reply ? <Flip from={following} to={replied} at={i + 0.9} /> : <span className="moment-pill">{following}</span>}
            </li>
          )
        })}
      </ul>
      <p className="moment__foot beat" style={beat(industry.examples.length + 0.6)}>
        <Check size={14} strokeWidth={2} />
        {note}
      </p>
    </Moment>
  )
}

/* ── Pricing: the meter meter, each bar a link ──────────────────────────── */

export function TiersMoment() {
  const { label, title, recommended } = pricingPage.moment
  return (
    <nav className="moment moment--meters" data-moment aria-label={label}>
      <div className="moment__float">
        <div className="moment__card">
          <p className="moment__meters-title">{title}</p>
          <ol className="meters">
            {plans.map((plan, i) => (
              <li key={plan.id} className={['meter', plan.recommendation && 'meter--featured'].filter(Boolean).join(' ')}>
                <a href={`#plan-${plan.id}`} className="meter__link">
                  <span className="meter__track" style={{ '--level': (i + 1) / plans.length } as CSSProperties}>
                    {plan.recommendation && (
                      <span className="meter__flag beat" style={beat(4)}>
                        {recommended}
                      </span>
                    )}
                    <span className="meter__bar" style={beat(i)} />
                  </span>
                  <span className="meter__name">{plan.name}</span>
                  <span className="meter__price">
                    {priceLabel(plan)}
                    {plan.monthly !== null && <span className="meter__per">/mo</span>}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  )
}

/* ── FAQ: two real questions, answered ─────────────────────────────────── */

/** The first `count` sentences of an answer. */
const opening = (text: string, count: number) =>
  text
    .split(/(?<=\.)\s+/)
    .slice(0, count)
    .join(' ')

export function FaqMoment() {
  const { title, ids, sentences } = faq.moment
  const items = ids.map((id) => faq.items.find((item) => item.id === id)).filter((item) => item !== undefined)
  return (
    <Moment className="moment--chat">
      <Head icon={MessagesSquare} title={title} />
      <div className="moment__chat">
        {items.map((item, i) => (
          <div key={item.id} className="moment__exchange">
            <Bubble tone="reply" className="moment__bubble moment__bubble--q beat" style={beat(i * 2)}>
              {item.q}
            </Bubble>
            <Bubble tone="ask" typing className="moment__bubble moment__bubble--a beat" style={beat(i * 2 + 1)}>
              {opening(item.a, sentences)}
            </Bubble>
          </div>
        ))}
      </div>
    </Moment>
  )
}

/* ── About: a quiet conversation, coming back ──────────────────────────── */

export function ComebackMoment() {
  const { title, detail, status, message, meta, reply } = about.moment
  return (
    <Moment className="moment--chat">
      <Head icon={RotateCcw} title={title} detail={detail} status={<Flip from={status.from} to={status.to} at={2.75} />} />
      <div className="moment__chat">
        <Bubble tone="ask" className="moment__bubble beat" style={beat(0)}>
          {message}
        </Bubble>
        <p className="moment__meta beat" style={beat(0.6)}>
          <Check size={13} strokeWidth={2} />
          {meta}
        </p>
        <Bubble tone="reply" typing className="moment__bubble moment__bubble--q beat" style={beat(1.6)}>
          {reply}
        </Bubble>
      </div>
    </Moment>
  )
}

/* ── After you buy: setup, ticking through to live ─────────────────────── */

export function SetupMoment() {
  const { title, status } = afterYouBuy.moment
  const steps = afterYouBuy.steps
  return (
    <Moment className="moment--setup">
      <Head icon={ListChecks} title={title} status={<Flip from={status.from} to={status.to} at={steps.length - 0.4} tone="positive" />} />
      <span className="moment__progress">
        <span style={{ '--steps': steps.length } as CSSProperties} />
      </span>
      <ol className="moment__rows">
        {steps.map((step, i) => (
          <li key={step.number} className="moment-row beat" style={beat(i)}>
            <Tick />
            <span className="moment-row__label">{step.title}</span>
            <span className="moment-row__num">{step.number}</span>
          </li>
        ))}
      </ol>
    </Moment>
  )
}
