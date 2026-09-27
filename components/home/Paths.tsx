import type { CSSProperties } from 'react'
import { Clock, Inbox, MessageCircle, RotateCcw, Send, type LucideIcon } from 'lucide-react'
import { Ribbon, RibbonBand } from '@/components/art/Ribbon'
import { mergeCompact, mergeWide } from '@/components/art/ribbons'
import { home } from '@/content/home'

const icons: Record<'fresh' | 'old', LucideIcon[]> = {
  fresh: [Inbox, Send, MessageCircle],
  old: [Clock, RotateCcw, MessageCircle],
}

const delay = (i: number) => ({ '--reveal-delay': `${i * 80}ms` }) as CSSProperties

/**
 * New + Old. Each column is one conversation — a new lead, an old lead that
 * went quiet — with a ribbon running down behind its three steps. The two
 * ribbons then turn in and merge into one that points at the outcome. The
 * whole drawing follows the visitor's scroll (MotionController), so the
 * merge happens as they read toward it.
 */
export function Paths() {
  const { eyebrow, title, lede, fresh, old, outcome } = home.paths

  return (
    <section className="paths" aria-labelledby="paths-title">
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
                  <RibbonBand className="paths__band" />
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

        <div className="paths__merge" aria-hidden="true">
          <Ribbon
            id="merge-wide"
            className="paths__merge-art paths__merge-art--wide"
            viewBox={mergeWide.viewBox}
            layers={[
              ...mergeWide.branches.map((spec) => ({ spec, stage: 'a' as const })),
              { spec: mergeWide.trunk, stage: 'b' },
            ]}
            draw="scroll"
          />
          <Ribbon
            id="merge-compact"
            className="paths__merge-art paths__merge-art--compact"
            viewBox={mergeCompact.viewBox}
            layers={[
              ...mergeCompact.branches.map((spec) => ({ spec, stage: 'a' as const })),
              { spec: mergeCompact.trunk, stage: 'b' },
            ]}
            draw="scroll"
          />
        </div>

        <p className="paths__outcome" data-reveal>
          {outcome}
        </p>
      </div>
    </section>
  )
}
