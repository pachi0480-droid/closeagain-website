import type { CSSProperties } from 'react'
import { buildRibbon, type RibbonSpec } from '@/lib/ribbon'

/**
 * How a ribbon appears:
 *  - `intro`   reveals along its curve once, on the first homepage load of a
 *              session
 *  - `scroll`  reveals along its curve once, as it arrives in view
 *  - `scrub`   draws in step with the visitor's scroll (MotionController);
 *              without that enhancement it behaves like `scroll`
 *  - `static`  never animates
 */
export type Draw = 'intro' | 'scroll' | 'scrub' | 'static'

export type RibbonLayer = {
  spec: RibbonSpec
  /** Staging for multi-part drawings: `a` draws first, then `b`, then `c`. */
  stage?: 'a' | 'b' | 'c'
}

/**
 * A vermilion ribbon (or several, drawn as one piece), rendered as static
 * filled paths.
 *
 * The reveal is a mask stroked along each centreline, so a ribbon keeps its
 * full width and tapering at every moment — it is never a thin line that
 * thickens. The arrowhead is a separate shape that lands once the shaft has
 * drawn, sliding in along the ribbon's last direction (see motion.css), so it
 * is never wiped in slice by slice. Without CSS animation (reduced motion, no
 * JavaScript) every mask is complete and the ribbon is simply there.
 */
export function Ribbon({
  id,
  spec,
  layers,
  viewBox,
  preserveAspectRatio = 'xMidYMid meet',
  className,
  draw = 'static',
}: {
  id: string
  spec?: RibbonSpec
  layers?: RibbonLayer[]
  viewBox: string
  preserveAspectRatio?: string
  className?: string
  draw?: Draw
}) {
  const parts = layers ?? (spec ? [{ spec }] : [])
  const geometries = parts.map((part) => ({ ...buildRibbon(part.spec), stage: part.stage }))
  const animated = draw !== 'static'

  return (
    <svg
      className={['ribbon', className].filter(Boolean).join(' ')}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
      data-draw={draw}
    >
      {animated && (
        <defs>
          {geometries.map((geometry, i) => (
            <mask
              key={i}
              id={`${id}-reveal-${i}`}
              maskUnits="userSpaceOnUse"
              x={geometry.bounds.x}
              y={geometry.bounds.y}
              width={geometry.bounds.width}
              height={geometry.bounds.height}
            >
              <path
                className={['ribbon__guide', geometry.stage && `ribbon__guide--${geometry.stage}`]
                  .filter(Boolean)
                  .join(' ')}
                d={geometry.guide}
                pathLength={1}
                strokeWidth={Math.ceil(geometry.maxWidth * 1.4)}
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
            </mask>
          ))}
        </defs>
      )}
      {geometries.map((geometry, i) =>
        animated ? (
          <g key={i}>
            <path className="ribbon__shape" d={geometry.shaft} mask={`url(#${id}-reveal-${i})`} />
            {geometry.head && geometry.headFrom && (
              <path
                className={['ribbon__shape', 'ribbon__head', geometry.stage && `ribbon__head--${geometry.stage}`]
                  .filter(Boolean)
                  .join(' ')}
                d={geometry.head}
                style={
                  {
                    '--hx': `${geometry.headFrom[0].toFixed(1)}px`,
                    '--hy': `${geometry.headFrom[1].toFixed(1)}px`,
                  } as CSSProperties
                }
              />
            )}
          </g>
        ) : (
          <path key={i} className="ribbon__shape" d={geometry.outline} />
        ),
      )}
    </svg>
  )
}

/**
 * A straight vertical run of ribbon, as an element rather than a drawing, so
 * it can stretch to whatever height the content beside it needs. Its width
 * comes from `--rw`, set by the composition so it matches the SVG ribbon it
 * joins.
 */
export function RibbonBand({ className, draw = 'scroll' }: { className?: string; draw?: Draw }) {
  return <span className={['ribbon-band', className].filter(Boolean).join(' ')} aria-hidden="true" data-draw={draw} />
}
