import { Inbox, RotateCcw, UsersRound, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { home } from '@/content/home'
import { PaysForItself } from './PaysForItself'

const icons: LucideIcon[] = [Inbox, RotateCcw, UsersRound]

/**
 * Why it pays, right under the hero: where CloseAgain makes a business money
 * (the leads it already paid for, the old leads it already had, a team that
 * talks only to buyers), then a check with the visitor's own number. No
 * results or rates are claimed — the arithmetic is theirs.
 */
export function Payoff() {
  const { eyebrow, title, points } = home.payoff
  return (
    <section className="payoff" aria-labelledby="payoff-title">
      <div className="payoff__inner wrap">
        <div className="payoff__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="payoff-title" className="payoff__title" data-reveal>
            {title}
          </h2>
          <ul className="payoff__points">
            {points.map((point, i) => {
              const Icon = icons[i] ?? Inbox
              return (
                <li key={point.title} className="payoff__point" data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}>
                  <span className="payoff__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="payoff__point-title">{point.title}</h3>
                    <p className="payoff__point-body">{point.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <PaysForItself />
      </div>
    </section>
  )
}
