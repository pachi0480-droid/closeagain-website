import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

/**
 * Where AI gets explained — late, short, and in language a dispatcher would
 * use. Set narrow, as an editorial column rather than another wide section, so
 * it reads as an aside rather than a claim.
 */
export function Intelligence() {
  return (
    <section className="grain-ink relative bg-ink py-24 md:py-28">
      <div className="shell-narrow">
        <Reveal>
          <SectionMark index="06" label="Underneath" />
          <h2 className="mt-7 max-w-[24ch] text-h3 text-chalk">
            Intelligence where it matters. Revenue where you feel it.
          </h2>
        </Reveal>

        <div className="mt-8 max-w-[62ch] space-y-5 text-[1.0625rem] leading-relaxed text-chalk-2">
          <Reveal delay={120}>
            <p>
              CloseAgain reads what a customer actually wrote, works out what
              they need, and keeps the conversation moving toward a booking. It
              handles the volume and the hours a person cannot — the 6:42 call,
              the fifth follow-up, the lead from three months ago.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p>
              Anything that needs judgment goes to your team, with the whole
              conversation attached. Pricing decisions, unusual jobs, an upset
              customer — those are yours, and they should be.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="text-chalk">
              You should be able to judge this entirely on how much work it puts
              back on the schedule.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
