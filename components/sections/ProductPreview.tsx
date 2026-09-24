import { ProductStage } from '@/components/visuals/ProductStage'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

/**
 * The moment the site stops describing the product and shows it. Wider than
 * every other section on purpose — the interface needs the room, and the
 * change in scale is what marks this as the payoff.
 */
export function ProductPreview() {
  return (
    <section className="grain lit-warm relative bg-limestone/60 py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionMark index="04" label="The product" />
              <h2 className="mt-7 max-w-[18ch] text-h2 text-graphite">
                What your office would actually work from.
              </h2>
            </Reveal>
          </div>
          <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <Reveal delay={140}>
              <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-graphite-2">
                A queue, a live feed, and the opportunity you have open — with
                the whole conversation attached. Switch the moment and the
                interface reconfigures around it.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* wider than the shell: the interface is the point here */}
      <Reveal delay={120} className="shell-wide mt-14 md:mt-16">
        <ProductStage />
      </Reveal>
    </section>
  )
}
