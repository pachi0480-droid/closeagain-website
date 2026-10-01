import type { CSSProperties } from 'react'
import { buildRibbon, type RibbonSpec } from '@/lib/ribbon'

/**
 * The hero's vermilion ribbon, rendered as static filled paths.
 *
 * With `draw="intro"` it reveals along its curve once, on the first homepage
 * load of a session (motion.css): the reveal is a mask stroked along the
 * centreline, just wider than the shaft, so the ribbon keeps its full width
 * and taper at every moment — never a thin line that thickens. The arrowhead
 * is its own shape that lands as the shaft arrives, sliding in along the
 * ribbon's last direction. Without animation (reduced motion, no JavaScript,
 * a later visit) the ribbon is simply there.
 */
export function Ribbon({
  id,
  spec,
  viewBox,
  preserveAspectRatio = 'xMidYMid meet',
  className,
  draw = 'static',
}: {
  id: string
  spec: RibbonSpec
  viewBox: string
  preserveAspectRatio?: string
  className?: string
  draw?: 'intro' | 'static'
}) {
  const geometry = buildRibbon(spec)
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
      {animated ? (
        <>
          <defs>
            <mask
              id={`${id}-reveal`}
              maskUnits="userSpaceOnUse"
              x={geometry.bounds.x}
              y={geometry.bounds.y}
              width={geometry.bounds.width}
              height={geometry.bounds.height}
            >
              <path
                className="ribbon__guide"
                d={geometry.guide}
                pathLength={1}
                strokeWidth={Math.ceil(geometry.shaftWidth * 1.25)}
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <path className="ribbon__shape" d={geometry.shaft} mask={`url(#${id}-reveal)`} />
          {geometry.head && geometry.headFrom && (
            <path
              className="ribbon__shape ribbon__head"
              d={geometry.head}
              style={
                {
                  '--hx': `${geometry.headFrom[0].toFixed(1)}px`,
                  '--hy': `${geometry.headFrom[1].toFixed(1)}px`,
                } as CSSProperties
              }
            />
          )}
        </>
      ) : (
        <path className="ribbon__shape" d={geometry.outline} />
      )}
    </svg>
  )
}
