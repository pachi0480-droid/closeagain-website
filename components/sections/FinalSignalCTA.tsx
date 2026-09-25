'use client'

import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { cta } from '@/data/site'
import { useInViewOnce } from '@/lib/hooks'

/**
 * The close.
 *
 * Every signal the page has shown resolves into one continuous path with a
 * solid endpoint on it — the mark, drawn at the width of the page. The break
 * closing is the last thing the visitor sees.
 */
export function FinalSignalCTA() {
  return (
    <section className="relative isolate overflow-hidden border-t border-rule bg-void py-24 md:py-32">
      {/*
        Cubes seated in the dock at the end of the path: booked work, as an
        object. Sits under the converging lines so the drawn resolution and
        the physical one are the same beat.
      */}
      <Image
        src="/signal-arrival.webp"
        alt=""
        aria-hidden="true"
        width={1500}
        height={996}
        sizes="100vw"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[34rem] lg:block w-full object-cover object-center opacity-[0.2] [mask-image:linear-gradient(to_top,black_0%,transparent_85%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 100%, rgba(183,255,106,0.07), transparent 70%)',
        }}
      />

      <div className="shell-wide">
        <Converge />

        <div className="mt-14 flex flex-col items-start gap-10 md:mt-16 lg:flex-row lg:items-end lg:justify-between">
          <Reveal delay={100}>
            <h2 className="max-w-[14ch] text-mega font-semibold uppercase text-warm-white">
              Every lead needs a next action.
            </h2>
          </Reveal>

          <Reveal delay={180} className="lg:max-w-[30rem] lg:shrink-0">
            <p className="text-lede text-muted">
              Bring in new opportunities. Work them while intent is high. Reopen
              the ones that went quiet.
            </p>
            <ButtonLink href={cta.target} size="lg" withArrow className="mt-8">
              {cta.primary}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <p className="mt-16 border-t border-rule pt-6 font-mono text-mono-sm uppercase tracking-[0.12em] text-secondary">
            New demand. Recovered demand.{' '}
            <span className="text-signal">More booked work.</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Scattered signals gathering into one line, and one solid endpoint.
 *
 * The dash pattern has to clear the on-screen length of each path, not its
 * length in viewBox units: the box is stretched horizontally and the stroke is
 * non-scaling, so a pattern sized to the viewBox would dash off the tail.
 */
function Converge() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.05 })

  const feeders = [
    { y: 6, colour: 'var(--color-info)' },
    { y: 20, colour: 'var(--color-risk)' },
    { y: 34, colour: 'var(--color-quiet)' },
    { y: 66, colour: 'var(--color-info)' },
    { y: 80, colour: 'var(--color-risk)' },
    { y: 94, colour: 'var(--color-quiet)' },
  ]

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="h-24 w-full md:h-32"
      >
        {feeders.map((feeder, i) => (
          <path
            key={feeder.y}
            d={`M 0 ${feeder.y} C 220 ${feeder.y}, 300 50, 520 50`}
            fill="none"
            stroke={feeder.colour}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
            className="path-draw"
            data-drawn={inView ? 'true' : undefined}
            style={{
              ['--len' as string]: 1600,
              ['--draw-delay' as string]: `${i * 90}ms`,
            }}
          />
        ))}

        {/* the resolved path */}
        <path
          d="M 520 50 H 930"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="path-draw"
          data-drawn={inView ? 'true' : undefined}
          style={{
            ['--len' as string]: 1000,
            ['--draw-delay' as string]: '620ms',
          }}
        />
        <circle
          cx="960"
          cy="50"
          r="9"
          fill="var(--color-signal)"
          className="transition-[transform,opacity] duration-500 [transition-delay:1s] [transition-timing-function:var(--ease-out-quiet)]"
          style={{
            transformOrigin: '960px 50px',
            transform: inView ? 'scale(1)' : 'scale(0.2)',
            opacity: inView ? 1 : 0,
          }}
        />
      </svg>
    </div>
  )
}
