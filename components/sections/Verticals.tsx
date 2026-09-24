import { Reveal } from '@/components/ui/Reveal'
import { Illustrative } from '@/components/ui/Disclaimer'
import { SectionMark } from '@/components/ui/Type'
import { verticals } from '@/data/verticals'

/**
 * Three trades, three operational scenes. Each one runs the same four beats —
 * what came in, what stalled it, what CloseAgain did, where it landed — so the
 * pattern reads as one system applied three times rather than three features.
 */
export function Verticals() {
  return (
    <section className="grain relative bg-paper py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <SectionMark index="08" label="Built for" />
          <h2 className="mt-7 max-w-[24ch] text-h2 text-graphite">
            Built for businesses where one call can be real revenue.
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[16px] bg-rule md:mt-20 lg:grid-cols-3">
          {verticals.map((trade, i) => (
            <li key={trade.id} className="bg-paper">
              <Reveal delay={i * 90} className="flex h-full flex-col p-7 lg:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-h3 text-graphite">{trade.name}</h3>
                  <span className="tnum font-mono text-mono-sm text-graphite-3">
                    {trade.time}
                  </span>
                </div>

                {/* what actually comes in */}
                <p className="mt-7 rounded-[12px] rounded-bl-[3px] bg-limestone/80 px-4 py-3 text-[0.9375rem] text-graphite">
                  &ldquo;{trade.quote}&rdquo;
                </p>
                <p className="mt-2 font-mono text-mono-xs text-graphite-3 uppercase">
                  {trade.channel}
                </p>

                {/* the four beats, on one thread */}
                <ol className="relative mt-8 grow">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 bottom-2 left-[3px] w-px"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to bottom, rgba(18,21,19,0.18) 0 3px, transparent 3px 9px)',
                    }}
                  />
                  {[
                    { label: trade.stall, tone: 'lost' as const },
                    { label: trade.action, tone: 'engaged' as const },
                    { label: trade.window, tone: 'recovered' as const },
                  ].map((beat) => (
                    <li key={beat.label} className="relative flex gap-4 pb-5 last:pb-0">
                      <span
                        aria-hidden="true"
                        className={`mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full ring-4 ring-paper ${
                          beat.tone === 'recovered'
                            ? 'bg-recover'
                            : beat.tone === 'engaged'
                              ? 'bg-engaged'
                              : 'bg-dormant'
                        }`}
                      />
                      <span
                        className={`text-[0.9375rem] leading-snug ${
                          beat.tone === 'recovered'
                            ? 'text-recover'
                            : beat.tone === 'lost'
                              ? 'text-graphite-3'
                              : 'text-graphite-2'
                        }`}
                      >
                        {beat.label}
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="mt-7 border-t border-rule pt-5 text-[0.875rem] leading-relaxed text-graphite-3">
                  {trade.context}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-graphite-2">
              The first build is focused on these three, because the shape of the
              problem is the same in all of them: urgent demand, real marketing
              spend, and an office that cannot answer everything at once.
            </p>
            <Illustrative className="shrink-0">Illustrative scenarios</Illustrative>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
