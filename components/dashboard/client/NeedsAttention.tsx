'use client'

import { ArrowRight, CircleCheck } from 'lucide-react'
import Link from 'next/link'
import { useId, type CSSProperties } from 'react'
import type { AttentionItem } from '@/content/demo/attention'
import { fmtNumber } from '@/content/demo/format'
import { cx } from '../ui'

/**
 * The overview's first question answered: what needs a person right now.
 * Each item is a count taken from the sample records and a link to the view
 * filtered to exactly those records.
 */
export function NeedsAttention({ items, index = 0 }: { items: AttentionItem[]; index?: number }) {
  const headingId = useId()
  const total = items.reduce((sum, item) => sum + item.count, 0)
  return (
    <section className={cx('ui-panel app-attn app-rise', items.length === 0 && 'is-clear')} aria-labelledby={headingId} style={{ '--i': index } as CSSProperties}>
      <header className="app-attn__head">
        <h2 id={headingId} className="app-attn__title">
          Needs attention
        </h2>
        <p className="ui-meta app-attn__summary" aria-live="polite">
          {items.length === 0 ? 'All caught up' : `${fmtNumber(total)} ${total === 1 ? 'thing' : 'things'} to act on today`}
        </p>
      </header>
      {items.length === 0 ? (
        <p className="app-attn__clear">
          <CircleCheck aria-hidden="true" size={18} />
          Nothing needs you right now. New replies, bookings and connection problems will show up here.
        </p>
      ) : (
        <ul className="app-attn__list">
          {items.map((item) => (
            <li key={item.id} className="app-attn__cell">
              <Link href={item.href} className={cx('app-attn__item', item.urgent && 'is-urgent')}>
                <span className="app-attn__count">{fmtNumber(item.count)}</span>
                <span className="app-attn__text">
                  <span className="app-attn__label">{item.label}</span>
                  <span className="app-attn__detail">{item.detail}</span>
                </span>
                <span className="app-attn__action">
                  {item.action}
                  <ArrowRight aria-hidden="true" size={15} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
