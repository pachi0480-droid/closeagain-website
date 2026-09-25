'use client'

import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { convergence, motions, type Motion } from '@/data/motions'
import { chapter } from '@/data/site'
import { useInViewOnce, useScrollVar } from '@/lib/hooks'

/**
 * Chapter three — two motions, one destination.
 *
 * New demand runs down one side, recovered demand down the other, and as the
 * page scrolls both sets of paths draw themselves into the same node. The
 * convergence is the argument: these are not two products.
 *
 * Scroll drives one custom property on the stage; every line reads from it.
 * One style write per frame, no re-render, and under reduced motion the stage
 * is simply pinned to its finished state.
 */
export function RevenueMotions() {
  const ref = useScrollVar<HTMLDivElement>()

  return (
    <section
      id={chapter.motions}
      className="relative scroll-mt-24 border-t border-rule bg-void"
    >
      <div className="shell-wide pt-24 md:pt-28">
        <Reveal>
          <SectionMark index="03" label="Two revenue motions" />
          <h2 className="mt-6 max-w-[20ch] text-h2 font-semibold uppercase text-warm-white">
            New opportunities.
            <br />
            Second chances.
            <br />
            <span className="text-signal">One revenue system.</span>
          </h2>
        </Reveal>
      </div>

      {/* ---------------------------------------- desktop: the convergence */}
      <div ref={ref} className="relative hidden h-[165vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="shell-wide w-full">
            {/* headings */}
            <div className="grid grid-cols-12 gap-8">
              <MotionHead motion={motions[0]} side="left" />
              <div className="col-span-2" />
              <MotionHead motion={motions[1]} side="right" />
            </div>

            {/*
              Sources, manifold, sources. All three share a grid row, so the
              strands begin exactly where the rows are — the geometry cannot
              drift away from the content it is joining.
            */}
            <div className="mt-10 grid grid-cols-12 items-stretch gap-8">
              <MotionSources motion={motions[0]} side="left" />

              <div className="relative col-span-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-y-0 -inset-x-8 h-full w-[calc(100%+4rem)]"
                >
                  {motions[0].sources.map((_, i) => (
                    <Strand
                      key={`l-${i}`}
                      index={i}
                      from={((i + 0.5) / motions[0].sources.length) * 100}
                      side="left"
                      colour="var(--color-info)"
                    />
                  ))}
                  {motions[1].sources.map((_, i) => (
                    <Strand
                      key={`r-${i}`}
                      index={i}
                      from={((i + 0.5) / motions[1].sources.length) * 100}
                      side="right"
                      colour="var(--color-risk)"
                    />
                  ))}
                </svg>

                {/* the node both sides resolve into */}
                <div
                  className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                  style={{
                    opacity: 'calc(0.4 + var(--p, 0) * 0.6)',
                    transform:
                      'translate(-50%, -50%) scale(calc(0.88 + var(--p, 0) * 0.12))',
                  }}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-signal/50 bg-graphite shadow-[0_0_0_8px_var(--color-void)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-signal"
                      style={{ opacity: 'calc(0.35 + var(--p, 0) * 0.65)' }}
                    />
                  </span>
                </div>
              </div>

              <MotionSources motion={motions[1]} side="right" />
            </div>

            <p className="mt-10 text-center font-mono text-mono-xs uppercase tracking-[0.16em] text-signal">
              {convergence.label}
            </p>
            <p className="mt-3 text-center text-[0.9375rem] text-muted">
              {convergence.detail}
            </p>
          </div>
        </div>
      </div>

      {/* --------------------------------- small screens: the same, stacked */}
      <div className="shell-wide pt-12 pb-16 lg:hidden">
        <div className="space-y-10">
          {motions.map((motion) => (
            <StackedMotion key={motion.id} motion={motion} />
          ))}
        </div>

        {/* The convergence, turned through ninety degrees. Both motions still
            have to arrive at the same place for the section to mean anything,
            so a phone gets it too — just running downward. */}
        <VerticalConverge />
      </div>

    </section>
  )
}

/* -------------------------------------------------------------------------- */

/** One strand of the manifold, drawn by scroll rather than by a timer. */
function Strand({
  index,
  from,
  side,
  colour,
}: {
  index: number
  from: number
  side: 'left' | 'right'
  colour: string
}) {
  const x = side === 'left' ? 0 : 100
  const control = side === 'left' ? 55 : 45
  return (
    <path
      d={`M ${x} ${from} C ${control} ${from}, ${control} 50, 50 50`}
      fill="none"
      stroke={colour}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      style={{
        strokeDasharray: 100,
        // Each strand starts a little after the one above it, so the two
        // sides resolve as a sweep rather than all at once.
        strokeDashoffset: `calc((1 - clamp(0, (var(--p, 0) * 1.7 - ${(index * 0.07).toFixed(2)}), 1)) * 100)`,
        opacity: 0.7,
      }}
    />
  )
}

function MotionHead({ motion, side }: { motion: Motion; side: 'left' | 'right' }) {
  const right = side === 'right'
  return (
    <div className={`col-span-5 ${right ? 'text-right' : ''}`}>
      <p className="font-mono text-mono-xs uppercase text-secondary">
        {motion.eyebrow}
      </p>
      <h3 className="mt-2 text-h3 text-warm-white">{motion.title}</h3>
      <p
        className={`mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-muted ${
          right ? 'ml-auto' : ''
        }`}
      >
        {motion.copy}
      </p>
    </div>
  )
}

function MotionSources({
  motion,
  side,
}: {
  motion: Motion
  side: 'left' | 'right'
}) {
  const right = side === 'right'
  const accent = motion.id === 'new' ? 'bg-info' : 'bg-risk'
  return (
    <ul
      className={`col-span-5 flex flex-col justify-between ${right ? 'text-right' : ''}`}
      style={{
        // both columns ease toward the centre as the strands complete
        transform: `translateX(calc(var(--p, 0) * ${right ? '-' : ''}1rem))`,
      }}
    >
      {motion.sources.map((source) => {
        const label = (
          <span
            key="label"
            className="text-[0.9375rem] whitespace-nowrap text-warm-white"
          >
            {source.label}
          </span>
        )
        const detail = (
          <span key="detail" className="truncate text-[0.8125rem] text-secondary">
            {source.detail}
          </span>
        )
        const dash = (
          <span
            key="dash"
            aria-hidden="true"
            className={`h-px w-6 shrink-0 ${accent}`}
          />
        )
        // The dash always sits on the inner edge, pointing at the node.
        return (
          <li
            key={source.label}
            className={`flex items-baseline gap-3 py-1.5 ${
              right ? 'justify-start' : 'justify-end'
            }`}
          >
            {right ? [dash, detail, label] : [label, detail, dash]}
          </li>
        )
      })}
    </ul>
  )
}

/** Six strands from two motions, drawn downward into one node. */
function VerticalConverge() {
  // A tall block: a high threshold would never be met inside the
  // observer's negative bottom margin.
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.05 })

  const strands = [
    { x: 6, colour: 'var(--color-info)' },
    { x: 22, colour: 'var(--color-info)' },
    { x: 38, colour: 'var(--color-info)' },
    { x: 62, colour: 'var(--color-risk)' },
    { x: 78, colour: 'var(--color-risk)' },
    { x: 94, colour: 'var(--color-risk)' },
  ]

  return (
    <div ref={ref} className="mt-10">
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="h-24 w-full"
      >
        {strands.map((strand, i) => (
          <path
            key={strand.x}
            d={`M ${strand.x} 0 C ${strand.x} 34, 50 26, 50 58`}
            fill="none"
            stroke={strand.colour}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.6"
            className="path-draw"
            data-drawn={inView ? 'true' : undefined}
            style={{
              ['--len' as string]: 400,
              ['--draw-delay' as string]: `${i * 80}ms`,
            }}
          />
        ))}
      </svg>

      <div className="-mt-3 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/50 bg-graphite shadow-[0_0_0_6px_var(--color-void)]">
          <span className="h-2 w-2 rounded-full bg-signal" />
        </span>
        <p className="mt-4 font-mono text-mono-xs uppercase tracking-[0.16em] text-signal">
          {convergence.label}
        </p>
        <p className="mt-2 max-w-[38ch] text-[0.9375rem] text-muted">
          {convergence.detail}
        </p>
      </div>
    </div>
  )
}

function StackedMotion({ motion }: { motion: Motion }) {
  const accent = motion.id === 'new' ? 'bg-info' : 'bg-risk'
  return (
    <div>
      <p className="font-mono text-mono-xs uppercase text-secondary">
        {motion.eyebrow}
      </p>
      <h3 className="mt-2 text-h3 text-warm-white">{motion.title}</h3>
      <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
        {motion.copy}
      </p>
      <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {motion.sources.map((source) => (
          <li key={source.label} className="flex items-baseline gap-3">
            <span aria-hidden="true" className={`h-px w-5 shrink-0 ${accent}`} />
            <span className="text-[0.9375rem] text-warm-white">
              {source.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
