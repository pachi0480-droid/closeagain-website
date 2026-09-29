import { Bubble } from '@/components/art/Bubble'
import { Ribbon } from '@/components/art/Ribbon'
import { heroCompact, heroWide } from '@/components/art/ribbons'
import { ButtonLink, TextLink } from '@/components/ui/links'
import { home } from '@/content/home'
import { IntroMark } from './IntroMark'

/**
 * The approved composition. On wide screens every measurement is expressed in
 * units of the headline size (`--hs`), so the ribbon, the two lines of type
 * and the bubbles keep the reference's relationships at any width. Small
 * screens get their own art direction: three lines, left-aligned, and a
 * ribbon that threads between the last two lines and lands beside the reply.
 *
 * Under the headline, the promise says what the business gets (more paying
 * customers) before the explanation says how. The headline, promise,
 * explanation and both calls to action are there on first paint and never
 * wait for motion. Only the decoration moves: on the first
 * visit of a session the ribbon draws through and the two bubbles follow it
 * (motion.css).
 */
export function Hero() {
  const { category, headline, promise, lede, primary, secondary, terms, exchange } = home.hero

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Ribbon
        id="hero-wide"
        className="hero__ribbon hero__ribbon--wide"
        viewBox={heroWide.viewBox}
        spec={heroWide.spec}
        draw="intro"
      />

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
          <Ribbon
            id="hero-compact"
            className="hero__ribbon hero__ribbon--compact"
            viewBox={heroCompact.viewBox}
            preserveAspectRatio="xMaxYMin slice"
            spec={heroCompact.spec}
            draw="intro"
          />
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

        <div className="hero__exchange">
          <Bubble tone="ask" className="hero__bubble hero__bubble--ask">
            {exchange.ask}
          </Bubble>
          <Bubble tone="reply" className="hero__bubble hero__bubble--reply">
            {exchange.reply}
          </Bubble>
        </div>
      </div>

      <IntroMark />
    </section>
  )
}
