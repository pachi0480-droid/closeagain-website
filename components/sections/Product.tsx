import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { SectionMark } from '@/components/ui/Type'
import { capabilities } from '@/data/capabilities'

/**
 * Capability list rendered as a spec sheet — hairline dividers, no cards, no
 * icons in coloured circles. Grid items stretch to their row height, so the
 * horizontal rules line up across every column.
 */

/** Two columns at md, three at lg. Rules sit between columns, never around. */
function cellClasses(i: number) {
  const md = i % 2 === 1 ? 'md:border-l md:pr-0 md:pl-7' : 'md:pr-7 md:pl-0'
  const lg =
    i % 3 === 0
      ? 'lg:border-l-0 lg:pr-8 lg:pl-0'
      : i % 3 === 1
        ? 'lg:border-l lg:px-8'
        : 'lg:border-l lg:pr-0 lg:pl-8'
  return `${md} ${lg}`
}

export function Product() {
  return (
    <section id="product" className="grain relative bg-bone py-24 md:py-32">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionMark index="04" label="Product" />
              <h2 className="mt-7 max-w-[18ch] text-h2 text-graphite">
                One recovery engine. Every place revenue slips.
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 lg:col-span-5 lg:col-start-8 lg:mt-2">
            <Reveal delay={140}>
              <p className="max-w-[46ch] text-lede text-graphite-2">
                The same engine covers the whole lifecycle. You decide how much
                of it you want working, and you can see what each part brought
                back.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120}>
          <ul className="mt-16 grid border-t border-graphite/20 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, i) => (
              <li
                key={capability.id}
                className={`group relative border-b border-rule py-8 md:py-9 ${cellClasses(i)}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="tnum font-mono text-mono-xs text-graphite-3">
                    {capability.index}
                  </span>
                  <span className="font-mono text-mono-xs text-graphite-3 uppercase">
                    {capability.stage}
                  </span>
                </div>

                <h3 className="mt-6 text-h3 text-graphite">{capability.name}</h3>
                <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-graphite-2">
                  {capability.body}
                </p>

                {/* the rule completes in recovery green on hover */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-recover transition-transform duration-700 [transition-timing-function:var(--ease-out-quiet)] group-hover:scale-x-100"
                />
              </li>
            ))}
          </ul>
        </Reveal>

        {/* One clear disclosure for the whole product section, rather than
            hedging every capability sentence. */}
        <Reveal delay={80}>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
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
