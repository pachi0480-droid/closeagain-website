import { Reveal } from '@/components/ui/Reveal'
import { StatusDot } from '@/components/ui/StatusDot'
import { SectionMark } from '@/components/ui/Type'
import { verticals } from '@/data/verticals'

/**
 * Who this is for, grounded in the sentence the customer actually says when
 * they call. No icons, no stock photography.
 */
export function Verticals() {
  return (
    <section className="grain relative bg-bone py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <SectionMark index="08" label="Built for" />
          <h2 className="mt-7 max-w-[24ch] text-h2 text-graphite">
            Built for businesses where one call can be real revenue.
          </h2>
        </Reveal>

        <ul className="mt-16 grid border-t border-graphite/20 md:mt-20 lg:grid-cols-3">
          {verticals.map((vertical, i) => (
            <li
              key={vertical.id}
              className={[
                'border-b border-rule py-9 lg:py-10',
                i === 0
                  ? 'lg:pr-10'
                  : i === 1
                    ? 'lg:border-l lg:px-10'
                    : 'lg:border-l lg:pl-10',
              ].join(' ')}
            >
              <Reveal delay={i * 90}>
                <h3 className="text-h3 text-graphite">{vertical.name}</h3>

                {/* what actually comes in */}
                <p className="mt-6 max-w-[26ch] rounded-[10px] rounded-bl-[3px] bg-limestone/80 px-4 py-3 text-[0.9375rem] text-graphite">
                  &ldquo;{vertical.quote}&rdquo;
                </p>

                {/* what it should turn into */}
                <p className="mt-3 inline-flex items-center gap-2 rounded-[7px] border border-recover/25 bg-recover/[0.07] px-3 py-1.5">
                  <StatusDot state="recovered" />
                  <span className="tnum font-mono text-mono-xs text-recover uppercase">
                    Booked {vertical.window}
                  </span>
                </p>

                <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                  {vertical.context}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-10 max-w-[62ch] text-[0.9375rem] leading-relaxed text-graphite-2">
            The first build is focused on these three trades, because the shape of
            the problem is the same in all of them: urgent demand, real marketing
            spend, and an office that cannot answer everything at once.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
