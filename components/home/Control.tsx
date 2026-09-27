import { Check, MessageCircle, SlidersHorizontal, UsersRound } from 'lucide-react'
import { TextLink } from '@/components/ui/links'

const controls = [
  { icon: MessageCircle, title: 'Your words.', body: 'Messages use wording you approve, so every follow-up still sounds like your business.' },
  { icon: SlidersHorizontal, title: 'Your timing.', body: 'Choose when to follow up and when to check back. Sequences stop when a lead replies.' },
  { icon: UsersRound, title: 'Your relationships.', body: 'Replies come back to your team. You take care of the conversation, the quote and the sale.' },
]

export function Control() {
  return (
    <section className="control section" aria-labelledby="control-title">
      <div className="wrap">
        <div className="control__head">
          <div>
            <p className="eyebrow">Automatic follow-up. Personal conversations.</p>
            <h2 id="control-title" className="section__title">More follow-through.<br />Still entirely you.</h2>
          </div>
          <p className="control__lede">Put the repetitive part on autopilot. Keep the human part in your hands.</p>
        </div>
        <div className="control__grid">
          {controls.map(({ icon: Icon, title, body }, i) => (
            <article key={title} className="control__item" data-reveal>
              <div className="control__top"><Icon size={23} strokeWidth={1.4} aria-hidden="true" /><span>0{i + 1}</span></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="control__foot">
          <p><Check size={16} aria-hidden="true" /> Setup assistance included on every plan.</p>
          <TextLink href="/features" arrow>Explore the features</TextLink>
        </div>
      </div>
    </section>
  )
}
