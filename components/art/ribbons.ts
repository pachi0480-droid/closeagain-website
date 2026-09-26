/**
 * Ribbon centrelines for every composition on the site.
 *
 * The homepage ribbon was traced from the approved reference image at its
 * native 1513 × 1040 size, so its viewBox uses the reference's own pixel
 * coordinates. The other ribbons are drawn in the same hand: a broad stroke
 * that tapers slightly, bends with intent, and ends in a proportionate head.
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
      [1134.5, 425],
      [1194, 485],
      [1239, 560],
      [1266, 611],
      [1297, 648],
      [1338, 665],
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
    wobble: 0.03,
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
      [-82, 108],
      [-62, 146],
      [-52, 192],
      [-44, 238],
      [-33, 276],
    ],
    width: [
      [0, 23],
      [0.6, 21],
      [1, 22],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 5,
  },
}

/** Closing call to action: enters from the left edge and lands by the button. */
export const closingSweep: { viewBox: string; spec: RibbonSpec } = {
  viewBox: '0 0 1000 200',
  spec: {
    points: [
      [-260, 12],
      [-60, 64],
      [160, 128],
      [400, 158],
      [620, 150],
      [800, 116],
      [900, 90],
    ],
    width: [
      [0, 40],
      [0.45, 29],
      [1, 30],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 9,
  },
}

type Art = { viewBox: string; spec: RibbonSpec }

/**
 * How it works: the “carriage return” between steps. It comes back from the
 * right-hand side of one step and lands at the start of the next.
 */
export const stepReturnWide: Art = {
  viewBox: '0 0 1280 190',
  spec: {
    points: [
      [1780, -70],
      [1500, 6],
      [1220, 58],
      [980, 92],
      [700, 112],
      [420, 112],
      [220, 118],
      [118, 138],
      [74, 168],
    ],
    width: [
      [0, 36],
      [0.5, 27],
      [1, 26],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 3,
  },
}

export const stepReturnCompact: Art = {
  viewBox: '0 0 400 170',
  spec: {
    points: [
      [640, -60],
      [470, 14],
      [360, 44],
      [240, 72],
      [120, 86],
      [58, 112],
      [36, 142],
    ],
    width: [
      [0, 30],
      [1, 25],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 4,
  },
}

/**
 * Who it’s for: the returning arrow. It runs out from the left edge, turns,
 * and comes back — the shape of a conversation picked up again.
 */
export const returnLoopWide: Art = {
  viewBox: '0 0 1280 230',
  spec: {
    points: [
      [-300, 176],
      [0, 186],
      [420, 188],
      [780, 176],
      [1010, 150],
      [1110, 108],
      [1120, 66],
      [1070, 40],
      [980, 34],
      [900, 42],
    ],
    width: [
      [0, 42],
      [0.5, 33],
      [1, 31],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 6,
  },
}

export const returnLoopCompact: Art = {
  viewBox: '0 0 400 210',
  spec: {
    points: [
      [-140, 162],
      [60, 168],
      [220, 160],
      [320, 128],
      [350, 86],
      [322, 50],
      [262, 40],
      [214, 50],
    ],
    width: [
      [0, 30],
      [1, 25],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 7,
  },
}

/** Contact and demo pages: a sweep beneath the copy that points to the form. */
export const formSweep: Art = {
  viewBox: '0 0 700 260',
  spec: {
    points: [
      [-420, 40],
      [-150, 112],
      [120, 190],
      [360, 214],
      [540, 190],
      [640, 148],
    ],
    width: [
      [0, 44],
      [0.5, 32],
      [1, 31],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 8,
  },
}

/** Confirmation page: a long, unhurried sweep that lands on “Let’s talk.” */
export const arrivalWide: Art = {
  viewBox: '0 0 1400 300',
  spec: {
    points: [
      [-300, 40],
      [0, 92],
      [300, 172],
      [600, 222],
      [880, 226],
      [1080, 196],
      [1190, 162],
    ],
    width: [
      [0, 52],
      [0.4, 36],
      [1, 34],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 10,
  },
}

/** 404: a ribbon that turns right round and heads back where it came from. */
export const uTurn: Art = {
  viewBox: '0 0 700 300',
  spec: {
    points: [
      [-400, 236],
      [-100, 244],
      [200, 240],
      [420, 222],
      [560, 176],
      [600, 118],
      [560, 70],
      [470, 52],
      [370, 64],
    ],
    width: [
      [0, 44],
      [0.5, 34],
      [1, 32],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 12,
  },
}

export { head as arrowHead }
