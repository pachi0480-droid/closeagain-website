import Link from 'next/link'
import { RecoverySurface } from '@/components/visuals/RecoverySurface'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'

/**
 * One engine across a lifecycle, not six features in a grid. The surface does
 * the explaining; the copy just frames it.
 */
export function Product() {
  return (
    <section id="product" className="grain lit-warm relative bg-bone py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionMark index="03" label="Product" />
              <h2 className="mt-7 max-w-[18ch] text-h2 text-graphite">
                One recovery engine. Every place revenue slips.
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-5 lg:col-start-8 lg:mt-auto lg:pb-2">
            <Reveal delay={140}>
              <p className="max-w-[44ch] text-lede text-graphite-2">
                Pick a part of it. The region it works lights up, and you see
                the line a customer would actually receive.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal delay={120} className="shell-wide mt-14 md:mt-16">
        <RecoverySurface />
      </Reveal>

      <div className="shell">
        <Reveal delay={80}>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-[54ch] text-[0.9375rem] leading-relaxed text-graphite-2">
              CloseAgain is pre-launch. These are the capabilities being built
              first, and the depth of each one is being set with pilot operators
              rather than guessed at.
            </p>
            <Link
              href="/product"
              className="link-rule group shrink-0 text-[0.9375rem] text-graphite"
            >
              See what each part does
              <svg
                viewBox="0 0 12 10"
                fill="none"
                aria-hidden="true"
                className="caret h-[0.6rem] w-[0.72rem]"
              >
                <path
                  d="M0.75 5h9.5M7 1.5 10.5 5 7 8.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
