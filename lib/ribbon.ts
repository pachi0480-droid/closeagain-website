/**
 * Ribbon geometry.
 *
 * Every red ribbon on the site is authored as a centreline — a handful of
 * points the stroke passes through — plus a width profile. This module turns
 * that description into a single filled outline (shaft and arrowhead as one
 * shape), so the ribbon can taper like a brush stroke instead of being a
 * constant-width line, and so the arrowhead always sits on the shaft's real
 * end tangent.
 *
 * It runs at build time inside server components: the browser receives plain
 * static SVG paths and no geometry code.
 */

export type Point = readonly [number, number]

export type RibbonSpec = {
  /** Points the centreline passes through, in viewBox units. */
  points: readonly Point[]
  /** Width stops along the ribbon: [position 0..1 along its length, width]. */
  width: ReadonlyArray<readonly [number, number]>
  /** Arrowhead proportions, as multiples of the shaft width at the end. */
  arrow?: { length: number; spread: number; sweep?: number }
  /** Width wobble as a fraction of width. Gives the edge a hand-cut quality. */
  wobble?: number
  seed?: number
  /** Taper the first stretch to a soft point instead of a flat cut. */
  taperStart?: number
  /** Sampling distance in viewBox units. */
  step?: number
}

export type RibbonGeometry = {
  /** The filled outline: shaft plus arrowhead. */
  outline: string
  /** The centreline, extended through the arrow tip. Used to reveal the ribbon. */
  guide: string
  /** Widest point of the shape, for sizing the reveal mask stroke. */
  maxWidth: number
  bounds: { x: number; y: number; width: number; height: number }
}

type Vec = [number, number]

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]]
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]]
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k]
const len = (a: Vec) => Math.hypot(a[0], a[1])

/** Centripetal Catmull–Rom through the points, as cubic Bézier segments. */
function toBeziers(points: readonly Point[]): Array<[Vec, Vec, Vec, Vec]> {
  const p = points.map((q) => [q[0], q[1]] as Vec)
  // Mirror the end points so the first and last segments have neighbours.
  const first = sub(scale(p[0], 2), p[1])
  const last = sub(scale(p[p.length - 1], 2), p[p.length - 2])
  const all = [first, ...p, last]
  const segments: Array<[Vec, Vec, Vec, Vec]> = []

  for (let i = 1; i < all.length - 2; i++) {
    const p0 = all[i - 1]
    const p1 = all[i]
    const p2 = all[i + 1]
    const p3 = all[i + 2]
    const d1 = Math.max(Math.sqrt(len(sub(p1, p0))), 1e-4)
    const d2 = Math.max(Math.sqrt(len(sub(p2, p1))), 1e-4)
    const d3 = Math.max(Math.sqrt(len(sub(p3, p2))), 1e-4)

    // Barry–Goldman tangents for the centripetal parameterisation.
    const m1 = scale(
      add(
        sub(scale(sub(p1, p0), 1 / d1), scale(sub(p2, p0), 1 / (d1 + d2))),
        scale(sub(p2, p1), 1 / d2),
      ),
      d2,
    )
    const m2 = scale(
      add(
        sub(scale(sub(p2, p1), 1 / d2), scale(sub(p3, p1), 1 / (d2 + d3))),
        scale(sub(p3, p2), 1 / d3),
      ),
      d2,
    )
    segments.push([p1, add(p1, scale(m1, 1 / 3)), sub(p2, scale(m2, 1 / 3)), p2])
  }
  return segments
}

function bezier(s: [Vec, Vec, Vec, Vec], t: number): Vec {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [
    a * s[0][0] + b * s[1][0] + c * s[2][0] + d * s[3][0],
    a * s[0][1] + b * s[1][1] + c * s[2][1] + d * s[3][1],
  ]
}

function interpolateWidth(stops: RibbonSpec['width'], t: number) {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    const [t1, w1] = stops[i]
    const [t0, w0] = stops[i - 1]
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0 || 1)
      // Smoothstep between stops so the taper never shows a kink.
      const e = k * k * (3 - 2 * k)
      return w0 + (w1 - w0) * e
    }
  }
  return stops[stops.length - 1][1]
}

const fmt = (n: number) => (Math.round(n * 10) / 10).toString()
const pt = (v: Vec) => `${fmt(v[0])} ${fmt(v[1])}`

