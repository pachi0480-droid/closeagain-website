import { GrowthGap } from '@/components/calculator/GrowthGap'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { chapter, cta } from '@/data/site'

/**
 * Chapter six — the growth-gap calculator.
 *
 * The question it answers is not "how much money are you losing" but "which
 * of the two motions is worth more to you": buying more demand, or working
 * the demand already in the building.
 */
export function GrowthGapCalculator() {
  return (
    <section
      id={chapter.calculator}
      className="relative scroll-mt-24 border-t border-rule bg-void py-16 md:py-28"
    >
      <div className="shell-wide">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMark index="06" label="Growth-gap calculator" />
              <h2 className="mt-6 max-w-[20ch] text-h2 font-semibold uppercase text-warm-white">
                What is your follow-up gap worth?
              </h2>
            </div>
            <p className="max-w-[42ch] text-lede text-muted">
              Six assumptions, one multiplication, nothing hidden. Change any of
              them and the whole month moves.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <GrowthGap />
        </Reveal>

        <Reveal delay={160} className="mt-10">
          <ButtonLink href={cta.target} size="lg" withArrow>
            {cta.primary}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
