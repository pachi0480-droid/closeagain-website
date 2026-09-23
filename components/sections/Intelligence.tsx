import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

/**
 * Where AI gets explained — deliberately late, deliberately short, and in
 * language a dispatcher would use.
 */
export function Intelligence() {
  return (
    <section className="grain relative bg-paper py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionMark index="06" label="Underneath" />
            </Reveal>
          </div>

          <div className="mt-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <Reveal delay={80}>
              <h2 className="max-w-[22ch] text-h2 text-graphite">
                Intelligence where it matters. Revenue where you feel it.
              </h2>
            </Reveal>

            <div className="mt-10 max-w-[56ch] space-y-5 text-[1.0625rem] leading-relaxed text-graphite-2">
              <Reveal delay={180}>
                <p>
                  CloseAgain reads what a customer actually wrote, works out what
                  they need, and keeps the conversation moving toward a booking.
                  It handles the volume and the hours a person cannot — the 6:42
                  call, the fifth follow-up, the lead from three months ago.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <p>
                  Anything that needs judgment goes to your team, with the whole
                  conversation attached. Pricing decisions, unusual jobs, an
                  upset customer — those are yours, and they should be.
                </p>
              </Reveal>
              <Reveal delay={340}>
                <p className="text-graphite">
                  You should be able to judge this entirely on how much work it
                  puts back on the schedule.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
