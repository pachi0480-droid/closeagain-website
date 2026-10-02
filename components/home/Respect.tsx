import { BellOff, CalendarClock, Check, MessageSquareReply, UserCheck, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Bubble } from '@/components/art/Bubble'
import { home } from '@/content/home'

const icons: LucideIcon[] = [UserCheck, CalendarClock, MessageSquareReply, BellOff]

const delay = (i: number) => ({ '--reveal-delay': `${i * 70}ms` }) as CSSProperties

/**
 * The worry every owner has before buying follow-up: will it spam my
 * customers? Four rules every campaign runs by, beside one real-looking
 * text — from the business, in its words, with the opt-out — that stops the
 * moment the person replies. The text plays like a live chat (motion.css).
 */
export function Respect() {
  const { eyebrow, title, body, rules, sample } = home.respect

  return (
    <section className="respect" aria-labelledby="respect-title">
      <div className="respect__inner wrap">
        <div className="respect__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="respect-title" className="respect__title" data-reveal>
            {title}
          </h2>
          <p className="respect__body">{body}</p>
          <ul className="respect__rules">
            {rules.map((rule, i) => {
              const Icon = icons[i] ?? Check
              return (
                <li key={rule.title} className="respect__rule" data-reveal style={delay(i)}>
                  <span className="respect__icon" aria-hidden="true">
                    <Icon size={17} strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="respect__rule-title">{rule.title}</span>
                    <span className="respect__rule-body">{rule.body}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <figure className="sms" aria-label={`${sample.label}. ${sample.note}`} data-chat>
          <div className="sms__head">
            <span className="sms__avatar" aria-hidden="true">
              {sample.from.charAt(0)}
            </span>
            <span className="sms__who">
              <span className="sms__name">{sample.from}</span>
              <span className="sms__channel">{sample.channel}</span>
            </span>
          </div>
          <div className="sms__thread">
            <p className="sms__time">{sample.time}</p>
            <Bubble tone="ask" className="sms__bubble">
              {sample.message}
            </Bubble>
            <Bubble tone="reply" typing className="sms__bubble sms__bubble--reply">
              {sample.reply}
            </Bubble>
            <p className="sms__stopped sample__stop">
              <Check size={14} strokeWidth={2} aria-hidden="true" />
              {sample.stopped}
            </p>
          </div>
          <figcaption className="sms__note">{sample.note}</figcaption>
        </figure>
      </div>
    </section>
  )
}
