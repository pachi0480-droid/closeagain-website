'use client'

import { Reveal } from '@/components/ui/Reveal'
import { useInViewOnce } from '@/lib/hooks'

/**
 * The quiet moment. After the Leak Map has shown eleven opportunities falling
 * out of the flow, this is the whole argument at the largest type on the site
 * and nothing else — no card, no interface, no rule.
 *
 * Scale contrast is the job here: every other section is set inside the same
 * container, and this one is not.
 */
export function MegaStatement() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.35 })

  return (
    <section className="grain lit-warm relative isolate overflow-hidden bg-paper py-28 md:py-36 lg:py-44">
      {/* a recovery path crossing behind the words */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path
            ref={undefined}
            d="M -40 300 C 320 300, 420 118, 720 118 C 1020 118, 1120 268, 1480 268"
            fill="none"
            stroke="var(--color-recover)"
            strokeWidth="1.25"
            className="path-draw"
            data-drawn={inView}
            style={{ '--len': 2000, opacity: 0.22 } as React.CSSProperties}
          />
        </svg>
      </div>

      <div ref={ref} className="shell">
        <Reveal y={24}>
          <p className="max-w-[13ch] text-mega text-graphite-3">
            You may not need more leads.
          </p>
        </Reveal>
        <Reveal delay={200} y={24}>
          <p className="mt-6 max-w-[15ch] text-mega text-graphite md:mt-10">
            You may need more of them to make it through.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
