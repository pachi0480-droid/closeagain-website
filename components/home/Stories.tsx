import { Ribbon } from '@/components/art/Ribbon'
import { secondChanceLoop, weaveWide } from '@/components/art/ribbons'
import { ActivityPreview, ProductPreview, ReengagePreview } from '@/components/previews/Previews'
import { home } from '@/content/home'

/** From lead to customer: one lead's morning, event by event. */
export function Story() {
  const { eyebrow, title, body, events } = home.story
  return (
    <section className="story" aria-labelledby="story-title">
      <div className="story__inner wrap">
        <div className="story__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="story-title" className="story__title" data-scroll="rise">
            {title}
          </h2>
          <p className="story__body">{body}</p>
        </div>
        <div className="story__ui">
          <ActivityPreview events={events} />
        </div>
      </div>
    </section>
  )
}

/** Follow up without living in your inbox: the sequence, the reply, the booking. */
export function FollowUp() {
  const { eyebrow, title, body } = home.followUp
  return (
    <section className="followup" aria-labelledby="followup-title">
      <Ribbon
        id="followup-weave"
        className="followup__ribbon"
        viewBox={weaveWide.viewBox}
        spec={weaveWide.spec}
        preserveAspectRatio="xMidYMid slice"
        draw="linked"
      />
      <div className="followup__inner wrap">
        <div className="followup__ui">
          <ProductPreview kind="sequence" />
        </div>
        <div className="followup__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="followup-title" className="followup__title" data-scroll="rise">
            {title}
          </h2>
          <p className="followup__body">{body}</p>
        </div>
      </div>
    </section>
  )
}

/** Some conversations just need another chance: the brand, in one card. */
export function SecondChance() {
  const { eyebrow, title, body, lead, steps } = home.second
  return (
    <section className="second" aria-labelledby="second-title">
      <div className="second__inner wrap">
        <div className="second__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="second-title" className="second__title" data-scroll="rise">
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
            draw="linked"
          />
          <ReengagePreview name={lead.name} lastContact={lead.lastContact} steps={steps} />
        </div>
      </div>
    </section>
  )
}
