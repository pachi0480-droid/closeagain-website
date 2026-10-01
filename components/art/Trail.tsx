import type { ReactNode } from 'react'

/**
 * A sequence of sections: copy and its product view side by side, swapping
 * sides from one step to the next on wide screens, one above the other on
 * small ones. Each product view rises into place on a soft warm glow as it
 * arrives, tilting up from the page (motion.css) — no connecting lines.
 */
export function Trail({
  items,
  label,
}: {
  label: string
  items: Array<{ key: string; copy: ReactNode; visual: ReactNode }>
}) {
  return (
    <ol className="trail" aria-label={label}>
      {items.map((item, i) => (
        <li key={item.key} className={`trail__item trail__item--${i % 2 === 0 ? 'left' : 'right'}`}>
          <div className="trail__row">
            <div className="trail__copy">{item.copy}</div>
            <div className="trail__visual" data-lift>
              {item.visual}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
