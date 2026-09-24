'use client'

import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { flows, leakCounts } from '@/data/leak-map'
import { useInViewOnce } from '@/lib/hooks'

const buy = [
  'More ad spend',
  'More clicks',
  'More leads in the queue',
  'A higher cost per booked job',
]

const recover = [
  'A first response in seconds',
  'Follow-up that does not stop at one try',
  'Estimates that get asked a second time',
  'More booked work from the same spend',
]

/**
 * Same demand, two outcomes.
 *
 * Both panels show the identical eighteen opportunities — the same ones from
 * the Leak Map, read from the same data — so the only thing that differs
 * between the two sides is what happened to them. Making the demand identical
 * is the whole argument: this is not about buying more.
 */
export function Comparison() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="grain relative bg-bone py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <SectionMark index="09" label="The trade-off" />
          <h2 className="mt-7 max-w-[24ch] text-h2 text-graphite">
            Lead generation gets them to the door. This is about what happens
            after.
          </h2>
        </Reveal>

        <div ref={ref} className="mt-14 grid gap-px overflow-hidden rounded-[16px] bg-rule md:mt-16 lg:grid-cols-2">
          <Panel
            eyebrow="Without CloseAgain"
            note="Costs more each year"
            tone="lost"
            headline={`${leakCounts.booked} of ${leakCounts.total} make it`}
            sub={`${leakCounts.lost} stop at a gate`}
            items={buy}
            recovered={0}
            shown={inView}
          />
          <Panel
            eyebrow="With CloseAgain"
            note="Works the spend you made"
            tone="recovered"
            headline={`${leakCounts.booked + leakCounts.recovered} of ${leakCounts.total} make it`}
            sub={`${leakCounts.stillLost} still lost`}
            items={recover}
            recovered={leakCounts.recovered}
            shown={inView}
          />
        </div>

        <Reveal delay={100}>
          <p className="mt-10 max-w-[58ch] text-lede text-graphite-2">
            Same demand. Same marketing spend. Same{' '}
            {leakCounts.total} opportunities on both sides — the only difference
            is how many of them were still being worked on day three.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function Panel({
  eyebrow,
  note,
  tone,
  headline,
  sub,
  items,
  recovered,
  shown,
}: {
  eyebrow: string
  note: string
  tone: 'lost' | 'recovered'
  headline: string
  sub: string
  items: string[]
  recovered: number
  shown: boolean
}) {
  const on = tone === 'recovered'
  // The same eighteen, in the same order, on both sides.
  const recoveredIds = flows
    .filter((f) => f.stopsAt !== null && f.recoverable)
    .slice(0, recovered)
    .map((f) => f.lane)

  return (
    <div className="bg-bone p-7 lg:p-9">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={`text-h3 ${on ? 'text-graphite' : 'text-graphite-3'}`}>
          {eyebrow}
        </h3>
        <span
          className={`shrink-0 font-mono text-mono-xs uppercase ${
            on ? 'text-recover' : 'text-graphite-3'
          }`}
        >
          {note}
        </span>
      </div>

      {/* the same demand, differently resolved */}
      <div className="mt-8 flex flex-wrap gap-1.5" aria-hidden="true">
        {flows.map((flow, i) => {
          const booked = flow.stopsAt === null
          const back = recoveredIds.includes(flow.lane)
          return (
            <span
              key={flow.lane}
              className="h-2.5 w-7 rounded-full transition-all duration-700 [transition-timing-function:var(--ease-out-quiet)]"
              style={{
                backgroundColor: booked
                  ? 'var(--color-graphite)'
                  : back
                    ? 'var(--color-recover)'
                    : 'transparent',
                boxShadow:
                  booked || back ? 'none' : 'inset 0 0 0 1px var(--color-dormant)',
                opacity: shown ? (booked || back ? 1 : 0.65) : 0,
                transitionDelay: `${i * 35}ms`,
              }}
            />
          )
        })}
      </div>

      <p className="tnum mt-6 text-[1.375rem] tracking-[-0.02em] text-graphite">
        {headline}
      </p>
      <p
        className={`tnum mt-1 font-mono text-mono-sm ${
          on ? 'text-recover' : 'text-dormant'
        }`}
      >
        {sub}
      </p>

      <ul className="mt-8 border-t border-rule">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-center gap-4 border-b border-rule-soft py-3.5 text-[1.0625rem] last:border-b-0 ${
              on ? 'text-graphite' : 'text-graphite-3'
            }`}
          >
            <span
              className={`h-px w-5 shrink-0 ${on ? 'bg-recover' : 'bg-dormant'}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
