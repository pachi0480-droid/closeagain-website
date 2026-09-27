'use client'

import Link from 'next/link'
import { useId, useState } from 'react'

type Item = { q: string; a: string; links?: ReadonlyArray<{ label: string; href: string }> }

/**
 * Question rows that open smoothly to their real height (grid-template-rows
 * 0fr → 1fr), any number at once. Real buttons with aria-expanded; a closed
 * answer is hidden from keyboard and screen readers once its close finishes.
 *
 * The server renders the same state the browser starts with, so nothing
 * moves on hydration. Without JavaScript every answer is simply shown.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  headingLevel = 'h2',
}: {
  items: readonly Item[]
  defaultOpen?: number
  /** h3 when the accordion sits under its own section heading. */
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([defaultOpen]))
  const baseId = useId()

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <div className="acc">
      <noscript>
        <style>{`.acc__panel{grid-template-rows:1fr!important}.acc__inner{visibility:visible!important}.acc__icon{display:none}`}</style>
      </noscript>
      {items.map((item, i) => {
        const expanded = open.has(i)
        const buttonId = `${baseId}-q${i}`
        const panelId = `${baseId}-a${i}`
        return (
          <div key={item.q} className="acc__item" data-open={expanded}>
            <Heading className="acc__heading">
              <button
                id={buttonId}
                type="button"
                className="acc__q"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className="acc__q-text">{item.q}</span>
                <span className="acc__icon" aria-hidden="true" />
              </button>
            </Heading>
            <div id={panelId} className="acc__panel" role="region" aria-labelledby={buttonId}>
              <div className="acc__inner">
                <div className="acc__a">
                  <p>{item.a}</p>
                  {item.links && (
                    <p className="acc__links">
                      {item.links.map((link) => (
                        <Link key={link.href} href={link.href} className="prose-link">
                          {link.label}
                        </Link>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
