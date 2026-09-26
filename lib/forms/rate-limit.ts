/**
 * A small sliding-window limiter keyed by client address.
 *
 * In-memory, so on a multi-instance host it is per instance — a proportionate
 * brake on scripted repeats, not a guarantee. Put a platform firewall rule in
 * front of the endpoint if abuse ever becomes real.
 */

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>()

  return function allow(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(now)
    hits.set(key, recent)

    // Keep the map from growing without bound.
    if (hits.size > 5000) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k)
      }
    }
    return true
  }
}
