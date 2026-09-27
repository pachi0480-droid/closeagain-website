import { Ribbon } from '@/components/art/Ribbon'
import { secondChanceLoop, weaveWide } from '@/components/art/ribbons'
import { ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { home } from '@/content/home'

/**
 * Follow up without living in your inbox: the live sequence — what went out,
 * what is scheduled, the reply that stopped it, and the next step. The ribbon
 * comes in from the edge, passes behind the preview and carries on down the
 * page, drawn as the visitor scrolls past.
 */
export function Automation() {
  const { eyebrow, title, body } = home.automation
  return (
    <section className="followup" aria-labelledby="followup-title">
      <Ribbon
        id="followup-weave"
        className="followup__ribbon"
        viewBox={weaveWide.viewBox}
        spec={weaveWide.spec}
        preserveAspectRatio="xMidYMid slice"
        draw="scrub"
      />
      <div className="followup__inner wrap">
        <div className="followup__ui" data-reveal>
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
 * re-engaged, answered, reopened and booked. The ribbon goes out behind the
 * card and loops back over it — the shape of “again”.
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
        <div className="second__ui">
          <Ribbon
            id="second-loop"
            className="second__ribbon"
            viewBox={secondChanceLoop.viewBox}
            spec={secondChanceLoop.spec}
            draw="scrub"
          />
          <ReengagePreview />
        </div>
      </div>
    </section>
  )
}
