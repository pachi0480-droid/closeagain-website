import { CalendarCheck, Check, Clock, Inbox } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Bubble } from '@/components/art/Bubble'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { home } from '@/content/home'
import { IntroMark } from './IntroMark'

/**
 * The approved type composition, with the product beside it. The headline,
 * promise, explanation and both calls to action are there on first paint and
 * never wait for motion.
 *
 * Around the headline, CloseAgain works in four beats: a lead comes in, it
 * replies, it follows up when the lead goes quiet, and the lead says yes. On
 * wide screens the beats float beside the type and play out in order on the
 * first visit of a session (motion.css). Narrower screens show the same four
 * beats as a compact row under the calls to action. Either way, a visitor
 * sees what CloseAgain does before reading a word about it.
 */
export function Hero() {
  const { category, headline, promise, lede, primary, secondary, terms, steps } = home.hero
  const beat = (i: number) => ({ '--beat': i }) as CSSProperties

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__stage wrap">
        <p className="eyebrow hero__category">{category}</p>
        <div className="hero__headline">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__row hero__row--1">
              <span className="hero__line hero__line--lead">{headline.lead}</span>{' '}
              <span className="hero__line hero__line--rest">{headline.rest}</span>
            </span>{' '}
            <span className="hero__row hero__row--2">
              <span className="hero__line hero__line--close">{headline.close}</span>
            </span>
          </h1>
        </div>

        <p className="hero__promise">{promise}</p>

        <p className="hero__lede">
          {lede.map((line) => (
            <span key={line} className="hero__lede-line">
              {line}{' '}
            </span>
          ))}
        </p>

        <div className="hero__actions">
          <ButtonLink href={primary.href} size="lg">
            {primary.label}
          </ButtonLink>
          <TextLink href={secondary.href}>{secondary.label}</TextLink>
        </div>

        <p className="hero__terms">
          {terms.map((term, i) => (
            <span key={term}>
              {i > 0 && (
                <span className="hero__terms-sep" aria-hidden="true">
                  ·
                </span>
              )}
              {term}
            </span>
          ))}
        </p>

        <ol className="hero-steps" aria-label={steps.label}>
          <li className="hero-step hero-step--lead" style={beat(0)}>
            <div className="hero-step__float">
              <p className="hero-step__label">
                <span className="hero-step__n" aria-hidden="true">1</span>
                <span className="hero-step__title">{steps.lead.title}</span>
                <span className="hero-step__detail">{steps.lead.detail}</span>
              </p>
              <div className="hero-step__card hero-lead" aria-hidden="true">
                <span className="hero-lead__icon">
                  <Inbox size={16} strokeWidth={1.7} />
                </span>
                <span className="hero-lead__text">
                  <span className="hero-lead__title">{steps.lead.card}</span>
                  <span className="hero-lead__detail">{steps.lead.detail}</span>
                </span>
                <span className="hero-lead__new" />
              </div>
            </div>
          </li>

          <li className="hero-step hero-step--reply" style={beat(1)}>
            <div className="hero-step__float">
              <p className="hero-step__label">
                <span className="hero-step__n" aria-hidden="true">2</span>
                <span className="hero-step__title">{steps.reply.title}</span>
                <span className="hero-step__detail">{steps.reply.detail}</span>
              </p>
              <div className="hero-step__card" aria-hidden="true">
                <Bubble tone="ask" className="hero-step__bubble">
                  {steps.reply.message}
                </Bubble>
                <p className="hero-step__meta">
                  <Check size={13} strokeWidth={2} />
                  {steps.reply.meta}
                </p>
              </div>
            </div>
          </li>

          <li className="hero-step hero-step--again" style={beat(2)}>
            <div className="hero-step__float">
              <p className="hero-step__label">
                <span className="hero-step__n" aria-hidden="true">3</span>
                <span className="hero-step__title">{steps.again.title}</span>
                <span className="hero-step__detail">{steps.again.detail}</span>
              </p>
              <div className="hero-step__card" aria-hidden="true">
                <p className="hero-quiet">
                  <Clock size={13} strokeWidth={1.8} />
                  {steps.again.quiet}
                </p>
                <Bubble tone="ask" className="hero-step__bubble">
                  {steps.again.message}
                </Bubble>
                <p className="hero-step__meta">
                  <Check size={13} strokeWidth={2} />
                  {steps.again.meta}
                </p>
              </div>
            </div>
          </li>

          <li className="hero-step hero-step--booked" style={beat(3)}>
            <div className="hero-step__float">
              <p className="hero-step__label">
                <span className="hero-step__n" aria-hidden="true">4</span>
                <span className="hero-step__title">{steps.booked.title}</span>
                <span className="hero-step__detail">{steps.booked.detail}</span>
              </p>
              <div className="hero-step__card" aria-hidden="true">
                <Bubble tone="reply" typing className="hero-step__bubble hero-step__bubble--reply">
                  {steps.booked.message}
                </Bubble>
                <p className="hero-booked">
                  <CalendarCheck size={15} strokeWidth={1.8} />
                  {steps.booked.booked}
                </p>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <IntroMark />
    </section>
  )
}
