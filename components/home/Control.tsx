import { Check, MessageCircle, SlidersHorizontal, UsersRound, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { TextLink } from '@/components/ui/links'
import { howItWorks } from '@/content/pages'

const icons: LucideIcon[] = [MessageCircle, SlidersHorizontal, UsersRound]

/** What stays in the customer's hands: their words, their timing, their relationships. */
export function Control() {
  const { eyebrow, title, lede, items, foot, link } = howItWorks.control
  return (
    <section className="control section" aria-labelledby="control-title">
      <div className="wrap">
        <div className="control__head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="control-title" className="section__title">
              {title.map((line) => (
                <span key={line} className="control__line">
                  {line}{' '}
                </span>
              ))}
            </h2>
          </div>
          <p className="control__lede">{lede}</p>
        </div>
        <div className="control__grid">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <article
                key={item.title}
                className="control__item"
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
              >
                <div className="control__top">
                  <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                  <span aria-hidden="true">0{i + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            )
          })}
        </div>
        <div className="control__foot">
          <p>
            <Check size={16} aria-hidden="true" /> {foot}
          </p>
          <TextLink href={link.href} arrow>
            {link.label}
          </TextLink>
        </div>
      </div>
    </section>
  )
}
