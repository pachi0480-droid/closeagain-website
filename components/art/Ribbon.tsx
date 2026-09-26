import { buildRibbon, type RibbonSpec } from '@/lib/ribbon'

type Draw = 'intro' | 'scroll' | 'static'

/**
 * A vermilion ribbon, rendered as one static filled path.
 *
 * `draw` controls how it appears:
 *  - `intro`  reveals along its own curve once, on first page load
 *  - `scroll` reveals along its curve when it enters the viewport
 *  - `static` never animates
 *
 * The reveal is a mask stroked along the centreline, so the ribbon keeps its
 * full width and tapering at every moment — it is never a thin line that
 * thickens. Without CSS animation (reduced motion, no JavaScript for `scroll`)
 * the mask is already complete and the ribbon is simply there.
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
  draw?: Draw
}) {
  const geometry = buildRibbon(spec)
  const maskId = `${id}-reveal`

  return (
    <svg
      className={['ribbon', className].filter(Boolean).join(' ')}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
      data-draw={draw}
    >
      {draw !== 'static' && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="15000" height="15000">
            <path
              className="ribbon__guide"
              d={geometry.guide}
              pathLength={1}
              strokeWidth={Math.ceil(geometry.maxWidth * 1.4)}
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
      )}
      <path
        className="ribbon__shape"
        d={geometry.outline}
        mask={draw !== 'static' ? `url(#${maskId})` : undefined}
      />
    </svg>
  )
}
