import { CalendarCheck, Check, Inbox, LayoutGrid, MessageSquareReply, Send, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { RibbonBand } from '@/components/art/Ribbon'
import { home } from '@/content/home'

const icons: LucideIcon[] = [Inbox, Send, MessageSquareReply, CalendarCheck, LayoutGrid]

/**
 * From lead to customer: one fictional lead's morning, event by event, in the
 * product's own interface.
 *
 * As the card scrolls through the viewport the events complete in order, the
 * ribbon runs down the timeline and the status at the top follows along
 * (MotionController drives it from scroll progress). Without that
 * enhancement — no JavaScript, reduced motion — every event is simply shown
 * complete, with the final status.
 */
export function LeadFlow() {
  const { eyebrow, title, body, note, lead, events, handoff } = home.flow
  const final = events[events.length - 1]

  return (
    <section className="flow" aria-labelledby="flow-title">
      <div className="flow__inner wrap">
        <div className="flow__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="flow-title" className="flow__title" data-reveal>
            {title}
          </h2>
          <p className="flow__body">{body}</p>
          <p className="flow__note">
            <span className="ui-sample">Sample workflow</span>
            <span>{note}</span>
          </p>
        </div>

        <div className="ui ui-frame flow__card" data-flow-steps={events.map((event) => event.status).join('|')}>
          <div className="ui-frame__bar">
            <span className="ui-frame__dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="flow__bar-title">Activity</span>
          </div>

          <div className="flow__lead">
            <span className="ui-avatar ui-avatar--red" aria-hidden="true">
              {lead.initials}
            </span>
            <span className="flow__lead-text">
              <span className="flow__lead-name">{lead.name}</span>
              <span className="flow__lead-context">{lead.context}</span>
            </span>
            <span className="flow__status" aria-hidden="true" data-flow-status>
              {final.status}
            </span>
          </div>

          <div className="flow__timeline">
            <RibbonBand className="flow__rail" draw="static" />
            <ol className="flow__events">
              {events.map((event, i) => {
                const Icon = icons[i] ?? Check
                return (
                  <li
                    key={event.time}
                    className={['flow__event', `flow__event--${event.tone}`].join(' ')}
                    data-flow-step
                    style={{ '--i': i } as CSSProperties}
                  >
                    <time className="flow__time">{event.time}</time>
                    <span className="flow__node" aria-hidden="true">
                      <Icon size={15} strokeWidth={1.7} />
                    </span>
                    <span className="flow__event-body">
                      <span className="flow__event-title">{event.title}</span>
                      <span className="flow__event-detail">{event.detail}</span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          <p className="flow__handoff">{handoff}</p>
        </div>
      </div>
    </section>
  )
}
