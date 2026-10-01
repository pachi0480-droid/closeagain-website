/**
 * The homepage ribbon: the one red stroke on the site. It was traced from the
 * approved reference image at its native 1513 × 1040 size, so the wide
 * viewBox uses the reference's own pixel coordinates. Edges are kept clean
 * (no wobble) so the stroke reads as one smooth gesture at every size.
 */

import type { RibbonSpec } from '@/lib/ribbon'

/** Shared arrowhead proportions, measured from the reference (≈111 × 74 on a 38px shaft). */
const head = { length: 1.95, spread: 2.95 } as const

/** Homepage, wide screens. viewBox: the reference, from the header down to the first rule. */
export const heroWide: { viewBox: string; spec: RibbonSpec } = {
  viewBox: '0 84 1513 703',
  spec: {
    points: [
      [-150, -12],
      [-90, 60],
      [0, 160],
      [80, 241],
      [160, 286],
      [280, 317.5],
      [400, 327.5],
      [560, 324],
      [720, 317.5],
      [840, 321.5],
      [960, 342],
      [1062, 380],
      // The tail turns down to land on the last step card (Hero.tsx).
      [1134.5, 428],
      [1186, 486],
      [1218, 548],
      [1234, 604],
    ],
    width: [
      [0, 64],
      [0.12, 53],
      [0.24, 38],
      [0.46, 33.5],
      [0.63, 32.5],
      [0.82, 37],
      [1, 38],
    ],
    arrow: { length: 2.0, spread: 2.95 },
    wobble: 0,
    step: 3,
    seed: 2,
  },
}

/**
 * Homepage, small screens. Units: 100 = one headline em. x = 0 is the right
 * edge of the content column; the SVG is anchored there and the long tail to
 * the left is cropped by the viewport, so the bend and arrowhead keep their
 * shape at every phone width.
 */
export const heroCompact: { viewBox: string; spec: RibbonSpec } = {
  viewBox: '-900 0 900 330',
  spec: {
    points: [
      [-900, 60],
      [-640, 55],
      [-420, 66],
      [-260, 60],
      [-175, 64],
      [-118, 80],
      [-82, 106],
      [-62, 138],
      [-52, 170],
      // Ends beside the promise, clear of the explanation under it.
      [-46, 196],
    ],
    width: [
      [0, 23],
      [0.6, 21],
      [1, 22],
    ],
    arrow: head,
    wobble: 0,
    step: 3,
    seed: 5,
  },
}
