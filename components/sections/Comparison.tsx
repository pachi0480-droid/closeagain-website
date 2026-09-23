import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

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
 * The strategic contrast. Not an argument against advertising — an argument
 * about what happens to the demand it already buys.
 */
export function Comparison() {
  return (
    <section className="grain relative bg-paper py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <SectionMark index="09" label="The trade-off" />
          <h2 className="mt-7 max-w-[26ch] text-h2 text-graphite">
            Lead generation gets them to the door. This is about what happens
            after.
          </h2>
        </Reveal>

        <div className="mt-14 grid border-t border-graphite/20 md:mt-16 lg:grid-cols-2">
          {/* the expensive way */}
          <div className="border-b border-rule py-10 lg:pr-14">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-h3 text-graphite-3">Buy more demand</h3>
              <span className="font-mono text-mono-xs text-graphite-3 uppercase">
                Costs more each year
              </span>
            </div>
            <ul className="mt-8">
              {buy.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 border-b border-rule-soft py-3.5 text-[1.0625rem] text-graphite-3 last:border-b-0"
                >
                  <span className="h-px w-5 shrink-0 bg-dormant" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* the other way */}
          <div className="border-b border-rule py-10 lg:border-l lg:pl-14">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-h3 text-graphite">Recover more of it</h3>
              <span className="font-mono text-mono-xs text-recover uppercase">
                Works the spend you made
              </span>
            </div>
            <ul className="mt-8">
              {recover.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 border-b border-rule-soft py-3.5 text-[1.0625rem] text-graphite last:border-b-0"
                >
                  <span className="h-px w-5 shrink-0 bg-recover" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal delay={100}>
          <p className="mt-10 max-w-[56ch] text-lede text-graphite-2">
            Nobody is suggesting you stop advertising. The point is that the
            demand you have already bought should be worth more than it currently
            is.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