export function buildRibbon(spec: RibbonSpec): RibbonGeometry {
  const segments = toBeziers(spec.points)
  const step = spec.step ?? 6
  const wobble = spec.wobble ?? 0.03
  const seed = spec.seed ?? 1

  // Dense sampling, then resampling at even arc-length intervals.
  const dense: Vec[] = []
  for (const s of segments) {
    for (let i = 0; i < 80; i++) dense.push(bezier(s, i / 80))
  }
  dense.push(segments[segments.length - 1][3])

  const cumulative = [0]
  for (let i = 1; i < dense.length; i++) {
    cumulative.push(cumulative[i - 1] + len(sub(dense[i], dense[i - 1])))
  }
  const total = cumulative[cumulative.length - 1]
  const count = Math.max(8, Math.ceil(total / step))

  const samples: Vec[] = []
  let j = 1
  for (let i = 0; i <= count; i++) {
    const target = (total * i) / count
    while (j < cumulative.length - 1 && cumulative[j] < target) j++
    const span = cumulative[j] - cumulative[j - 1] || 1
    const k = (target - cumulative[j - 1]) / span
    samples.push(add(dense[j - 1], scale(sub(dense[j], dense[j - 1]), k)))
  }

  const left: Vec[] = []
  const right: Vec[] = []
  let maxWidth = 0
  let endTangent: Vec = [1, 0]
  let endWidth = 0

  for (let i = 0; i < samples.length; i++) {
    const prev = samples[Math.max(0, i - 1)]
    const next = samples[Math.min(samples.length - 1, i + 1)]
    const d = sub(next, prev)
    const tangent = scale(d, 1 / (len(d) || 1))
    const normal: Vec = [-tangent[1], tangent[0]]
    const t = i / (samples.length - 1)
    const arc = t * total

    let w = interpolateWidth(spec.width, t)
    w *= 1 + wobble * (0.6 * Math.sin(arc / 53 + seed) + 0.4 * Math.sin(arc / 19 + seed * 2.3))
    if (spec.taperStart && arc < spec.taperStart) {
      const k = arc / spec.taperStart
      w *= 0.18 + 0.82 * Math.sin((k * Math.PI) / 2)
    }

    maxWidth = Math.max(maxWidth, w)
    left.push(add(samples[i], scale(normal, w / 2)))
    right.push(sub(samples[i], scale(normal, w / 2)))
    if (i === samples.length - 1) {
      endTangent = tangent
      endWidth = w
    }
  }

  const end = samples[samples.length - 1]
  let head = ''
  let tip = end
  if (spec.arrow) {
    const { length, spread, sweep = 0 } = spec.arrow
    const normal: Vec = [-endTangent[1], endTangent[0]]
    const half = (endWidth * spread) / 2
    const back = scale(endTangent, -endWidth * sweep)
    const barbLeft = add(add(end, scale(normal, half)), back)
    const barbRight = add(sub(end, scale(normal, half)), back)
    tip = add(end, scale(endTangent, endWidth * length))
    head = ` L ${pt(barbLeft)} L ${pt(tip)} L ${pt(barbRight)}`
    maxWidth = Math.max(maxWidth, half * 2)
  }

  const outline =
    `M ${pt(left[0])}` +
    left.slice(1).map((v) => ` L ${pt(v)}`).join('') +
    head +
    right
      .slice()
      .reverse()
      .map((v) => ` L ${pt(v)}`)
      .join('') +
    ' Z'

  const guide =
    `M ${pt(segments[0][0])}` +
    segments.map((s) => ` C ${pt(s[1])} ${pt(s[2])} ${pt(s[3])}`).join('') +
    (spec.arrow ? ` L ${pt(tip)}` : '')

  const padding = maxWidth * 1.5
  const xs = [...samples.map((p) => p[0]), tip[0]]
  const ys = [...samples.map((p) => p[1]), tip[1]]
  const bounds = {
    x: Math.min(...xs) - padding,
    y: Math.min(...ys) - padding,
    width: Math.max(...xs) - Math.min(...xs) + padding * 2,
    height: Math.max(...ys) - Math.min(...ys) + padding * 2,
  }
  return { outline, guide, maxWidth, bounds }
}
