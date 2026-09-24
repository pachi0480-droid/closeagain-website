/**
 * The Leak Map.
 *
 * Eighteen representative opportunities crossing a home-service business from
 * interest to revenue. Most of the map is about the ones that do not make it,
 * and where exactly they stop.
 *
 * Illustrative: this is the shape of the problem, not measured customer data.
 * Nothing here claims a rate.
 */

export const LEAK_STAGES = [
  'Interest',
  'Contact',
  'Follow-up',
  'Booking',
  'Revenue',
] as const

/** Where a lost opportunity stopped, and what it was called when it did. */
export type LeakReason =
  | 'Missed call'
  | 'Slow response'
  | 'Estimate quiet'
  | 'No-show'
  | 'Follow-up ended'

export type Flow = {
  lane: number
  /** Stage index it stops at. `null` books without help. */
  stopsAt: 1 | 2 | 3 | null
  reason?: LeakReason
  /** Whether CloseAgain is designed to work this kind of moment back. */
  recoverable: boolean
}

/**
 * Seven of eighteen book unaided; eleven stop at a gate. CloseAgain reconnects
 * seven of those eleven and four stay lost — because a visualization where
 * recovery catches everything would be a lie, and would read as one.
 *
 * Every count shown on the page is derived from this array, so the copy cannot
 * drift away from the picture.
 */
export const flows: Flow[] = [
  { lane: 0, stopsAt: null, recoverable: false },
  { lane: 1, stopsAt: 1, reason: 'Missed call', recoverable: true },
  { lane: 2, stopsAt: null, recoverable: false },
  { lane: 3, stopsAt: 1, reason: 'Missed call', recoverable: true },
  { lane: 4, stopsAt: 2, reason: 'Slow response', recoverable: true },
  { lane: 5, stopsAt: null, recoverable: false },
  { lane: 6, stopsAt: 1, reason: 'Missed call', recoverable: false },
  { lane: 7, stopsAt: 2, reason: 'Estimate quiet', recoverable: true },
  { lane: 8, stopsAt: null, recoverable: false },
  { lane: 9, stopsAt: 3, reason: 'No-show', recoverable: true },
  { lane: 10, stopsAt: 2, reason: 'Estimate quiet', recoverable: false },
  { lane: 11, stopsAt: null, recoverable: false },
  { lane: 12, stopsAt: 2, reason: 'Follow-up ended', recoverable: true },
  { lane: 13, stopsAt: 3, reason: 'No-show', recoverable: false },
  { lane: 14, stopsAt: null, recoverable: false },
  { lane: 15, stopsAt: 2, reason: 'Follow-up ended', recoverable: true },
  { lane: 16, stopsAt: 1, reason: 'Slow response', recoverable: false },
  { lane: 17, stopsAt: null, recoverable: false },
]

export const LANES = flows.length

/** Counts stated in the caption, derived so they can never drift from the map. */
export const leakCounts = {
  total: flows.length,
  booked: flows.filter((f) => f.stopsAt === null).length,
  lost: flows.filter((f) => f.stopsAt !== null).length,
  recovered: flows.filter((f) => f.stopsAt !== null && f.recoverable).length,
  stillLost: flows.filter((f) => f.stopsAt !== null && !f.recoverable).length,
}

/* --- geometry ------------------------------------------------------------- */

export const MAP = { w: 1000, h: 560, left: 58, right: 918 } as const

/** X position of each stage gate. */
export const stageX = [MAP.left, 268, 478, 688, MAP.right] as const

export const laneY = (lane: number) => 44 + lane * ((MAP.h - 96) / (LANES - 1))

/** Completed paths converge into a tight bundle: revenue collects. */
export const bundleY = (order: number, of: number) =>
  MAP.h / 2 - ((of - 1) * 13) / 2 + order * 13

/** The main run, from interest to the bundle at revenue. */
export function bookedPath(lane: number, order: number, of: number) {
  const y = laneY(lane)
  const ey = bundleY(order, of)
  return `M ${MAP.left} ${y} C ${stageX[2]} ${y}, ${stageX[3]} ${ey}, ${MAP.right} ${ey}`
}

/** Runs to the gate where it stopped, then falls out of the flow. */
export function lostPath(lane: number, stopsAt: number) {
  const y = laneY(lane)
  const x = stageX[stopsAt]
  return `M ${MAP.left} ${y} L ${x} ${y} C ${x + 46} ${y}, ${x + 66} ${y + 42}, ${x + 104} ${y + 62}`
}

/** From the break, back into the flow and on to revenue. */
export function recoveredPath(lane: number, stopsAt: number, order: number, of: number) {
  const y = laneY(lane)
  const x = stageX[stopsAt]
  const ey = bundleY(order, of)
  return `M ${x} ${y} C ${x + 150} ${y}, ${stageX[3]} ${ey}, ${MAP.right} ${ey}`
}
