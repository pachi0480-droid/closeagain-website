import { CalendarCheck, Clock, Inbox, MessageCircle, RotateCcw, Send, UsersRound, type LucideIcon } from 'lucide-react'
import { RibbonBand } from '@/components/art/Ribbon'
import { home, type ExampleActor, type ExampleStep } from '@/content/home'
import { ExampleStatus } from './ExampleStatus'

const actorLabel: Record<ExampleActor, string> = {
  lead: 'The lead',
  auto: 'Automatic',
  team: 'Your team',
}

/** The lead's status after a step, stated in words on every step. */
function Status({ value }: { value: string }) {
  return (
    <span className="example__status">
      <span className="sr-only">Status: </span>
      {value}
    </span>
  )
}

function iconFor(step: ExampleStep, index: number): LucideIcon {
  if (step.kind === 'gap') return Clock
  if (step.kind === 'event') return step.actor === 'team' ? UsersRound : CalendarCheck
  if (step.actor === 'lead') return index === 0 ? Inbox : MessageCircle
  return step.id === 'again' ? RotateCcw : Send
}

/**
 * From inquiry to booked appointment: one fictional lead, one thread, read
 * top to bottom at the visitor's own pace.
 *
 * Every step is real, readable content in normal flow — nothing is pinned,
 * nothing swaps on a timer, and it reads completely with motion reduced or
 * JavaScript off. As the visitor scrolls, each step arrives once, the ribbon
 * runs down the thread, and the lead's status at the top of the thread
 * follows along (a small client enhancement, hidden from assistive
 * technology because every step also states its status in words).
 */
export function WorkedExample() {
  const { eyebrow, title, lede, note, lead, steps, outcome } = home.example

  return (
    <section className="example" aria-labelledby="example-title">
      <div className="wrap">
        <header className="example__head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="example-title" className="example__title">
            {title}
          </h2>
          <p className="example__lede">{lede}</p>
          <p className="example__disclaimer">
            <span className="ui-sample">Illustrative</span>
            <span>{note}</span>
          </p>
        </header>

        <div className="example__board" id="example-board">
          <div className="example__lead">
            <span className="ui-avatar ui-avatar--red example__avatar" aria-hidden="true">
              {lead.initials}
            </span>
            <span className="example__lead-text">
              <span className="example__lead-name">{lead.name}</span>
              <span className="example__lead-context">{lead.context}</span>
            </span>
            <ExampleStatus boardId="example-board" statuses={steps.map((step) => step.status)} />
          </div>

          <div className="example__thread">
            <RibbonBand className="example__rail" />
            <ol className="example__steps">
              {steps.map((step, i) => {
                const Icon = iconFor(step, i)
                const messages = step.messages ?? []
                return (
                  <li
                    key={step.id}
                    className={['example__step', `example__step--${step.kind}`, `example__step--${step.actor}`].join(
                      ' ',
                    )}
                    data-step={i}
                    data-reveal
                  >
                    <div className="example__note">
                      <p className="example__who">{actorLabel[step.actor]}</p>
                      <h3 className="example__step-title">{step.note.title}</h3>
                      <p className="example__step-body">{step.note.body}</p>
                    </div>

                    <div className="example__event">
                      <span className="example__node" aria-hidden="true">
                        <Icon size={15} strokeWidth={1.7} />
                      </span>
                      {step.kind === 'message' ? (
                        messages.map((message, m) => (
                          <div
                            key={message.when}
                            className={[
                              'example__msg',
                              step.actor === 'lead' ? 'example__msg--in' : 'example__msg--out',
                            ].join(' ')}
                          >
                            <p className="example__meta">
                              <span className="example__tag">{message.tag}</span>
                              <span className="example__when">{message.when}</span>
                              {m === messages.length - 1 && <Status value={step.status} />}
                            </p>
                            <p className="example__text">{message.text}</p>
                          </div>
                        ))
                      ) : step.kind === 'gap' ? (
                        <p className="example__gap">
                          <span className="example__gap-text">{step.text}</span>
                          <Status value={step.status} />
                        </p>
                      ) : (
                        <p
                          className={['example__card', step.actor === 'team' && 'example__card--team']
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <span className="example__card-text">{step.text}</span>
                          {step.when && <span className="example__when">{step.when}</span>}
                          <Status value={step.status} />
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="example__outcome" data-reveal>
          <p className="example__outcome-title">{outcome.title}</p>
          <p className="example__outcome-body">{outcome.body}</p>
        </div>
      </div>
    </section>
  )
}
