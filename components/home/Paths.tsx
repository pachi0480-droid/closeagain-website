import type { CSSProperties } from 'react'
import { Clock, Inbox, MessageCircle, RotateCcw, Send, type LucideIcon } from 'lucide-react'
import { home } from '@/content/home'

const icons: Record<'fresh' | 'old', LucideIcon[]> = {
  fresh: [Inbox, Send, MessageCircle],
  old: [Clock, RotateCcw, MessageCircle],
}

const delay = (i: number) => ({ '--reveal-delay': `${i * 80}ms` }) as CSSProperties

/**
 * New + Old. Each column is one conversation — a new lead, an old lead that
 * went quiet — in three steps. Then both replies land in one inbox, each
 * flying in from its own column, and the outcome follows. The story plays
 * through once it is on screen (MotionController).
 */
export function Paths() {
  const { eyebrow, title, lede, fresh, old, inbox, outcome } = home.paths

  return (
    <section className="paths band-ink" aria-labelledby="paths-title">
      <div className="wrap paths__head">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="paths-title" className="paths__title">
          {title.map((line, i) => (
            <span key={line} className={i === title.length - 1 ? 'paths__title-last' : undefined}>
              {line}{' '}
            </span>
          ))}
        </h2>
        <p className="paths__lede">{lede}</p>
      </div>

      <div className="paths__stage wrap" data-flow>
        <div className="paths__cols">
          {(['fresh', 'old'] as const).map((key) => {
            const column = key === 'fresh' ? fresh : old
            return (
              <div key={key} className={`paths__col paths__col--${key}`}>
                <h3 className="paths__label">
                  <span className="paths__label-name">
                    <span className="paths__label-mark" aria-hidden="true" />
                    {column.label}
                  </span>
                </h3>
                <div className="paths__run">
                  <ol className="paths__steps">
                    {column.steps.map((step, i) => {
                      const Icon = icons[key][i]
                      const last = i === column.steps.length - 1
                      const cold = key === 'old' && i === 0
                      return (
                        <li
                          key={step.title}
                          className={['path-step', last && 'path-step--reply', cold && 'path-step--cold']
                            .filter(Boolean)
                            .join(' ')}
                          data-reveal
                          style={delay(i)}
                        >
                          <span className="path-step__icon" aria-hidden="true">
                            <Icon size={16} strokeWidth={1.6} />
                          </span>
                          <span className="path-step__text">
                            <span className="path-step__title">{step.title}</span>
                            <span className="path-step__meta">{step.meta}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </div>
            )
          })}
        </div>

        {/* Where both columns end up: the two replies, side by side in one
            inbox. On screen, each flies in from its own column (MotionController). */}
        <div className="paths__inbox ui" data-reveal>
          <div className="paths__inbox-head">
            <span className="paths__inbox-icon" aria-hidden="true">
              <Inbox size={16} strokeWidth={1.7} />
            </span>
            <span className="paths__inbox-title">{inbox.title}</span>
            <span className="paths__inbox-count">{inbox.count}</span>
          </div>
          <ul className="paths__inbox-rows">
            {inbox.rows.map((row) => (
              <li key={row.from} className={`paths__inbox-row paths__inbox-row--${row.tone}`}>
                <span className="paths__inbox-from">
                  <span className="paths__label-mark" aria-hidden="true" />
                  {row.from}
                </span>
                <span className="paths__inbox-text">{row.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="paths__outcome" data-reveal>
          {outcome}
        </p>
      </div>
    </section>
  )
}
