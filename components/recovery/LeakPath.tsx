'use client'

import { useInViewOnce } from '@/lib/hooks'

/**
 * The path from interest to booked revenue, with the point where a particular
 * opportunity stopped moving. The solid run is how far it got; everything
 * after the break is the revenue that never arrived.
 */
export function LeakPath({ progress }: { progress: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.8 })
  const pct = Math.round(progress * 100)

  return (
    <div ref={ref} aria-hidden="true" className="relative h-3 w-full">
      {/* the whole path */}
      <span
        className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(18,21,19,0.2) 0 2px, transparent 2px 7px)',
        }}
      />
      {/* how far this opportunity actually got */}
      <span
        className="absolute top-1/2 left-0 h-px origin-left -translate-y-1/2 bg-graphite/45 transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out-quiet)]"
        style={{ width: `${pct}%`, transform: `scaleX(${inView ? 1 : 0})` }}
      />
      {/* where it stopped */}
      <span
        className="absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dormant bg-paper transition-opacity duration-700"
        style={{
          left: `${pct}%`,
          opacity: inView ? 1 : 0,
          transitionDelay: '700ms',
        }}
      />
    </div>
  )
}
