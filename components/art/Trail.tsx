import type { ReactNode } from 'react'
import { Ribbon, RibbonBand } from './Ribbon'
import { trailTurn } from './ribbons'

/**
 * A continuous ribbon through a sequence of sections.
 *
 * Wide screens: each section has a band down one edge; between sections the
 * ribbon sweeps across to the opposite edge, and copy and visual swap sides
 * with it. The bands stretch with their content, the turns keep their shape,
 * and every part draws as it scrolls into view.
 *
 * Small screens: one band down the left edge, unbroken.
 */
export function Trail({
  id,
  items,
  label,
}: {
  id: string
  label: string
  items: Array<{ key: string; copy: ReactNode; visual: ReactNode }>
}) {
  return (
    <ol className="trail" aria-label={label}>
      {items.map((item, i) => {
        const side = i % 2 === 0 ? 'left' : 'right'
        const last = i === items.length - 1
        return (
          <li key={item.key} className={`trail__item trail__item--${side}`}>
            <div className="trail__row">
              <RibbonBand className={['trail__band', last && 'trail__band--end'].filter(Boolean).join(' ')} />
              <div className="trail__copy">{item.copy}</div>
              <div className="trail__visual">{item.visual}</div>
            </div>
            {!last && (
              <div className="trail__turn" aria-hidden="true">
                <Ribbon
                  id={`${id}-turn-${i}`}
                  className="trail__turn-art"
                  viewBox={trailTurn.viewBox}
                  spec={side === 'left' ? trailTurn.leftToRight : trailTurn.rightToLeft}
                  draw="linked"
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
