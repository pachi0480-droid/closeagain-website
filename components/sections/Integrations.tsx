import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { integrationTargets } from '@/data/capabilities'

/**
 * Integration posture, stated honestly.
 *
 * Nothing is built yet, so nothing is shown as a logo and nothing is called
 * supported. These are the categories of system being designed around, and
 * every one of them is labelled as intent.
 */
export function Integrations() {
  return (
    <section className="grain relative bg-paper py-24 md:py-28">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionMark index="03" label="Fit" />
              <h2 className="mt-7 max-w-[20ch] text-h2 text-graphite">
                Built to fit the systems your team already uses.
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-6 lg:col-start-7 lg:mt-2">
            <Reveal delay={140}>
              <p className="max-w-[48ch] text-lede text-graphite-2">
                Recovery only matters if it lands somewhere real — a window on
                the board, a note on the job, a number your office recognises.
                CloseAgain is being designed around the tools you already run
                rather than asking you to move.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={100}>
          <ul className="mt-14 grid border-t border-graphite/20 md:mt-16 sm:grid-cols-2">
            {integrationTargets.map((target, i) => (
              <li
                key={target.category}
                className={`border-b border-rule py-7 ${
                  i % 2 === 1 ? 'sm:border-l sm:pl-10' : 'sm:pr-10'
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[1.0625rem] tracking-[-0.015em] text-graphite">
                    {target.category}
                  </h3>
                  <span className="shrink-0 rounded-[5px] border border-rule px-2 py-1 font-mono text-mono-xs text-graphite-3 uppercase">
                    Planned
                  </span>
                </div>
                <p className="mt-2.5 max-w-[42ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                  {target.note}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-8 max-w-[62ch] text-[0.9375rem] leading-relaxed text-graphite-2">
            No integration is live today, and none is being claimed as
            available. Specific connections get confirmed as they are built —
            pilot operators set the order, because the first ones should be the
            systems those operators actually run.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
