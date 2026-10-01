import { ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { home } from '@/content/home'

/**
 * Follow up without living in your inbox: the live sequence — what went out,
 * what is scheduled, the reply that stopped it, and the next step. The view
 * rises into place on a soft warm glow (home.css, motion.css).
 */
export function Automation() {
  const { eyebrow, title, body } = home.automation
  return (
    <section className="followup" aria-labelledby="followup-title">
      <div className="followup__inner wrap">
        <div className="followup__ui" data-lift>
          <ProductPreview kind="sequence" />
        </div>
        <div className="followup__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="followup-title" className="followup__title" data-reveal>
            {title}
          </h2>
          <p className="followup__body">{body}</p>
        </div>
      </div>
    </section>
  )
}

/**
 * Some conversations just need another chance: 92 days quiet, Cold, then
 * re-engaged, answered, reopened and booked — the card's status turns from
 * Cold to Reopened as it arrives.
 */
export function SecondChance() {
  const { eyebrow, title, body } = home.second
  return (
    <section className="second" aria-labelledby="second-title">
      <div className="second__inner wrap">
        <div className="second__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="second-title" className="second__title" data-reveal>
            {title}
          </h2>
          <p className="second__body">{body}</p>
        </div>
        <div className="second__ui" data-lift>
          <ReengagePreview />
        </div>
      </div>
    </section>
  )
}
