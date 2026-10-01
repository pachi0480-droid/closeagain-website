import {
  Activity,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  PlugZap,
  RotateCcw,
  Send,
  type LucideIcon,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { home } from '@/content/home'

const youIcons: LucideIcon[] = [ClipboardList, BadgeCheck, CalendarCheck]
const usIcons: LucideIcon[] = [PlugZap, Send, RotateCcw, Activity]

const delay = (i: number) => ({ '--reveal-delay': `${120 + i * 70}ms` }) as CSSProperties

/**
 * The whole deal, right under the hero: what you do (three small things) and
 * what we do (everything else). CloseAgain is done for you, and this is
 * where a visitor sees it before reading anything else.
 */
export function Split() {
  const { eyebrow, title, you, us, note } = home.split

  return (
    <section className="split" aria-labelledby="split-title">
      <div className="split__inner wrap">
        <div className="split__head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="split-title" className="split__title" data-reveal>
            {title}
          </h2>
        </div>

        <div className="split__cards">
          {[
            { side: you, icons: youIcons, key: 'you' },
            { side: us, icons: usIcons, key: 'us' },
          ].map(({ side, icons, key }, c) => (
            <section key={key} className={`split__card split__card--${key}`} aria-labelledby={`split-${key}`} data-reveal style={delay(c)}>
              <header className="split__card-head">
                <p className="split__word" aria-hidden="true">
                  {side.word}
                </p>
                <h3 id={`split-${key}`} className="split__label">
                  {side.label}
                </h3>
              </header>
              <ul className="split__items">
                {side.items.map((item, i) => {
                  const Icon = icons[i] ?? BadgeCheck
                  return (
                    <li key={item.title} className="split__item" data-reveal style={delay(c * 2 + i + 1)}>
                      <span className="split__icon" aria-hidden="true">
                        <Icon size={17} strokeWidth={1.7} />
                      </span>
                      <span>
                        <span className="split__item-title">{item.title}</span>
                        <span className="split__item-body">{item.body}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className="split__note">{note}</p>
      </div>
    </section>
  )
}
