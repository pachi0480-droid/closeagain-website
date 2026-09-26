/**
 * Seeded randomness for the sample data. The same seed always produces the
 * same workspace, on the server and in every browser.
 */

export function hashString(input: string): number {
  // FNV-1a, 32-bit.
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export type Rng = {
  /** 0 ≤ n < 1 */
  next: () => number
  /** Integer in [min, max], inclusive. */
  int: (min: number, max: number) => number
  range: (min: number, max: number) => number
  chance: (probability: number) => boolean
  pick: <T>(items: readonly T[]) => T
  weighted: <T>(items: ReadonlyArray<readonly [T, number]>) => T
  /** A few distinct items. */
  sample: <T>(items: readonly T[], count: number) => T[]
}

export function createRng(seed: string | number): Rng {
  let state = typeof seed === 'number' ? seed >>> 0 : hashString(seed)
  // mulberry32
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1))
  return {
    next,
    int,
    range: (min, max) => min + next() * (max - min),
    chance: (probability) => next() < probability,
    pick: (items) => items[Math.floor(next() * items.length)],
    weighted: (items) => {
      const total = items.reduce((sum, [, weight]) => sum + weight, 0)
      let roll = next() * total
      for (const [value, weight] of items) {
        roll -= weight
        if (roll < 0) return value
      }
      return items[items.length - 1][0]
    },
    sample: (items, count) => {
      const pool = [...items]
      const out: (typeof items)[number][] = []
      while (out.length < count && pool.length > 0) {
        out.push(pool.splice(Math.floor(next() * pool.length), 1)[0])
      }
      return out
    },
  }
}

/** A Poisson-distributed count with the given mean (Knuth; fine for small means). */
export function poisson(rng: Rng, mean: number): number {
  if (mean <= 0) return 0
  const limit = Math.exp(-mean)
  let k = 0
  let p = 1
  do {
    k++
    p *= rng.next()
  } while (p > limit)
  return k - 1
}
