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

/** Contact page: a sweep beneath the copy that points to the form. */
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

/**
 * Homepage “New + Old”: two conversations (the vertical bands behind each
 * column) turn in and merge into one wider ribbon — More conversations.
 * Column centres sit at 24% and 76% of the container, which the CSS grid
 * guarantees with a 4% column gap. Branch ends are vertical so they meet the
 * CSS bands seamlessly; wobble is off for the same reason.
 */
export const mergeWide: { viewBox: string; branches: RibbonSpec[]; trunk: RibbonSpec } = {
  viewBox: '0 0 1280 330',
  branches: [
    {
      points: [
        [307.2, 0],
        [307.2, 36],
        [330, 104],
        [430, 172],
        [560, 214],
        [640, 232],
      ],
      width: [
        [0, 30],
        [1, 30],
      ],
      wobble: 0,
      step: 4,
    },
    {
      points: [
        [972.8, 0],
        [972.8, 36],
        [950, 104],
        [850, 172],
        [720, 214],
        [640, 232],
      ],
      width: [
        [0, 30],
        [1, 30],
      ],
      wobble: 0,
      step: 4,
    },
  ],
  trunk: {
    points: [
      [640, 214],
      [640, 250],
      [640, 262],
    ],
    width: [
      [0, 40],
      [1, 40],
    ],
    arrow: { length: 1.7, spread: 2.6 },
    wobble: 0,
    step: 3,
  },
}

export const mergeCompact: { viewBox: string; branches: RibbonSpec[]; trunk: RibbonSpec } = {
  viewBox: '0 0 400 250',
  branches: [
    {
      points: [
        [94, 0],
        [94, 22],
        [110, 76],
        [160, 122],
        [200, 140],
      ],
      width: [
        [0, 20],
        [1, 20],
      ],
      wobble: 0,
      step: 3,
    },
    {
      points: [
        [306, 0],
        [306, 22],
        [290, 76],
        [240, 122],
        [200, 140],
      ],
      width: [
        [0, 20],
        [1, 20],
      ],
      wobble: 0,
      step: 3,
    },
  ],
  trunk: {
    points: [
      [200, 128],
      [200, 160],
      [200, 170],
    ],
    width: [
      [0, 27],
      [1, 27],
    ],
    arrow: { length: 1.7, spread: 2.6 },
    wobble: 0,
    step: 3,
  },
}

/**
 * Trail turns (How it works, Features): the ribbon runs down one edge of a
 * section, then sweeps across to the other edge for the next one. Ends are
 * vertical and 26 units wide so they meet the CSS bands (--rw) seamlessly.
 */
const TRAIL_W = 26

export const trailTurn: { viewBox: string; leftToRight: RibbonSpec; rightToLeft: RibbonSpec } = {
  viewBox: '0 0 1280 200',
  leftToRight: {
    points: [
      [13, 0],
      [13, 18],
      [52, 92],
      [300, 104],
      [980, 96],
      [1228, 108],
      [1267, 182],
      [1267, 200],
    ],
    width: [
      [0, TRAIL_W],
      [1, TRAIL_W],
    ],
    wobble: 0,
    step: 4,
  },
  rightToLeft: {
    points: [
      [1267, 0],
      [1267, 18],
      [1228, 92],
      [980, 104],
      [300, 96],
      [52, 108],
      [13, 182],
      [13, 200],
    ],
    width: [
      [0, TRAIL_W],
      [1, TRAIL_W],
    ],
    wobble: 0,
    step: 4,
  },
}

export { head as arrowHead }

/**
 * Automation section: the conversation arrives from the left edge, passes
 * behind the sequence preview, and carries on down the page between the two
 * columns — it never crosses the copy.
 */
export const weaveWide: Art = {
  viewBox: '0 0 1440 760',
  spec: {
    points: [
      [-80, 236],
      [120, 250],
      [330, 292],
      [540, 352],
      [690, 446],
      [760, 556],
      [786, 640],
    ],
    width: [
      [0, 40],
      [0.5, 32],
      [1, 30],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 14,
  },
}

/**
 * Old leads: the ribbon goes out behind the lead card, turns, and comes back
 * over the top — the shape of “again”. Coordinates assume the card spans
 * x 267–933 and y 50–550 of this box (see .second__ribbon).
 */
export const secondChanceLoop: Art = {
  viewBox: '0 0 1000 600',
  spec: {
    points: [
      [1180, 430],
      [900, 440],
      [560, 452],
      [300, 446],
      [168, 392],
      [120, 288],
      [150, 170],
      [236, 86],
      [360, 30],
      [500, 12],
    ],
    width: [
      [0, 36],
      [0.5, 30],
      [1, 29],
    ],
    arrow: head,
    wobble: 0.03,
    seed: 16,
  },
}
