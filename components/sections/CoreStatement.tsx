import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

/**
 * The quietest section on the site. It exists to state the position once,
 * clearly, with nothing competing for attention.
 */
export function CoreStatement() {
  return (
    <section
      data-tone="ink"
      className="grain-ink on-ink relative bg-ink pt-24 pb-24 text-chalk md:pt-32 md:pb-36 lg:pt-40 lg:pb-44">
      <div className="shell">
        <Reveal>
          <SectionMark index="02" label="Position" tone="ink" />
        </Reveal>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:mt-16">
          <div className="lg:col-span-8">
            <Reveal delay={80}>
              <h2 className="max-w-[26ch] text-h2 text-chalk">
                CloseAgain operates in the gap between interest and revenue.
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-4 lg:mt-2">
            <Reveal delay={200}>
              <p className="max-w-[44ch] text-lede text-chalk-2">
                Your team already works hard to create demand. This is built to
                recognize when an opportunity is slipping, respond in the moment,
                keep the conversation going, and move the customer toward a
                decision.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
